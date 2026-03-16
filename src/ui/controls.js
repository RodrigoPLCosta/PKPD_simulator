/**
 * Controls module — event listeners, input sync, undo, mobile drawer.
 * This is the "glue" module that connects UI inputs to the PK engine.
 */
import { D, SCENARIOS, ADV } from '../drugs/index.js';
import { simulate } from '../engine/pkEngine.js';
import { classifyGFR, renalRec } from '../engine/renalAdjust.js';
import { getAlerts } from '../engine/pkpdTargets.js';
import { updateChart } from './chart.js';
import { updateEduPanel } from './educPanel.js';

let sel = 'meropenem';
let cmpData = null;

// MIC log2 scale
const MIC_STEPS = [0.0625, 0.125, 0.25, 0.5, 1, 2, 4, 8, 16, 32, 64, 128, 256];
function micFromSlider(idx) { return MIC_STEPS[Math.max(0, Math.min(MIC_STEPS.length - 1, Math.round(idx)))]; }
function sliderFromMic(val) {
  for (let i = 0; i < MIC_STEPS.length; i++) { if (MIC_STEPS[i] >= val - 0.001) return i; }
  return MIC_STEPS.length - 1;
}

// DOM references
const ldToggle = document.getElementById('ld-toggle');
const ldContent = document.getElementById('ld-content');
const scEl = document.getElementById('scenarios');

// Dose formatting
function formatDose(mg) { return mg >= 1000 ? (mg / 1000) + 'g' : mg + 'mg'; }

// ─── Sync helpers ───
function syncDoseBtns() {
  const v = parseFloat(document.getElementById('dose-n').value);
  document.getElementById('dose-btns').querySelectorAll('.dose-btn').forEach(function (b) {
    b.classList.toggle('on', parseFloat(b.dataset.v) === v);
  });
}
function syncIntBtns() {
  const v = parseInt(document.getElementById('int-n').value);
  document.getElementById('int-btns').querySelectorAll('.int-btn').forEach(function (b) {
    b.classList.toggle('on', parseInt(b.dataset.v) === v);
  });
}
function syncInfBtns() {
  const v = parseFloat(document.getElementById('inf-n').value);
  document.getElementById('inf-btns').querySelectorAll('.inf-btn').forEach(function (b) {
    if (b.dataset.v === 'ci') {
      const intV = parseFloat(document.getElementById('int-n').value) || 8;
      b.classList.toggle('on', v === intV * 60);
    } else {
      b.classList.toggle('on', parseFloat(b.dataset.v) === v);
    }
  });
}

// ─── Button renderers ───
function renderDoseButtons(drug, currentDose) {
  const container = document.getElementById('dose-btns');
  container.innerHTML = '';
  (drug.doses || []).forEach(function (v) {
    const b = document.createElement('button');
    b.className = 'dose-btn' + (v === currentDose ? ' on' : '');
    b.innerHTML = formatDose(v);
    b.dataset.v = v;
    b.addEventListener('click', function () {
      document.getElementById('dose').value = v;
      document.getElementById('dose-n').value = v;
      container.querySelectorAll('.dose-btn').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      update();
    });
    container.appendChild(b);
  });
}

function renderIntButtons(ints, current) {
  const container = document.getElementById('int-btns');
  container.innerHTML = '';
  ints.forEach(function (v) {
    const b = document.createElement('button');
    b.className = 'int-btn' + (v === current ? ' on' : '');
    b.textContent = v + 'h';
    b.dataset.v = v;
    b.addEventListener('click', function () {
      document.getElementById('int').value = v;
      document.getElementById('int-n').value = v;
      container.querySelectorAll('.int-btn').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      const curInf = parseFloat(document.getElementById('inf-n').value) || 30;
      const oldInt = parseFloat(document.getElementById('int-n').value) || 8;
      if (curInf === oldInt * 60) {
        document.getElementById('inf-n').value = v * 60;
        document.getElementById('inf').value = Math.min(480, v * 60);
        syncInfBtns();
      }
      update();
    });
    container.appendChild(b);
  });
}

