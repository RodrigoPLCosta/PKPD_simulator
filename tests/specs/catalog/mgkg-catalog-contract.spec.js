import { describe, expect, it } from 'vitest';
import { D } from '../../../src/drugs/index.js';
import { getWeightBasedDose } from '../../../src/ui/controlLogic.js';

describe('catalog contract: mg/kg defaults stay deterministic', () => {
  it('keeps every weight-based default aligned with the canonical 70 kg calculation', () => {
    Object.entries(D).forEach(([drugKey, drug]) => {
      if (!drug.mgkg) return;

      const canonicalDose = getWeightBasedDose(drug, 70);
      expect(drug.dose, `${drugKey} default dose drifted from canonical mg/kg rounding`).toBe(canonicalDose);
      expect(drug.doses, `${drugKey} quick doses must expose the canonical default`).toContain(canonicalDose);
    });
  });
});
