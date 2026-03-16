/**
 * PK Engine — pure monocompartmental IV infusion model.
 * No DOM access. All functions are pure and testable.
 *
 * Model equations:
 *   Infusion phase:  C(t) = (R₀ / ke·Vd) × (1 − e^(−ke·t))
 *   Post-infusion:   C(t) = C_end × e^(−ke·(t − tInf))
 *   Renal adjustment: t½adj = ln2 / (ke × (fr × GFR/120 + (1 − fr)))
 */

/**
 * Concentration during IV infusion phase.
 * @param {number} t - Time elapsed since infusion start (hours)
 * @param {number} dose - Dose in mg
 * @param {number} tInf - Infusion duration (hours)
 * @param {number} ke - Elimination rate constant (1/h)
 * @param {number} Vd - Volume of distribution (L)
 * @returns {number} Concentration (mg/L)
 */
export function infusionPhase(t, dose, tInf, ke, Vd) {
  const R0 = dose / tInf;
  return (R0 / (ke * Vd)) * (1 - Math.exp(-ke * t));
}

/**
 * Concentration during post-infusion elimination phase.
 * @param {number} t - Time elapsed since infusion END (hours)
 * @param {number} Cend - Concentration at end of infusion (mg/L)
 * @param {number} ke - Elimination rate constant (1/h)
 * @returns {number} Concentration (mg/L)
 */
export function postInfusionPhase(t, Cend, ke) {
  return Cend * Math.exp(-ke * t);
}

/**
 * Adjust half-life for renal function.
 * @param {number} t12base - Baseline half-life (hours)
 * @param {number} renalFraction - Fraction of renal elimination (0-1)
 * @param {number} GFR - Glomerular filtration rate (mL/min)
 * @returns {number} Adjusted half-life (hours)
 */
export function adjustedHalfLife(t12base, renalFraction, GFR) {
  const bk = Math.LN2 / t12base;
  const r = Math.max(GFR, 5) / 120;
  return Math.LN2 / (bk * (renalFraction * r + (1 - renalFraction)));
}

/**
 * Calculate AUC over 24h using trapezoidal rule from time-concentration points.
 * Uses the last 24h of the provided points array.
 * @param {Array<{x: number, y: number}>} points - Time-concentration points
 * @param {number} interval - Dosing interval (hours) — unused but kept for API consistency
 * @returns {number} AUC24 (mg·h/L)
 */
export function calcAUC24(points, interval) {
  const totalH = points[points.length - 1].x;
  let auc = 0;
  const dt = points.length > 1 ? points[1].x - points[0].x : 0.05;
  for (let i = 0; i < points.length; i++) {
    if (points[i].x >= totalH - 24) {
      auc += points[i].y * dt;
    }
  }
  return Math.round(auc);
}

/**
 * Calculate the percentage of a dosing interval where free concentration exceeds MIC (steady-state).
 * @param {Array<{x: number, y: number}>} freePoints - Free concentration points
 * @param {number} mic - MIC value (mg/L)
 * @param {number} interval - Dosing interval (hours)
 * @param {number} ssStart - Start time of the steady-state interval (hours)
 * @returns {number} Percentage fT>MIC (0-100)
 */
export function calcFtMIC(freePoints, mic, interval, ssStart) {
  const ssEnd = ssStart + interval;
  const dt = freePoints.length > 1 ? freePoints[1].x - freePoints[0].x : 0.05;
  let tAbove = 0;
  for (let i = 0; i < freePoints.length; i++) {
    const p = freePoints[i];
    if (p.x >= ssStart && p.x < ssEnd) {
      if (p.y >= mic) tAbove += dt;
    }
  }
  return interval > 0 ? Math.min(100, Math.round((tAbove / interval) * 100)) : 0;
}