function renderInfPresets(drug, currentInf) {
  const container = document.getElementById('inf-btns');
  container.innerHTML = '';
  (drug.infP || []).forEach(function (p) {
    const isCI = p.v === null;
    let val = isCI ? (parseFloat(document.getElementById('int-n').value) || 8) * 60 : p.v;
    const b = document.createElement('button');
    b.className = 'inf-btn' + (val === currentInf ? ' on' : '');
    b.textContent = p.l;
    b.dataset.v = isCI ? 'ci' : p.v;
    b.addEventListener('click', function () {
      if (isCI) {
        const intV = parseFloat(document.getElementById('int-n').value) || 8;
        val = intV * 60;
      }
      document.getElementById('inf-n').value = val;
      document.getElementById('inf').value = Math.min(480, val);
      container.querySelectorAll('.inf-btn').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      update();
    });
    container.appendChild(b);
  });
}

// ─── mg/kg dose sync ───
function updateMgKgDose() {
  const drug = D[sel];
  if (!drug.mgkg) return;
  const wt = parseFloat(document.getElementById('wt-n').value) || 70;
  let newDose = Math.round(drug.mgkg * wt / drug.dStep) * drug.dStep;
  newDose = Math.max(drug.dMin, Math.min(drug.dMax, newDose));
  document.getElementById('dose').value = newDose;
  document.getElementById('dose-n').value = newDose;
  syncDoseBtns();
  document.getElementById('mgkg-badge').textContent = Math.round(newDose / wt * 10) / 10 + ' mg/kg';
}

// ─── Select drug ───
function selectDrug(k) {
  sel = k;
  const d = D[k];
  const doseSlider = document.getElementById('dose');
  const doseNum = document.getElementById('dose-n');
  doseSlider.min = d.dMin || 50; doseSlider.max = d.dMax || 6000; doseSlider.step = d.dStep || 50;
  doseNum.min = d.dMin || 50; doseNum.max = d.dMax || 6000; doseNum.step = d.dStep || 50;
  doseSlider.value = d.dose; doseNum.value = d.dose;
  renderDoseButtons(d, d.dose);
  const mgkgEl = document.getElementById('mgkg-badge');
  const wt = parseFloat(document.getElementById('wt-n').value) || 70;
  if (d.mgkg) { mgkgEl.textContent = Math.round(d.dose / wt * 10) / 10 + ' mg/kg'; }
  else { mgkgEl.textContent = ''; }
  document.getElementById('int').value = d.int; document.getElementById('int-n').value = d.int;
  renderIntButtons(d.ints || [d.int], d.int);
  document.getElementById('inf').value = d.inf; document.getElementById('inf-n').value = d.inf;
  renderInfPresets(d, d.inf);
  document.getElementById('mic').value = sliderFromMic(d.mic); document.getElementById('mic-n').value = d.mic;

  // Filter scenarios
  let hasScenarios = false;
  scEl.querySelectorAll('.sc-btn').forEach(function (btn) {
    const show = btn.dataset.drug === k;
    btn.style.display = show ? '' : 'none';
    btn.classList.remove('active');
    if (show) hasScenarios = true;
  });
  const scHeader = scEl.previousElementSibling;
  scEl.style.display = hasScenarios ? '' : 'none';
  if (scHeader && scHeader.classList.contains('st')) scHeader.style.display = hasScenarios ? '' : 'none';

  // Loading dose defaults
  const defLd = d.defLd || 0, defLdInt = d.defLdInt || 12;
  const ldSlider = document.getElementById('ld'); const ldNum = document.getElementById('ld-n');
  ldSlider.max = d.dMax || 6000; ldSlider.step = d.dStep || 50;
  ldNum.max = d.dMax || 6000; ldNum.step = d.dStep || 50;
  ldSlider.value = 0; ldNum.value = 0;
  document.getElementById('ldc').value = defLd; document.getElementById('ldc-n').value = defLd;
  document.getElementById('ldi').value = defLdInt; document.getElementById('ldi-n').value = defLdInt;
  if (defLd > 0) { ldContent.style.display = 'block'; ldToggle.classList.add('open'); }
  else { ldContent.style.display = 'none'; ldToggle.classList.remove('open'); }

  document.getElementById('lg-c').style.background = d.col;
  document.getElementById('ch-t').textContent = d.l;
  document.getElementById('ch-s').textContent = d.cat;
  document.getElementById('std-ref').style.display = 'block';
  document.getElementById('std-ref').innerHTML = '<b>Posologia padrão:</b> ' + d.std;
  document.getElementById('dg').querySelectorAll('.db').forEach(function (b) { b.classList.toggle('on', b.dataset.k === k); });
  update();
}

