/**
 * Pure helpers extracted from the controls module so they can be tested without DOM.
 */

export const MAX_INFUSION_MINUTES = 1440;

export function getWeightBasedDose(drug, wt) {
  if (!drug?.mgkg) return drug?.dose ?? 0;
  const weight = Number.isFinite(wt) && wt > 0 ? wt : 70;
  const step = drug.dStep || 1;
  const rawDose = drug.mgkg * weight;
  const roundedDose = Math.round(rawDose / step) * step;
  return Math.max(drug.dMin, Math.min(drug.dMax, roundedDose));
}

export function clampInfusionMinutes(minutes, maxMinutes = MAX_INFUSION_MINUTES) {
  const value = Number.isFinite(minutes) ? minutes : 0;
  return Math.max(0, Math.min(maxMinutes, value));
}

export function getContinuousInfusionMinutes(currentInfMin, previousIntervalH, nextIntervalH, maxMinutes = MAX_INFUSION_MINUTES) {
  const current = clampInfusionMinutes(currentInfMin, maxMinutes);
  const previousInterval = Number.isFinite(previousIntervalH) ? previousIntervalH : 0;
  const nextInterval = Number.isFinite(nextIntervalH) ? nextIntervalH : 0;

  return current === previousInterval * 60 ? clampInfusionMinutes(nextInterval * 60, maxMinutes) : current;
}
