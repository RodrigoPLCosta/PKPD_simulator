import { describe, expect, it } from 'vitest';
import { D } from '../../../src/drugs/index.js';
import { calcAUC24, simulate } from '../../../src/engine/pkEngine.js';

describe('domain contract: clinically meaningful regimen deltas', () => {
  it('never penalizes meropenem fT>MIC when moving from 30 min to extended infusion', () => {
    const standard = simulate(1000, 8, 30, D.meropenem, 120, 2, 70, 0, 0, 12, 'meropenem');
    const extended = simulate(1000, 8, 180, D.meropenem, 120, 2, 70, 0, 0, 12, 'meropenem');

    expect(extended.pctMIC).toBeGreaterThanOrEqual(standard.pctMIC);
  });

  it('increases vancomycin AUC24 when renal function worsens', () => {
    const baseline = simulate(1000, 12, 60, D.vancomycin, 120, 1, 70, 0, 0, 12, 'vancomycin');
    const impaired = simulate(1000, 12, 60, D.vancomycin, 30, 1, 70, 0, 0, 12, 'vancomycin');

    expect(impaired.auc24).toBeGreaterThan(baseline.auc24);
  });

  it('keeps long-horizon AUC24 contracts stable for teicoplanin', () => {
    const result = simulate(400, 24, 30, D.teicoplanin, 120, 2, 70, 0, 0, 12, 'teicoplanin');

    expect(result.auc24).toBe(calcAUC24(result.pts, result.intH));
    expect(result.totalH).toBe(168);
  });
});