// ─── Shared chart reference ───
const chartRef = { chart: null };
export function getChartRef() { return chartRef; }

// ─── Main update ───
function update() {
  const dose = parseFloat(document.getElementById('dose-n').value) || 1000;
  const intv = parseFloat(document.getElementById('int-n').value) || 8;
  const infn = parseFloat(document.getElementById('inf-n').value) || 30;
  const micv = micFromSlider(document.getElementById('mic').value);
  const gfr = parseFloat(document.getElementById('gfr-n').value) || 120;
  const wt = parseFloat(document.getElementById('wt-n').value) || 70;
  const ldv = parseFloat(document.getElementById('ld-n').value) || 0;
  const ldCount = parseInt(document.getElementById('ldc-n').value) || 0;
  const ldInt = parseFloat(document.getElementById('ldi-n').value) || 12;
  const drug = D[sel];

  // GFR badge
  const gl = classifyGFR(gfr);
  const gb = document.getElementById('gfr-b');
  gb.textContent = gl.t; gb.style.background = gl.bg; gb.style.color = gl.c;

  // Renal recommendation
  const rrEl = document.getElementById('renal-rec');
  const rec = renalRec(drug, gfr);
  if (rec && gfr < 90) { rrEl.style.display = 'block'; rrEl.innerHTML = '<b>Ajuste renal sugerido (CrCl ' + gfr + '):</b> ' + rec; }
  else rrEl.style.display = 'none';

  const r = simulate(dose, intv, infn, drug, gfr, micv, wt, ldv, ldCount, ldInt, sel);

  // Metrics
  document.getElementById('m-class').textContent = drug.pk;
  document.getElementById('m-cmax').innerHTML = r.cmax + ' <span class="mu">mg/L</span>';
  document.getElementById('m-cmin').innerHTML = r.cmin + ' <span class="mu">mg/L</span>';
  document.getElementById('m-tmic').innerHTML = r.pctMIC + '<span class="mu">%</span>';
  document.getElementById('m-tmic-s').textContent = drug.tt === 'tmic' ? 'Alvo: ' + drug.tgt : '';
  document.getElementById('m-aucmic').textContent = r.aucMic;
  document.getElementById('m-cmaxmic').textContent = r.cmaxMic;

  // Primary metric highlight
  ['mc-tmic', 'mc-auc', 'mc-cmaxmic', 'mc-cmin'].forEach(function (id) { document.getElementById(id).classList.remove('primary'); });
  if (drug.tt === 'tmic') document.getElementById('mc-tmic').classList.add('primary');
  else if (drug.tt === 'auc') document.getElementById('mc-auc').classList.add('primary');
  else if (drug.tt === 'cmax') document.getElementById('mc-cmaxmic').classList.add('primary');
  else if (drug.tt === 'trough') document.getElementById('mc-cmin').classList.add('primary');

  // PK Info card
  const vdL = Math.round(drug.vdkg * wt);
  let pkH = '<div class="pk-title">' + drug.l + '</div>';
  pkH += '<div class="pk-grid">';
  pkH += '<div class="pk-cell"><div class="pk-k">Vd</div><div class="pk-v">' + vdL + ' L (' + drug.vdkg + ' L/kg × ' + wt + 'kg)</div></div>';
  pkH += '<div class="pk-cell"><div class="pk-k">t½ ajust.</div><div class="pk-v">' + r.adjHL + ' h</div></div>';
  pkH += '<div class="pk-cell"><div class="pk-k">Lig. proteica</div><div class="pk-v">' + Math.round(drug.pb * 100) + '%</div></div>';
  pkH += '<div class="pk-cell"><div class="pk-k">Elim. renal</div><div class="pk-v">' + Math.round(drug.fr * 100) + '%</div></div>';
  pkH += '</div>';
  pkH += '<div class="pk-tgt">Alvo: ' + drug.tgt + '</div>';
  pkH += '<div class="pk-ref">' + drug.info + '</div>';
  if (drug.warn) pkH += '<div class="warn-model">' + drug.warn + '</div>';
  document.getElementById('pk-info').innerHTML = pkH;
  document.getElementById('pk-below-title').textContent = 'Parâmetros PK — ' + drug.l;

  // Flash animation
  document.querySelectorAll('.mv').forEach(function (el) { el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); });

  // Alerts
  const al = getAlerts(sel, drug, r, gfr, ADV);
  const ab = document.getElementById('al');
  ab.className = 'al ' + al.lv;
  ab.innerHTML = al.ms.join('<div class="al-sep"></div>');

  // Educational panel
  updateEduPanel(sel, drug, r, micv);

  // Chart
  updateChart(chartRef, sel, drug, r, micv, intv, cmpData);
}

