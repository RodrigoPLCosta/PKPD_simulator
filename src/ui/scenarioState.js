// @ts-check

/**
 * @typedef {import('../types/contracts.js').ScenarioPatch} ScenarioPatch
 * @typedef {import('../types/contracts.js').UIState} UIState
 */

/**
 * Applies a scenario patch to an existing UI state.
 *
 * @param {UIState} baseState
 * @param {ScenarioPatch} patch
 * @returns {UIState}
 */
export function applyScenarioPatch(baseState, patch) {
  const nextState = {
    ...baseState,
    ...patch
  };

  if (typeof patch.ld === 'number') {
    nextState.ldOpen = patch.ld > 0 || nextState.ldc > 0;
  }

  if (typeof patch.ldc === 'number' && patch.ldc > 0) {
    nextState.ldOpen = true;
  }

  return nextState;
}
