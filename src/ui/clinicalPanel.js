// @ts-check

/**
 * Clinical panel — three colored summary cards + tabbed deep-dive
 * (Interpretação clínica · Limitações · Referências).
 *
 * Pulls together what was previously split across the educational panel
 * and the alert banner. Owns all DOM updates for the post-chart area
 * except the metric cards and the PK parameters drawer.
 */

import EDU from '../drugs/educContent.js';
import { ADV } from '../drugs/index.js';
import { UNCERTAINTY_DRUGS, getAlerts } from '../engine/pkpdTargets.js';
import { aucStatus, cmaxStatus, renderStatusBadge, tmicStatus, troughStatus } from './metricCards.js';
import { icon } from './icons.js';

/**
 * Compute the primary-metric status (mirrors metricCards helpers but also
 * exposes the rendered metric label for the summary card).
 * @param {string} sel
 * @param {object} drug
 * @param {object} r
 */
function primaryMetricSummary(sel, drug, r) {
  if (drug.tt === 'tmic') {
    return { label: 'fT&gt;MIC = <b>' + r.pctMIC + '%</b>', status: tmicStatus(r.pctMIC) };
  }
  if (drug.tt === 'auc') {
    return { label: 'AUC<sub>24</sub>/MIC = <b>' + r.aucMic + '</b>', status: aucStatus(sel, r) };
  }
  if (drug.tt === 'trough') {
    const status = troughStatus(sel, r) || { level: 'ok', text: '—' };
    return { label: 'Vale = <b>' + r.cmin + ' mg/L</b>', status };
  }
  if (drug.tt === 'cmax') {
    return { label: 'fC<sub>max</sub>/MIC = <b>' + r.cmaxMic + '</b>', status: cmaxStatus(r) };
  }
  return { label: '—', status: { level: 'ok', text: '—' } };
}

/**
 * Strip the leading bold "label" (e.g. "<b>Limitações do modelo:</b>") from
 * a piece of HTML so the same string can be reused inside a card without
 * repeating the section title.
 * @param {string} html
 */
function stripLeadingLabel(html) {
  return html.replace(/^\s*<b>[^<]*<\/b>\s*/, '');
}

/**
 * Update the three colored info cards above the tabs.
 */
export function updateClinicalCards(sel, drug, r, gfr) {
  const adv = ADV[sel];
  const alerts = getAlerts(sel, drug, r, gfr, ADV);
  const dynamicAlerts = alerts.ms.slice(adv ? 3 : 0);

  // 1. Status PK/PD card
  const summary = primaryMetricSummary(sel, drug, r);
  const statusEl = document.getElementById('info-status');
  if (statusEl) {
    statusEl.setAttribute('data-level', summary.status.level);
    const titleEl = statusEl.querySelector('.info-card-title');
    const textEl = statusEl.querySelector('.info-card-text');
    if (titleEl) titleEl.textContent = 'Status PK/PD';
    if (textEl) textEl.innerHTML = summary.label + '<span class="info-pill ' + summary.status.level + '">' + summary.status.text + '</span>';
  }

  // 2. Alerta clínico card
  const alertEl = document.getElementById('info-alert');
  if (alertEl) {
    let level = 'info';
    let text = 'Sem alertas adicionais para os parâmetros atuais.';
    if (dynamicAlerts.length > 0) {
      level = alerts.lv === 'danger' ? 'danger' : 'warn';
      text = stripLeadingLabel(dynamicAlerts[0]).replace(/<b>|<\/b>/g, '');
    }
    alertEl.setAttribute('data-level', level);
    const titleEl = alertEl.querySelector('.info-card-title');
    const textEl = alertEl.querySelector('.info-card-text');
    if (titleEl) titleEl.textContent = 'Alerta clínico';
    if (textEl) textEl.innerHTML = text;
  }

  // 3. Modelo card
  const modelEl = document.getElementById('info-model');
  if (modelEl) {
    let modelText = 'Modelo monocompartimental IV — adequado para a droga selecionada.';
    if (UNCERTAINTY_DRUGS[sel]) modelText = 'PK ' + UNCERTAINTY_DRUGS[sel].reason + ' — faixa de incerteza exibida no gráfico.';
    else if (adv && adv.model) modelText = stripLeadingLabel(adv.model);
    modelEl.setAttribute('data-level', 'info');
    const titleEl = modelEl.querySelector('.info-card-title');
    const textEl = modelEl.querySelector('.info-card-text');
    if (titleEl) titleEl.textContent = 'Modelo';
    if (textEl) textEl.innerHTML = modelText;
  }
}