/**
 * Full simulation — builds dose schedule and computes concentration-time profile.
 * This is the main entry point replicating the original simulate() function exactly.
 * @param {number} dose - Maintenance dose (mg)
 * @param {number} intH - Dosing interval (hours)
 * @param {number} infMin - Infusion duration (minutes)
 * @param {object} drug - Drug parameters { vdkg, hl, fr, pb, ... }
 * @param {number} gfr - GFR (mL/min)
 * @param {number} micV - MIC (mg/L)
 * @param {number} wt - Body weight (kg)
 * @param {number} [ldose=0] - Loading dose (mg)
 * @param {number} [ldCount=0] - Number of loading doses
 * @param {number} [ldInt=12] - Loading dose interval (hours)
 * @param {string} [drugKey=''] - Drug key for determining totalH
 * @returns {object} Simulation results
 */
export function simulate(dose, intH, infMin, drug, gfr, micV, wt, ldose = 0, ldCount = 0, ldInt = 12, drugKey = '') {
  const ah = adjustedHalfLife(drug.hl, drug.fr, gfr);
  const ke = Math.LN2 / ah;
  const Vd = drug.vdkg * wt;
  const ff = 1 - drug.pb;
  const tInfH = Math.max(infMin / 60, 0.01);
  const totalH = drugKey === 'teicoplanin' ? 168 : drugKey === 'fluconazole' ? 96 : drugKey === 'amphoB_lipo' ? 72 : 48;
  const dt = totalH > 60 ? 0.25 : 0.05;

  // Build dose schedule
  const schedule = [];
  let t_cursor = 0;
  const nLd = ldose > 0 ? Math.max(ldCount, 1) : 0;
  const ldInterval = ldInt || 12;

  for (let i = 0; i < nLd; i++) {
    schedule.push({ t: t_cursor, d: ldose });
    t_cursor += ldInterval;
  }

  const lastLdTime = nLd > 0 ? schedule[schedule.length - 1].t : 0;
  let maintStart = nLd > 0 ? lastLdTime + intH : 0;
  while (maintStart < totalH) {
    schedule.push({ t: maintStart, d: dose });
    maintStart += intH;
  }

  const pts = [];
  const fpts = [];
  let cmax = 0, cmin = Infinity;
  let auc24 = 0;

  let lastMaintStart = schedule.length > 0 ? schedule[schedule.length - 1].t : 0;
  const maintDoses = schedule.filter(function (s) { return s.d === dose; });
  if (maintDoses.length >= 2) lastMaintStart = maintDoses[maintDoses.length - 1].t;
  else if (maintDoses.length === 1) lastMaintStart = maintDoses[0].t;
  const ssStart = lastMaintStart;
  const ssEnd = lastMaintStart + intH;
  let tAboveSS = 0;

  for (let t = 0; t <= totalH; t += dt) {
    let c = 0;
    for (let si = 0; si < schedule.length; si++) {
      const el = t - schedule[si].t;
      if (el < 0) continue;
      const R0d = schedule[si].d / tInfH;
      if (el <= tInfH) {
        c += (R0d / (ke * Vd)) * (1 - Math.exp(-ke * el));
      } else {
        const cE = (R0d / (ke * Vd)) * (1 - Math.exp(-ke * tInfH));
        c += cE * Math.exp(-ke * (el - tInfH));
      }
    }
    const cf = c * ff;
    const rx = Math.round(t * 100) / 100;
    const ry = Math.round(c * 100) / 100;
    pts.push({ x: rx, y: ry });
    fpts.push({ x: rx, y: Math.round(cf * 100) / 100 });
    if (c > cmax) cmax = c;
    if (t >= ssStart && t < ssEnd && c < cmin) cmin = c;
    if (t >= ssStart && t < ssEnd) { if (cf >= micV) tAboveSS += dt; }
    if (t >= totalH - 24) auc24 += c * dt;
  }

  const pctSS = intH > 0 ? Math.min(100, Math.round((tAboveSS / intH) * 100)) : 0;
  return {
    pts, fpts,
    cmax: Math.round(cmax * 10) / 10,
    cmin: Math.round(cmin * 10) / 10,
    pctMIC: pctSS,
    auc24: Math.round(auc24),
    aucMic: micV > 0 ? Math.round(auc24 / micV) : 0,
    adjHL: Math.round(ah * 10) / 10,
    totalH,
    cmaxMic: micV > 0 ? Math.round((cmax * ff) / micV * 10) / 10 : 0,
    intH, ssStart, schedule
  };
}
