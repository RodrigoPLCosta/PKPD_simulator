import { describe, it, expect } from 'vitest';
import { D, SCENARIOS, ADV } from '../src/drugs/index.js';
import EDU from '../src/drugs/educContent.js';
import { simulate } from '../src/engine/pkEngine.js';
import { classifyGFR, renalRec } from '../src/engine/renalAdjust.js';
import { getAlerts, UNCERTAINTY_DRUGS } from '../src/engine/pkpdTargets.js';

describe('Drug database integrity', () => {
  const drugKeys = Object.keys(D);
  const reqFields = ['l','cat','dose','int','inf','mic','vdkg','hl','fr','pb','pk','tgt','tt','col','dMin','dMax','dStep','ints','doses','infP','std','ren','info'];

  it('should have exactly 23 drugs', () => {
    expect(drugKeys.length).toBe(23);
  });

  it.each(reqFields)('all drugs should have field "%s"', (field) => {
    drugKeys.forEach(k => {
      expect(D[k], `${k} missing "${field}"`).toHaveProperty(field);
    });
  });

  it('all drugs should have ADV entry', () => {
    drugKeys.forEach(k => {
      expect(ADV, `ADV missing for ${k}`).toHaveProperty(k);
      expect(ADV[k]).toHaveProperty('adv');
      expect(ADV[k]).toHaveProperty('model');
      expect(ADV[k]).toHaveProperty('advRef');
    });
  });

  it('all scenario drug keys should reference existing drugs', () => {
    SCENARIOS.forEach(s => {
      expect(D, `Scenario "${s.l}" references unknown drug "${s.d}"`).toHaveProperty(s.d);
    });
  });

  it('should have 13 scenarios', () => {
    expect(SCENARIOS.length).toBe(13);
  });

  it('EDU should have class keys and drug-specific entries', () => {
    expect(EDU).toHaveProperty('_tmic');
    expect(EDU).toHaveProperty('_auc');
    expect(EDU).toHaveProperty('_trough');
    expect(EDU).toHaveProperty('_cmax');
    expect(EDU).toHaveProperty('meropenem');
    expect(EDU).toHaveProperty('vancomycin');
  });
});

describe('Simulate all 23 drugs without error', () => {
  const drugKeys = Object.keys(D);

  it.each(drugKeys)('simulate %s with default params', (k) => {
    const d = D[k];
    const r = simulate(d.dose, d.int, d.inf, d, 120, d.mic, 70, 0, 0, 12, k);
    expect(r.cmax).toBeGreaterThan(0);
    expect(r.cmin).toBeGreaterThanOrEqual(0);
    expect(r.pts.length).toBeGreaterThan(10);
    expect(r.totalH).toBeGreaterThanOrEqual(48);
    expect(r.schedule.length).toBeGreaterThanOrEqual(1);
  });
});

describe('Renal adjustment module', () => {
  it('classifyGFR returns correct categories', () => {
    expect(classifyGFR(150).t).toBe('ARC');
    expect(classifyGFR(100).t).toBe('Normal');
    expect(classifyGFR(70).t).toBe('DRC G2');
    expect(classifyGFR(40).t).toBe('DRC G3');
    expect(classifyGFR(20).t).toBe('DRC G4');
    expect(classifyGFR(10).t).toBe('G5/Dial.');
  });

  it('renalRec returns string for drugs with renal adjustments', () => {
    const rec = renalRec(D.meropenem, 20);
    expect(typeof rec).toBe('string');
    expect(rec.length).toBeGreaterThan(0);
  });
});

describe('Alerts and uncertainty', () => {
  it('getAlerts returns array for vancomycin', () => {
    const r = simulate(1000, 12, 60, D.vancomycin, 120, 1, 70, 0, 0, 12, 'vancomycin');
    const al = getAlerts('vancomycin', D.vancomycin, r, 120, ADV);
    expect(Array.isArray(al.ms)).toBe(true);
    expect(al.ms.length).toBeGreaterThan(0);
    expect(['warn', 'danger']).toContain(al.lv);
  });

  it('UNCERTAINTY_DRUGS has teicoplanin, voriconazole, amphoB_lipo', () => {
    expect(UNCERTAINTY_DRUGS).toHaveProperty('teicoplanin');
    expect(UNCERTAINTY_DRUGS).toHaveProperty('voriconazole');
    expect(UNCERTAINTY_DRUGS).toHaveProperty('amphoB_lipo');
  });
});
