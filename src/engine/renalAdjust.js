/**
 * Renal adjustment utilities — GFR classification and dose recommendation.
 */

/**
 * Classify GFR into clinical categories.
 * @param {number} gfr - GFR in mL/min
 * @returns {{ t: string, bg: string, c: string }}
 */
export function classifyGFR(gfr) {
  if (gfr >= 130) return { t: 'ARC', bg: 'rgba(75,141,248,.12)', c: 'var(--ac2)' };
  if (gfr >= 90) return { t: 'Normal', bg: 'var(--gnb)', c: 'var(--gn)' };
  if (gfr >= 60) return { t: 'DRC G2', bg: 'var(--amb)', c: 'var(--am)' };
  if (gfr >= 30) return { t: 'DRC G3', bg: 'var(--amb)', c: 'var(--am)' };
  if (gfr >= 15) return { t: 'DRC G4', bg: 'var(--rdb)', c: 'var(--rd)' };
  return { t: 'G5/Dial.', bg: 'var(--rdb)', c: 'var(--rd)' };
}

/**
 * Get renal dose recommendation for a drug at a given GFR.
 * @param {object} drug - Drug object with ren[] array
 * @param {number} gfr - GFR in mL/min
 * @returns {string} Recommendation text
 */
export function renalRec(drug, gfr) {
  const recs = drug.ren;
  if (!recs || !recs.length) return '';
  for (let i = 0; i < recs.length; i++) {
    if (gfr >= recs[i].g) return recs[i].r;
  }
  return recs[recs.length - 1].r;
}