// ─── Undo system ───
let undoStack = [];
const MAX_UNDO = 30;
let _restoringUndo = false;
const undoBtn = document.getElementById('btn-undo');

function captureState() {
  return {
    sel, dose: document.getElementById('dose-n').value, int: document.getElementById('int-n').value,
    inf: document.getElementById('inf-n').value, mic: document.getElementById('mic').value,
    gfr: document.getElementById('gfr-n').value, wt: document.getElementById('wt-n').value,
    ld: document.getElementById('ld-n').value, ldc: document.getElementById('ldc-n').value,
    ldi: document.getElementById('ldi-n').value, ldOpen: ldContent.style.display !== 'none'
  };
}
function pushUndo() {
  const st = captureState();
  if (undoStack.length > 0 && JSON.stringify(undoStack[undoStack.length - 1]) === JSON.stringify(st)) return;
  undoStack.push(st);
  if (undoStack.length > MAX_UNDO) undoStack.shift();
  undoBtn.disabled = false; undoBtn.style.opacity = '1';
}
function popUndo() {
  if (undoStack.length === 0) return;
  const st = undoStack.pop();
  _restoringUndo = true;
  if (st.sel !== sel) selectDrug(st.sel);
  document.getElementById('dose').value = st.dose; document.getElementById('dose-n').value = st.dose;
  document.getElementById('int').value = st.int; document.getElementById('int-n').value = st.int;
  document.getElementById('inf-n').value = st.inf; document.getElementById('inf').value = Math.min(480, parseInt(st.inf));
  document.getElementById('mic').value = st.mic; document.getElementById('mic-n').value = micFromSlider(st.mic);
  document.getElementById('gfr').value = Math.min(180, parseInt(st.gfr)); document.getElementById('gfr-n').value = st.gfr;
  document.getElementById('wt').value = st.wt; document.getElementById('wt-n').value = st.wt;
  document.getElementById('ld-n').value = st.ld; document.getElementById('ld').value = st.ld;
  document.getElementById('ldc-n').value = st.ldc; document.getElementById('ldc').value = st.ldc;
  document.getElementById('ldi-n').value = st.ldi; document.getElementById('ldi').value = st.ldi;
  if (st.ldOpen) { ldContent.style.display = 'block'; ldToggle.classList.add('open'); }
  else { ldContent.style.display = 'none'; ldToggle.classList.remove('open'); }
  syncDoseBtns(); syncIntBtns(); syncInfBtns();
  update();
  _restoringUndo = false;
  if (undoStack.length === 0) { undoBtn.disabled = true; undoBtn.style.opacity = '.4'; }
}

