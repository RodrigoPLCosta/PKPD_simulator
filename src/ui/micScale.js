// @ts-check

/**
 * @typedef {import('../types/contracts.js').UIState} UIState
 */

export const MIC_STEPS = [0.0625, 0.125, 0.25, 0.5, 1, 2, 4, 8, 16, 32, 64, 128, 256];

/**
 * @param {number | string} index
 * @returns {number}
 */
export function micFromSlider(index) {
  const normalizedIndex = Number(index);
  const safeIndex = Number.isFinite(normalizedIndex) ? Math.round(normalizedIndex) : 0;
  return MIC_STEPS[Math.max(0, Math.min(MIC_STEPS.length - 1, safeIndex))];
}

/**
 * @param {number | string} mic
 * @returns {number}
 */
export function sliderFromMic(mic) {
  const normalizedMic = Number(mic);
  if (!Number.isFinite(normalizedMic)) return 0;

  for (let i = 0; i < MIC_STEPS.length; i++) {
    if (MIC_STEPS[i] >= normalizedMic - 0.001) return i;
  }

  return MIC_STEPS.length - 1;
}
