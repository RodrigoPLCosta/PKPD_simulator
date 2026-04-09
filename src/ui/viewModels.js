// @ts-check

/**
 * @typedef {import('../types/contracts.js').AlertViewModel} AlertViewModel
 * @typedef {import('../types/contracts.js').Drug} Drug
 * @typedef {import('../types/contracts.js').PkInfoViewModel} PkInfoViewModel
 * @typedef {import('../types/contracts.js').SimulationResult} SimulationResult
 */

/**
 * @param {{ ms: string[], lv: 'warn' | 'danger' | 'ok' }} alertResult
 * @returns {AlertViewModel}
 */
export function buildAlertViewModel(alertResult) {
  return {
    level: alertResult.lv,
    sections: alertResult.ms
  };
}

/**
 * @param {AlertViewModel} alertViewModel
 * @returns {string}
 */
export function renderAlertHtml(alertViewModel) {
  return alertViewModel.sections.join('<div class="al-sep"></div>');
}

/**
 * @param {Drug} drug
 * @param {SimulationResult} result
 * @param {number} weight
 * @returns {PkInfoViewModel}
 */
export function buildPkInfoViewModel(drug, result, weight) {
  const vdL = Math.round(drug.vdkg * weight);

  return {
    title: drug.l,
    cells: [
      { key: 'Vd', value: `${vdL} L (${drug.vdkg} L/kg × ${weight}kg)` },
      { key: 't½ ajust.', value: `${result.adjHL} h` },
      { key: 'Lig. proteica', value: `${Math.round(drug.pb * 100)}%` },
      { key: 'Elim. renal', value: `${Math.round(drug.fr * 100)}%` }
    ],
    target: drug.tgt,
    reference: drug.info,
    warning: drug.warn
  };
}

/**
 * @param {PkInfoViewModel} pkInfoViewModel
 * @returns {string}
 */
export function renderPkInfoHtml(pkInfoViewModel) {
  const cells = pkInfoViewModel.cells
    .map(function (cell) {
      return `<div class="pk-cell"><div class="pk-k">${cell.key}</div><div class="pk-v">${cell.value}</div></div>`;
    })
    .join('');

  let html = `<div class="pk-title">${pkInfoViewModel.title}</div>`;
  html += `<div class="pk-grid">${cells}</div>`;
  html += `<div class="pk-tgt">Alvo: ${pkInfoViewModel.target}</div>`;
  html += `<div class="pk-ref">${pkInfoViewModel.reference}</div>`;

  if (pkInfoViewModel.warning) {
    html += `<div class="warn-model">${pkInfoViewModel.warning}</div>`;
  }

  return html;
}
