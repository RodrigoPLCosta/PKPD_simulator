// @ts-check

/**
 * Metric cards — status badges, subtitles and icon mapping.
 *
 * Pure helpers (no DOM access) plus a one-time icon-injection helper used
 * during init. The render-on-update logic lives in controls.js but delegates
 * status computation here so educPanel and the cards stay in sync.
 */

import { icon, setIcon } from './icons.js';

const FAMILY_BY_CAT = {
  Carbapenem: 'Beta-lactâmico',
  Cefalosporina: 'Beta-lactâmico',
  Penicilina: 'Beta-lactâmico',
  Aminoglicosídeo: 'Aminoglicosídeo',
  Glicopeptídeo: 'Glicopeptídeo',
  Fluoroquinolona: 'Fluoroquinolona',
  Antifúngico: 'Antifúngico',
  Lipopeptídeo: 'Lipopeptídeo',
  Nitroimidazol: 'Nitroimidazol',
  Oxazolidinona: 'Oxazolidinona',
  Polimixina: 'Polimixina'
};

const METRIC_ICONS = {
  class: 'clock',
  cmax: 'curve',
  cmin: 'arrowDown',
  tmic: 'target',
  auc: 'arrowUp',
  cmaxmic: 'bell'
};

/**
 * Map a drug category to its broader chemical/clinical family.
 * @param {string} cat
 * @returns {string}
 */
export function familyForCat(cat) {
  return FAMILY_BY_CAT[cat] || cat || '';
}

/**
 * Compute the status badge for fT > MIC.
 * Mirrors the thresholds in educPanel.js.
 * @param {number} pctMIC
 * @returns {{ level: 'ok'|'warn'|'danger', text: string }}
 */
export function tmicStatus(pctMIC) {
  if (pctMIC >= 60) return { level: 'ok', text: 'Alvo atingido' };
  if (pctMIC >= 40) return { level: 'warn', text: 'Limítrofe' };
  return { level: 'danger', text: 'Abaixo do alvo' };
}

/**
 * Compute the status badge for AUC/MIC. Drug-specific overrides for
 * vancomycin and polymyxin B match the PK/PD targets used elsewhere.
 * @param {string} sel
 * @param {{ aucMic: number, auc24: number }} r
 * @returns {{ level: 'ok'|'warn'|'danger', text: string }}
 */
export function aucStatus(sel, r) {
  if (sel === 'vancomycin') {
    if (r.aucMic >= 400 && r.aucMic <= 600) return { level: 'ok', text: '400–600 (IDSA)' };
    if (r.aucMic < 400) return { level: 'danger', text: 'Subterapêutico' };
    return { level: 'danger', text: 'Risco toxicidade' };
  }
  if (sel === 'polymyxinB') {
    if (r.auc24 >= 50 && r.auc24 <= 100) return { level: 'ok', text: 'AUCss adequado' };
    if (r.auc24 < 50) return { level: 'warn', text: 'Subterapêutico' };
    return { level: 'danger', text: 'Risco toxicidade' };
  }
  if (r.aucMic >= 125) return { level: 'ok', text: 'Alvo atingido' };
  if (r.aucMic >= 80) return { level: 'warn', text: 'Limítrofe' };
  return { level: 'danger', text: 'Abaixo do alvo' };
}

/**
 * Compute the status badge for trough levels. Only teicoplanin and
 * voriconazole have well-defined therapeutic windows here.
 * @param {string} sel
 * @param {{ cmin: number }} r
 * @returns {{ level: 'ok'|'warn'|'danger', text: string } | null}
 */
export function troughStatus(sel, r) {
  if (sel === 'teicoplanin') {
    if (r.cmin >= 15 && r.cmin <= 30) return { level: 'ok', text: 'Adequado (15–30)' };
    if (r.cmin < 15) return { level: 'warn', text: 'Subterapêutico' };
    return { level: 'danger', text: 'Risco toxicidade' };
  }
  if (sel === 'voriconazole') {
    if (r.cmin >= 2 && r.cmin <= 5.5) return { level: 'ok', text: 'Faixa terapêutica' };
    if (r.cmin < 2) return { level: 'danger', text: 'Risco de falha' };
    return { level: 'danger', text: 'Risco neurotoxicidade' };
  }
  return null;
}

/**
 * Compute the status badge for fCmax/MIC.
 * @param {{ cmaxMic: number }} r
 * @returns {{ level: 'ok'|'warn', text: string }}
 */
export function cmaxStatus(r) {
  if (r.cmaxMic >= 8) return { level: 'ok', text: 'Alvo atingido' };
  return { level: 'warn', text: 'Abaixo do alvo' };
}

/**
 * Render a status object as the inner HTML for a `.msb` container.
 * Returns an empty string when the status is null.
 * @param {{ level: 'ok'|'warn'|'danger', text: string } | null} status
 * @returns {string}
 */
export function renderStatusBadge(status) {
  if (!status) return '';
  const ic = status.level === 'ok' ? 'check' : status.level === 'warn' ? 'alertTriangle' : 'alertTriangle';
  return `<span class="badge ${status.level}">${icon(ic, { size: 12 })}${status.text}</span>`;
}

/**
 * Inject the icon for each metric card once during init.
 */
export function injectMetricIcons() {
  for (const [metric, name] of Object.entries(METRIC_ICONS)) {
    const card = document.querySelector(`.mc[data-metric="${metric}"] .mc-icon`);
    if (card instanceof HTMLElement) setIcon(card, name, { size: 16 });
  }
}
