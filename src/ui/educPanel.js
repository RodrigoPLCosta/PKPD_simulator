/**
 * Educational panel — contextual PK/PD teaching per drug.
 */
import EDU from '../drugs/educContent.js';

const eduPanel = document.getElementById('edu-panel');
const eduHeader = document.getElementById('edu-header');
const eduIcon = document.getElementById('edu-icon');
const eduSummary = document.getElementById('edu-summary');
const eduText = document.getElementById('edu-text');

export function initEducPanel() {
  eduHeader.addEventListener('click', function () {
    eduPanel.classList.toggle('open');
  });
}

export function updateEduPanel(sel, drug, r, micv) {
  const classKey = '_' + drug.tt;
  const base = EDU[classKey] || { title: '—', why: '', ref: '' };
  const specific = EDU[sel] || {};

  let valText = '', statusText = '', statusClass = 'ok';

  if (drug.tt === 'tmic') {
    valText = 'fT>MIC(SS) = <span class="edu-val">' + r.pctMIC + '%</span>';
    if (r.pctMIC >= 60) { statusText = 'Alvo atingido'; statusClass = 'ok'; }
    else if (r.pctMIC >= 40) { statusText = 'Limítrofe'; statusClass = 'warn'; }
    else { statusText = 'Abaixo do alvo'; statusClass = 'danger'; }
  } else if (drug.tt === 'auc') {
    valText = 'AUC\u2082\u2084/MIC = <span class="edu-val">' + r.aucMic + '</span>';
    if (sel === 'vancomycin') {
      if (r.aucMic >= 400 && r.aucMic <= 600) { statusText = 'Faixa IDSA 2020'; statusClass = 'ok'; }
      else if (r.aucMic < 400) { statusText = 'Risco de falha'; statusClass = 'danger'; }
      else { statusText = 'Risco nefrotoxicidade'; statusClass = 'danger'; }
    } else if (sel === 'polymyxinB') {
      if (r.auc24 >= 50 && r.auc24 <= 100) { statusText = 'AUCss adequada'; statusClass = 'ok'; }
      else if (r.auc24 < 50) { statusText = 'Subterapêutico'; statusClass = 'warn'; }
      else { statusText = 'Risco nefrotoxicidade'; statusClass = 'danger'; }
    } else {
      if (r.aucMic >= 125) { statusText = 'Alvo atingido'; statusClass = 'ok'; }
      else if (r.aucMic >= 80) { statusText = 'Limítrofe'; statusClass = 'warn'; }
      else { statusText = 'Abaixo do alvo'; statusClass = 'danger'; }
    }
  } else if (drug.tt === 'trough') {
    valText = 'Vale = <span class="edu-val">' + r.cmin + ' mg/L</span>';
    if (sel === 'teicoplanin') {
      if (r.cmin >= 15 && r.cmin <= 30) { statusText = 'Adequado (15-30)'; statusClass = 'ok'; }
      else if (r.cmin < 15) { statusText = 'Subterapêutico'; statusClass = 'warn'; }
      else { statusText = 'Risco de toxicidade'; statusClass = 'danger'; }
    } else if (sel === 'voriconazole') {
      if (r.cmin >= 2 && r.cmin <= 5.5) { statusText = 'Faixa terapêutica'; statusClass = 'ok'; }
      else if (r.cmin < 2) { statusText = 'Risco de falha'; statusClass = 'danger'; }
      else { statusText = 'Risco neurotoxicidade'; statusClass = 'danger'; }
    } else {
      statusText = '—'; statusClass = 'ok';
    }
  } else if (drug.tt === 'cmax') {
    valText = 'fCmax/MIC = <span class="edu-val">' + r.cmaxMic + '</span>';
    if (r.cmaxMic >= 8) { statusText = 'Alvo atingido (\u22658)'; statusClass = 'ok'; }
    else { statusText = 'Abaixo do alvo (<8)'; statusClass = 'warn'; }
  }

  eduIcon.className = 'edu-icon ' + statusClass;
  eduSummary.innerHTML = valText + ' <span class="edu-status ' + statusClass + '">' + statusText + '</span>';

  let bodyHTML = base.why || '';
  if (specific.extra) bodyHTML += specific.extra;
  if (base.ref) bodyHTML += '<div class="edu-ref">' + base.ref + '</div>';
  eduText.innerHTML = bodyHTML;
}