/**
 * Update the Interpretação / Limitações / Referências tab panes.
 */
export function updateClinicalTabs(sel, drug, r, gfr) {
  const classKey = '_' + drug.tt;
  const base = EDU[classKey] || { why: '', ref: '' };
  const specific = EDU[sel] || {};
  const adv = ADV[sel];
  const alerts = getAlerts(sel, drug, r, gfr, ADV);
  const dynamicAlerts = alerts.ms.slice(adv ? 3 : 0);

  // Interpretação tab
  const interpEl = document.getElementById('tab-interp');
  if (interpEl) {
    let html = base.why || '<p>Selecione um antimicrobiano para ver a interpretação clínica.</p>';
    if (specific.extra) html += specific.extra;
    interpEl.innerHTML = html;
  }

  // Limitações tab — model + adverse effects + extra alerts
  const limitsEl = document.getElementById('tab-limits');
  if (limitsEl) {
    const parts = [];
    if (adv) {
      parts.push('<p>' + adv.model + '</p>');
      parts.push('<p>' + adv.adv + '</p>');
    }
    if (UNCERTAINTY_DRUGS[sel]) {
      parts.push('<p><b>Faixa de incerteza:</b> a área sombreada no gráfico representa a incerteza do modelo simplificado para esta droga (' + UNCERTAINTY_DRUGS[sel].reason + ').</p>');
    }
    if (dynamicAlerts.length > 0) {
      parts.push('<div class="tab-alerts">' + dynamicAlerts.map(function (m) { return '<p>' + m + '</p>'; }).join('') + '</div>');
    }
    if (parts.length === 0) parts.push('<p>Sem limitações específicas registradas.</p>');
    limitsEl.innerHTML = parts.join('');
  }

  // Referências tab
  const refsEl = document.getElementById('tab-refs');
  if (refsEl) {
    const parts = [];
    if (base.ref) parts.push('<p><b>PK/PD:</b> ' + base.ref + '</p>');
    if (drug.info) parts.push('<p><b>Posologia:</b> ' + drug.info + '</p>');
    if (adv && adv.advRef) parts.push('<p><b>Efeitos adversos:</b> ' + adv.advRef + '</p>');
    if (parts.length === 0) parts.push('<p>Sem referências disponíveis.</p>');
    refsEl.innerHTML = parts.join('');
  }
}

/**
 * Wire tab buttons (one-time).
 */
export function initClinicalPanel() {
  const bar = document.getElementById('tabs-bar');
  if (!bar) return;
  bar.addEventListener('click', function (ev) {
    const target = ev.target instanceof Element ? ev.target.closest('.tab') : null;
    if (!target) return;
    const tabId = target.getAttribute('data-tab');
    if (!tabId) return;
    bar.querySelectorAll('.tab').forEach(function (t) {
      const on = t === target;
      t.classList.toggle('on', on);
      t.setAttribute('aria-selected', String(on));
    });
    document.querySelectorAll('.tab-pane').forEach(function (p) {
      p.classList.toggle('on', p.getAttribute('data-pane') === tabId);
    });
  });

  // Inject icons for the cards (one-time).
  const iconMap = { status: 'checkCircle', alert: 'alertTriangle', model: 'info' };
  Object.keys(iconMap).forEach(function (key) {
    const el = document.querySelector('.info-card[data-card="' + key + '"] .info-card-icon');
    if (el) el.innerHTML = icon(iconMap[key], { size: 18 });
  });
}
