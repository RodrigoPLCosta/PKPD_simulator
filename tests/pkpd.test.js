import { describe, it, expect } from 'vitest';
import { D } from '../src/drugs/index.js';
import { adjustedHalfLife, calcAUC24, calcFtMIC, simulate } from '../src/engine/pkEngine.js';
import { clampInfusionMinutes, getContinuousInfusionMinutes, getWeightBasedDose } from '../src/ui/controlLogic.js';

function analyticalCmax(dose, infMin, drug, wt, gfr) {
  const ah = adjustedHalfLife(drug.hl, drug.fr, gfr);
  const ke = Math.LN2 / ah;
  const Vd = drug.vdkg * wt;
  const tInf = infMin / 60;
  const R0 = dose / tInf;
  return (R0 / (ke * Vd)) * (1 - Math.exp(-ke * tInf));
}

describe('adjustedHalfLife', () => {
  it('returns baseline t1/2 when GFR = 120 for meropenem', () => {
    expect(adjustedHalfLife(D.meropenem.hl, D.meropenem.fr, 120)).toBeCloseTo(1.0, 1);
  });

  it('prolongs t1/2 when GFR is reduced', () => {
    const result = adjustedHalfLife(D.meropenem.hl, D.meropenem.fr, 30);
    expect(result).toBeGreaterThan(1.5);
    expect(result).toBeLessThan(2.5);
  });

  it('clamps GFR to a minimum of 5 mL/min', () => {
    const atZero = adjustedHalfLife(D.meropenem.hl, D.meropenem.fr, 0);
    const atFive = adjustedHalfLife(D.meropenem.hl, D.meropenem.fr, 5);
    expect(atZero).toBeCloseTo(atFive, 5);
  });
});

describe('simulate', () => {
  it('keeps meropenem Cmax in the expected range for 1 g q8h over 30 min', () => {
    const result = simulate(1000, 8, 30, D.meropenem, 120, 2, 70, 0, 0, 12, 'meropenem');
    expect(result.cmax).toBeGreaterThanOrEqual(40);
    expect(result.cmax).toBeLessThanOrEqual(65);
    expect(result.cmin).toBeLessThan(5);
    expect(result.pctMIC).toBeGreaterThanOrEqual(30);
  });

  it('improves meropenem fT>MIC with extended infusion', () => {
    const standard = simulate(1000, 8, 30, D.meropenem, 120, 2, 70, 0, 0, 12, 'meropenem');
    const extended = simulate(1000, 8, 180, D.meropenem, 120, 2, 70, 0, 0, 12, 'meropenem');
    expect(extended.pctMIC).toBeGreaterThanOrEqual(standard.pctMIC);
  });

  it('keeps vancomycin AUC/MIC in the therapeutic neighborhood for 1 g q12h', () => {
    const result = simulate(1000, 12, 60, D.vancomycin, 120, 1, 70, 0, 0, 12, 'vancomycin');
    expect(result.cmax).toBeGreaterThanOrEqual(20);
    expect(result.cmax).toBeLessThanOrEqual(50);
    expect(result.aucMic).toBeGreaterThanOrEqual(250);
    expect(result.aucMic).toBeLessThanOrEqual(700);
  });

  it('increases vancomycin AUC24 with renal impairment', () => {
    const normal = simulate(1000, 12, 60, D.vancomycin, 120, 1, 70, 0, 0, 12, 'vancomycin');
    const impaired = simulate(1000, 12, 60, D.vancomycin, 30, 1, 70, 0, 0, 12, 'vancomycin');
    expect(impaired.auc24).toBeGreaterThan(normal.auc24);
  });

  it('keeps amikacin peak in the expected range for once-daily dosing', () => {
    const result = simulate(1050, 24, 30, D.amikacin, 120, 8, 70, 0, 0, 12, 'amikacin');
    expect(result.cmax).toBeGreaterThanOrEqual(45);
    expect(result.cmax).toBeLessThanOrEqual(75);
    expect(result.cmin).toBeLessThan(10);
  });

  it('produces higher amikacin Cmax with once-daily dosing than split dosing for same daily dose', () => {
    const odd = simulate(1050, 24, 30, D.amikacin, 120, 8, 70, 0, 0, 12, 'amikacin');
    const bid = simulate(525, 12, 30, D.amikacin, 120, 8, 70, 0, 0, 12, 'amikacin');
    expect(odd.cmax).toBeGreaterThan(bid.cmax);
  });

  it('keeps cefepime Cmax in the expected range for 2 g q8h', () => {
    const result = simulate(2000, 8, 30, D.cefepime, 120, 8, 70, 0, 0, 12, 'cefepime');
    expect(result.cmax).toBeGreaterThanOrEqual(80);
    expect(result.cmax).toBeLessThanOrEqual(140);
  });

  it('improves cefepime fT>MIC with extended infusion', () => {
    const standard = simulate(2000, 8, 30, D.cefepime, 120, 8, 70, 0, 0, 12, 'cefepime');
    const extended = simulate(2000, 8, 180, D.cefepime, 120, 8, 70, 0, 0, 12, 'cefepime');
    expect(extended.pctMIC).toBeGreaterThanOrEqual(standard.pctMIC);
  });

  it('keeps piperacillin/tazobactam Cmax in the expected range for 4.5 g q6h', () => {
    const result = simulate(4500, 6, 30, D.piptazo, 120, 16, 70, 0, 0, 12, 'piptazo');
    expect(result.cmax).toBeGreaterThanOrEqual(200);
    expect(result.cmax).toBeLessThanOrEqual(350);
  });

  it('scales meropenem Cmax approximately linearly with dose', () => {
    const low = simulate(500, 8, 30, D.meropenem, 120, 2, 70, 0, 0, 12, 'meropenem');
    const high = simulate(1000, 8, 30, D.meropenem, 120, 2, 70, 0, 0, 12, 'meropenem');
    const ratio = high.cmax / low.cmax;
    expect(ratio).toBeGreaterThan(1.8);
    expect(ratio).toBeLessThan(2.2);
  });

  it('keeps concentration at t=0 equal to zero', () => {
    const result = simulate(1000, 24, 30, D.amikacin, 120, 8, 70, 0, 0, 12, 'amikacin');
    expect(result.pts[0].y).toBe(0);
  });

  it('increases initial exposure when a loading dose is given', () => {
    const noLoad = simulate(1000, 12, 60, D.vancomycin, 120, 1, 70, 0, 0, 12, 'vancomycin');
    const withLoad = simulate(1000, 12, 60, D.vancomycin, 120, 1, 70, 2000, 1, 12, 'vancomycin');
    expect(withLoad.cmax).toBeGreaterThan(noLoad.cmax);
  });

  it('matches the analytical first-interval meropenem peak', () => {
    const expected = analyticalCmax(1000, 30, D.meropenem, 70, 120);
    const result = simulate(1000, 8, 30, D.meropenem, 120, 2, 70, 0, 0, 12, 'meropenem');
    const firstPeak = Math.max(...result.pts.filter(function (p) { return p.x <= 1; }).map(function (p) { return p.y; }));
    expect(firstPeak).toBeCloseTo(expected, 0);
  });

  it('returns zero exposure ratios when MIC = 0', () => {
    const result = simulate(1000, 8, 30, D.meropenem, 120, 0, 70, 0, 0, 12, 'meropenem');
    expect(result.aucMic).toBe(0);
    expect(result.cmaxMic).toBe(0);
  });

  it('keeps simulate AUC24 aligned with the trapezoidal helper for long-horizon drugs', () => {
    const result = simulate(400, 24, 30, D.teicoplanin, 120, 2, 70, 0, 0, 12, 'teicoplanin');
    expect(result.auc24).toBe(calcAUC24(result.pts, result.intH));
    expect(result.aucMic).toBe(Math.round(result.auc24 / 2));
  });
});

