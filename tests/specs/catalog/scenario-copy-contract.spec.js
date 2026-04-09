import { describe, expect, it } from 'vitest';
import { SCENARIOS } from '../../../src/drugs/index.js';

describe('catalog contract: scenario copy matches the real patch', () => {
  it('describes infusion and interval overrides in human-readable copy', () => {
    SCENARIOS.forEach((scenario) => {
      const copy = `${scenario.l} ${scenario.desc}`.toLowerCase();

      if (typeof scenario.p.int === 'number') {
        expect(copy, `${scenario.l} should mention the patched interval`).toContain(`${scenario.p.int}h`);
      }

      if (typeof scenario.p.inf === 'number') {
        if (scenario.p.inf % 60 === 0) {
          expect(copy, `${scenario.l} should mention the patched infusion duration`).toContain(`${scenario.p.inf / 60}h`);
        } else {
          expect(copy, `${scenario.l} should mention the patched infusion duration`).toContain(`${scenario.p.inf}min`);
        }
      }

      if (typeof scenario.p.gfr === 'number' && scenario.p.gfr >= 130) {
        expect(copy, `${scenario.l} should mention ARC when patching high GFR`).toContain('arc');
      }

      if (typeof scenario.p.gfr === 'number' && scenario.p.gfr < 30) {
        expect(copy, `${scenario.l} should mention renal dysfunction when patching low GFR`).toMatch(/drc|renal/);
      }
    });
  });
});
