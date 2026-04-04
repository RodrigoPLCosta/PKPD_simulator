/**
 * Pure helpers extracted from the controls module so they can be tested without DOM.
 */

export function getWeightBasedDose(drug, wt) {
  if (!drug?.mgkg) return drug?.dose ?? 0;
  const weight = Number.isFinite(wt) && wt > 0 ? wt : 70;
  const step = drug.dStep || 1;
  const rawDose = drug.mgkg * weight;
  const roundedDose = Math.round(rawDose / step) * step;
  return Math.max(drug.dMin, Math.min(drug.dMax, roundedDose));
}

export function getContinuousInfusionMinutes(currentInfMin, previousIntervalH, nextIntervalH) {
  const current = Number.isFinite(currentInfMin) ? currentInfMin : 0;
  const previousInterval = Number.isFinite(previousIntervalH) ? previousIntervalH : 0;
  const nextInterval = Number.isFinite(nextIntervalH) ? nextIntervalH : 0;

  return current === previousInterval * 60 ? nextInterval * 60 : current;
}