// ─── Init all controls ───
export function initControls() {
  // Class tabs
  const classes = [...new Set(Object.values(D).map(function (d) { return d.cat; }))];
  const ctEl = document.getElementById('class-tabs');
  const allBtn = document.createElement('button');
  allBtn.textContent = 'Todos'; allBtn.className = 'on'; allBtn.dataset.c = 'all';
  allBtn.addEventListener('click', function () { filterClass('all'); });
  ctEl.appendChild(allBtn);
  classes.forEach(function (c) {
    const b = document.createElement('button'); b.textContent = c; b.dataset.c = c;
    b.addEventListener('click', function () { filterClass(c); });
    ctEl.appendChild(b);
  });

  function filterClass(c) {
    ctEl.querySelectorAll('button').forEach(function (b) { b.classList.toggle('on', b.dataset.c === c); });
    document.querySelectorAll('.db').forEach(function (b) {
      const dk = b.dataset.k;
      b.style.display = (c === 'all' || D[dk].cat === c) ? '' : 'none';
    });
  }

  // Drug buttons
  const dg = document.getElementById('dg');
  Object.keys(D).forEach(function (k) {
    const d = D[k];
    const b = document.createElement('button');
    b.className = 'db'; b.dataset.k = k;
    b.innerHTML = d.l + '<span class="dc">' + d.cat + '</span>';
    b.addEventListener('click', function () { if (!_restoringUndo) pushUndo(); selectDrug(k); });
    dg.appendChild(b);
  });

  // Scenarios
  SCENARIOS.forEach(function (s) {
    const b = document.createElement('button');
    b.className = 'sc-btn'; b.textContent = s.l; b.title = s.desc; b.dataset.drug = s.d;
    b.addEventListener('click', function () {
      if (!_restoringUndo) pushUndo();
      scEl.querySelectorAll('.sc-btn').forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      selectDrug(s.d);
      Object.entries(s.p).forEach(function (kv) {
        if (kv[0] === 'mic') { document.getElementById('mic').value = sliderFromMic(kv[1]); document.getElementById('mic-n').value = kv[1]; return; }
        const sl = document.getElementById(kv[0]);
        const nm = document.getElementById(kv[0] + '-n');
        if (sl) { sl.value = kv[1]; if (nm) nm.value = kv[1]; }
      });
      const scInt = s.p.int || s.p['int'];
      if (scInt) { document.getElementById('int-btns').querySelectorAll('.int-btn').forEach(function (b2) { b2.classList.toggle('on', parseInt(b2.dataset.v) === scInt); }); }
      if (s.p.ld && s.p.ld > 0) { ldContent.style.display = 'block'; ldToggle.classList.add('open'); }
      update();
    });
    scEl.appendChild(b);
  });

  // Dual input sync
  const P = [
    { s: 'dose', n: 'dose-n' }, { s: 'int', n: 'int-n' }, { s: 'inf', n: 'inf-n' },
    { s: 'gfr', n: 'gfr-n' }, { s: 'wt', n: 'wt-n' },
    { s: 'ld', n: 'ld-n' }, { s: 'ldc', n: 'ldc-n' }, { s: 'ldi', n: 'ldi-n' }
  ];
  P.forEach(function (p) {
    const sl = document.getElementById(p.s), nm = document.getElementById(p.n);
    sl.addEventListener('input', function () { nm.value = sl.value; update(); });
    nm.addEventListener('input', function () {
      const v = parseFloat(nm.value);
      if (!isNaN(v)) { sl.value = Math.max(parseFloat(sl.min), Math.min(parseFloat(sl.max), v)); update(); }
    });
    nm.addEventListener('change', function () { update(); });
  });

  // MIC controls
  const micSlider = document.getElementById('mic');
  const micDisplay = document.getElementById('mic-n');
  function updateMicDisplay() { micDisplay.value = micFromSlider(micSlider.value); }
  micSlider.addEventListener('input', function () { updateMicDisplay(); update(); });
  document.getElementById('mic-up').addEventListener('click', function () {
    if (!_restoringUndo) pushUndo();
    const idx = parseInt(micSlider.value);
    if (idx < MIC_STEPS.length - 1) { micSlider.value = idx + 1; updateMicDisplay(); update(); }
  });
  document.getElementById('mic-dn').addEventListener('click', function () {
    if (!_restoringUndo) pushUndo();
    const idx = parseInt(micSlider.value);
    if (idx > 0) { micSlider.value = idx - 1; updateMicDisplay(); update(); }
  });

  // Weight → dose sync
  document.getElementById('wt-n').addEventListener('change', function () { updateMgKgDose(); update(); });
  document.getElementById('wt').addEventListener('change', function () { updateMgKgDose(); update(); });
  document.getElementById('dose-n').addEventListener('input', function () {
    const drug = D[sel]; if (!drug.mgkg) return;
    const wt = parseFloat(document.getElementById('wt-n').value) || 70;
    document.getElementById('mgkg-badge').textContent = Math.round(parseFloat(this.value) / wt * 10) / 10 + ' mg/kg';
  });
  document.getElementById('dose').addEventListener('input', function () {
    const drug = D[sel]; if (!drug.mgkg) return;
    const wt = parseFloat(document.getElementById('wt-n').value) || 70;
    document.getElementById('mgkg-badge').textContent = Math.round(parseFloat(this.value) / wt * 10) / 10 + ' mg/kg';
  });

  // Sync button highlights
  document.getElementById('dose-n').addEventListener('input', syncDoseBtns);
  document.getElementById('dose-n').addEventListener('change', syncDoseBtns);
  document.getElementById('dose').addEventListener('input', syncDoseBtns);
  document.getElementById('int-n').addEventListener('input', syncIntBtns);
  document.getElementById('int-n').addEventListener('change', syncIntBtns);
  document.getElementById('inf-n').addEventListener('input', syncInfBtns);
  document.getElementById('inf-n').addEventListener('change', syncInfBtns);

  // Loading dose toggle
  ldToggle.addEventListener('click', function () {
    const open = ldContent.style.display !== 'none';
    ldContent.style.display = open ? 'none' : 'block';
    ldToggle.classList.toggle('open', !open);
  });

  // Compare
  document.getElementById('btn-snap').addEventListener('click', function () {
    const dose = parseFloat(document.getElementById('dose-n').value) || 1000;
    const intv = parseFloat(document.getElementById('int-n').value) || 8;
    const infn = parseFloat(document.getElementById('inf-n').value) || 30;
    const micv = micFromSlider(document.getElementById('mic').value);
    const gfr = parseFloat(document.getElementById('gfr-n').value) || 120;
    const wt = parseFloat(document.getElementById('wt-n').value) || 70;
    const ldv = parseFloat(document.getElementById('ld-n').value) || 0;
    const ldcv = parseInt(document.getElementById('ldc-n').value) || 0;
    const ldiv = parseFloat(document.getElementById('ldi-n').value) || 12;
    const drug = D[sel];
    cmpData = simulate(dose, intv, infn, drug, gfr, micv, wt, ldv, ldcv, ldiv, sel);
    cmpData.label = drug.l + ' ' + dose + 'mg q' + intv + 'h inf' + infn + 'min';
    document.getElementById('cmp-tag').style.display = 'inline';
    document.getElementById('cmp-tag').textContent = cmpData.label;
    document.getElementById('btn-clear').style.display = '';
    this.classList.add('on');
    update();
  });
  document.getElementById('btn-clear').addEventListener('click', function () {
    cmpData = null;
    document.getElementById('cmp-tag').style.display = 'none';
    document.getElementById('btn-snap').classList.remove('on');
    this.style.display = 'none';
    update();
  });

  // Undo
  undoBtn.addEventListener('click', popUndo);
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      const tag = document.activeElement.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      e.preventDefault(); popUndo();
    }
  });

  // Undo hooks for sliders
  ['dose', 'int', 'inf', 'gfr', 'wt', 'ld', 'ldc', 'ldi'].forEach(function (id) {
    const sl = document.getElementById(id);
    sl.addEventListener('mousedown', function () { if (!_restoringUndo) pushUndo(); });
    sl.addEventListener('touchstart', function () { if (!_restoringUndo) pushUndo(); }, { passive: true });
  });
  ['dose-n', 'int-n', 'inf-n', 'gfr-n', 'wt-n', 'ld-n', 'ldc-n', 'ldi-n'].forEach(function (id) {
    document.getElementById(id).addEventListener('focus', function () { if (!_restoringUndo) pushUndo(); });
  });

  // Mobile drawer
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sb-overlay');
  const fabBtn = document.getElementById('fab-params');

  function openDrawer() { sidebar.classList.add('drawer-open'); overlay.classList.add('show'); fabBtn.classList.add('hidden'); }
  function closeDrawer() {
    sidebar.classList.remove('drawer-open'); overlay.classList.remove('show'); fabBtn.classList.remove('hidden');
    setTimeout(function () { if (chartRef.chart) chartRef.chart.resize(); }, 350);
  }

  fabBtn.addEventListener('click', openDrawer);
  overlay.addEventListener('click', closeDrawer);

  let touchStartY = 0;
  sidebar.addEventListener('touchstart', function (e) { touchStartY = e.touches[0].clientY; }, { passive: true });
  sidebar.addEventListener('touchmove', function (e) {
    if (e.touches[0].clientY - touchStartY > 60 && sidebar.scrollTop <= 0) closeDrawer();
  }, { passive: true });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sidebar.classList.contains('drawer-open')) closeDrawer();
  });

  function checkViewport() {
    if (window.innerWidth > 768) { sidebar.classList.remove('drawer-open'); overlay.classList.remove('show'); }
  }
  window.addEventListener('resize', function () { checkViewport(); if (chartRef.chart) chartRef.chart.resize(); });

  // PK-below toggle
  document.getElementById('pk-below').addEventListener('click', function () { this.classList.toggle('open'); });

  // Initial drug selection
  selectDrug('meropenem');
}

export function getSel() { return sel; }
