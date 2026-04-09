// @ts-check

import { getWeightBasedDose } from './controlLogic.js';

/**
 * @typedef {import('../types/contracts.js').Drug} Drug
 * @typedef {import('../types/contracts.js').UIState} UIState
 */

/**
 * Builds the canonical default state for a selected drug.
 *
 * @param {string} drugKey
 * @param {Drug} drug
 * @param {number} weight
 * @param {{ gfr: number }} patientState
 * @returns {UIState}
 */
export function getDefaultDrugState(drugKey, drug, weight, patientState) {
  const initialDose = drug.mgkg ? getWeightBasedDose(drug, weight) : drug.dose;
  const defaultLoadingCount = drug.defLd || 0;
  const defaultLoadingInterval = drug.defLdInt || 12;

  return {
    sel: drugKey,
    dose: initialDose,
    int: drug.int,
    inf: drug.inf,
    mic: drug.mic,
    gfr: patientState.gfr,
    wt: weight,
    ld: 0,
    ldc: defaultLoadingCount,
    ldi: defaultLoadingInterval,
    ldOpen: defaultLoadingCount > 0
  };
}
