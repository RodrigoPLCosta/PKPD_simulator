// @ts-check

/**
 * @typedef {import('../types/contracts.js').UIState} UIState
 */

/**
 * @param {UIState} state
 * @returns {UIState}
 */
export function cloneUIState(state) {
  return { ...state };
}

/**
 * @param {UIState} left
 * @param {UIState} right
 * @returns {boolean}
 */
export function uiStatesEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}
