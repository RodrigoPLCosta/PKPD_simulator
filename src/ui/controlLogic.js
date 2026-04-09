// @ts-check

/**
 * Pure helpers extracted from the controls module so they can be tested without DOM.
 */

/**
 * @typedef {import('../types/contracts.js').Drug} Drug
 */

export const MAX_INFUSION_MINUTES = 1440;

/**
 * @param {Drug | undefined} drug
 * @param {number} wt
 * @returns {number}
 */
export function getWeightBasedDose(drug, wt) {
  if (!drug?.mgkg) return drug?.dose ?? 0;
  const weight = Number.isFinite(wt) && wt > 0 ? wt : 70;
  const step = drug.dStep || 1;
  const rawDose = drug.mgkg * weight;
  const roundedDose = Math.round(rawDose / step) * step;
  const minDose = drug.dMin || 0;
  const maxDose = drug.dMax || roundedDose;
  return Math.max(minDose, Math.min(maxDose, roundedDose));
}

/**
 * @param {number} minutes
 * @param {number} [maxMinutes]
 * @returns {number}
 */
export function clampInfusionMinutes(minutes, maxMinutes = MAX_INFUSION_MINUTES) {
  const value = Number.isFinite(minutes) ? minutes : 0;
  return Math.max(0, Math.min(maxMinutes, value));
}

/**
 * @param {number} currentInfMin
 * @param {number} previousIntervalH
 * @param {number} nextIntervalH
 * @param {number} [maxMinutes]
 * @returns {number}
 */
export function getContinuousInfusionMinutes(currentInfMin, previousIntervalH, nextIntervalH, maxMinutes = MAX_INFUSION_MINUTES) {
  const current = clampInfusionMinutes(currentInfMin, maxMinutes);
  const previousInterval = Number.isFinite(previousIntervalH) ? previousIntervalH : 0;
  const nextInterval = Number.isFinite(nextIntervalH) ? nextIntervalH : 0;

  return current === previousInterval * 60 ? clampInfusionMinutes(nextInterval * 60, maxMinutes) : current;
}