describe('engine helpers', () => {
  it('calculates AUC24 with the trapezoidal rule on the last 24 hours only', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 12, y: 12 },
      { x: 24, y: 24 },
      { x: 36, y: 36 }
    ];
    expect(calcAUC24(points, 8)).toBe(576);
  });

  it('calculates fT>MIC within the steady-state window', () => {
    const freePoints = [
      { x: 0, y: 5 },
      { x: 2, y: 5 },
      { x: 4, y: 5 },
      { x: 6, y: 1 },
      { x: 8, y: 1 },
      { x: 10, y: 5 },
      { x: 12, y: 5 },
      { x: 14, y: 1 },
      { x: 16, y: 1 }
    ];
    expect(calcFtMIC(freePoints, 4, 8, 8)).toBe(50);
  });
});

describe('controlLogic helpers', () => {
  it('recalculates a weight-based dose using the current patient weight', () => {
    expect(getWeightBasedDose(D.vancomycin, 80)).toBe(1250);
    expect(getWeightBasedDose(D.teicoplanin, 80)).toBe(400);
  });

  it('preserves fixed default dose for non-mg/kg drugs', () => {
    expect(getWeightBasedDose(D.meropenem, 120)).toBe(D.meropenem.dose);
  });

  it('updates continuous-infusion-like duration when the dosing interval changes', () => {
    expect(getContinuousInfusionMinutes(480, 8, 12)).toBe(720);
  });

  it('keeps infusion duration unchanged when the regimen is not continuous-like', () => {
    expect(getContinuousInfusionMinutes(180, 8, 12)).toBe(180);
  });

  it('clamps continuous-infusion-like duration to the supported maximum', () => {
    expect(getContinuousInfusionMinutes(1440, 24, 48)).toBe(1440);
    expect(clampInfusionMinutes(2880)).toBe(1440);
  });
});
