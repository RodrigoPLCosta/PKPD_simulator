/**
 * Chart module — Chart.js integration, datasets, and custom plugin.
 */
import { UNCERTAINTY_DRUGS } from '../engine/pkpdTargets.js';
import Chart from './chartRuntime.js';
import { readThemeTokens } from './theme.js';

function getVisibleYMax(sel, drug, r, micv, cmpData) {
  const uncertainty = UNCERTAINTY_DRUGS[sel];
  const uncertaintyMax = uncertainty ? r.cmax * uncertainty.hi : 0;
  const comparisonMax = cmpData ? (cmpData.cmax || 0) : 0;
  const targetMax = drug.tl ? drug.tl.hi : 0;
  const concentrationMax = Math.max(r.cmax, comparisonMax, uncertaintyMax, micv, targetMax, 5);
  return Math.max(concentrationMax * 1.2, micv * 2, targetMax * 1.3, 5);
}

/**
 * Build Chart.js datasets from simulation results.
 */
export function buildDatasets(sel, drug, r, micv, intv, cmpData, viewMaxH) {
  const theme = readThemeTokens();
  const maxT = viewMaxH || r.totalH;
  const fillAlpha = drug.tt === 'tmic' ? '28' : '10';

  const ds = [
    { label: 'Total', data: r.pts, borderColor: drug.col, borderWidth: 2.5, pointRadius: 0, tension: 0.15, fill: false, order: 1 },
    { label: 'Livre', data: r.fpts, borderColor: drug.col + '70', borderWidth: 1.5, borderDash: [5, 3], pointRadius: 0, tension: 0.15, fill: false, order: 2 },
    { label: 'MIC', data: [{ x: 0, y: micv }, { x: maxT, y: micv }], borderColor: theme.error, borderWidth: 1.5, borderDash: [8, 5], pointRadius: 0, fill: false, order: 5 },
    { label: 'Fill', data: r.pts.map(function (p) { return { x: p.x, y: p.y >= micv ? p.y : micv }; }), borderWidth: 0, pointRadius: 0, fill: { target: { value: micv }, above: drug.col + fillAlpha, below: 'transparent' }, order: 6 }
  ];

  if (drug.tt === 'auc') {
    const aucStart = maxT - 24;
    const aucPts = r.pts.filter(function (p) { return p.x >= aucStart; });
    ds.push({ label: 'AUC24', data: aucPts, borderWidth: 0, pointRadius: 0, backgroundColor: drug.col + '18', fill: { target: 'origin' }, order: 7 });
  }

  if (drug.tl) {
    ds.push({ label: 'Lo', data: [{ x: 0, y: drug.tl.lo }, { x: maxT, y: drug.tl.lo }], borderColor: theme.success, borderWidth: 1, borderDash: [4, 3], pointRadius: 0, fill: false, order: 4 });
    ds.push({ label: 'Hi', data: [{ x: 0, y: drug.tl.hi }, { x: maxT, y: drug.tl.hi }], borderColor: theme.success, borderWidth: 1, borderDash: [4, 3], pointRadius: 0, fill: '+1', backgroundColor: theme.success + '18', order: 3 });
  }

  const yMax = getVisibleYMax(sel, drug, r, micv, cmpData);

  const cmaxPt = r.pts.reduce(function (a, b) { return b.y > a.y ? b : a; }, { x: 0, y: 0 });
  const ssRange = r.pts.filter(function (p) { return p.x >= r.ssStart && p.x <= r.ssStart + intv; });
  const cminPt = ssRange.length ? ssRange.reduce(function (a, b) { return b.y < a.y ? b : a; }, { x: 0, y: Infinity }) : { x: 0, y: 0 };
  ds.push({ label: 'Cmax/Cmin', data: [cmaxPt, cminPt], borderWidth: 0, pointRadius: 6, pointBackgroundColor: [drug.col, theme.error], pointBorderColor: ['#fff', '#fff'], pointBorderWidth: 1.5, showLine: false, order: 0 });

  if (UNCERTAINTY_DRUGS[sel]) {
    const uf = UNCERTAINTY_DRUGS[sel];
    const upperBand = r.pts.map(function (p) { return { x: p.x, y: Math.round(p.y * uf.hi * 10) / 10 }; });
    const lowerBand = r.pts.map(function (p) { return { x: p.x, y: Math.round(p.y * uf.lo * 10) / 10 }; });
    ds.push({ label: 'Unc-hi', data: upperBand, borderColor: drug.col + '30', borderWidth: 0, pointRadius: 0, tension: 0.15, fill: false, order: 8 });
    ds.push({ label: 'Unc-lo', data: lowerBand, borderColor: drug.col + '30', borderWidth: 0, pointRadius: 0, tension: 0.15, fill: { target: '-1', above: drug.col + '12', below: 'transparent' }, order: 8 });
  }

  if (cmpData) {
    ds.push({ label: 'Comparação', data: cmpData.pts, borderColor: theme.axisColor, borderWidth: 1.5, borderDash: [6, 4], pointRadius: 0, tension: 0.15, fill: false, order: 10 });
  }

  return { ds, yMax, cmaxPt, cminPt };
}

/**
 * Draw a small dose marker (filled circle on top of the chart with a short
 * vertical drop-line). One per scheduled dose, drug-coloured.
 */
function drawDoseMarkers(ctx, chart, schedule, maxT, color) {
  const xScale = chart.scales.x;
  const top = chart.chartArea.top;
  const left = chart.chartArea.left;
  const right = chart.chartArea.right;
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.25;
  const seen = new Set();
  for (let i = 0; i < schedule.length; i++) {
    const t = schedule[i].t;
    if (t > maxT) break;
    if (seen.has(t)) continue;
    seen.add(t);
    const px = xScale.getPixelForValue(t);
    if (px < left - 1 || px > right + 1) continue;
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.arc(px, top + 5, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.45;
    ctx.beginPath();
    ctx.moveTo(px, top + 9);
    ctx.lineTo(px, top + 16);
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Custom Chart.js plugin for PK labels and banners.
 */
export const pkLabelPlugin = {
  id: 'pkLabels',
  afterDraw: function (chart) {
    const a = chart._pkAnnotations;
    if (!a) return;

    const theme = readThemeTokens();
    const ctx = chart.ctx;
    const xScale = chart.scales.x;
    const yScale = chart.scales.y;
    ctx.save();

    if (a.schedule) drawDoseMarkers(ctx, chart, a.schedule, a.maxT, a.drug.col);

    const cxMax = xScale.getPixelForValue(a.cmax.x);
    const cyMax = yScale.getPixelForValue(a.cmax.y);
    ctx.font = '500 9px "JetBrains Mono",monospace';
    ctx.fillStyle = a.drug.col;
    ctx.textAlign = 'left';
    const cmaxLabel = 'Cmax ' + a.cmax.y;
    let labelX = cxMax + 10;
    let labelY = cyMax - 2;
    if (labelX + 80 > chart.chartArea.right) { ctx.textAlign = 'right'; labelX = cxMax - 10; }
    if (labelY < chart.chartArea.top + 14) labelY = cyMax + 14;
    ctx.fillText(cmaxLabel, labelX, labelY);

    const cxMin = xScale.getPixelForValue(a.cmin.x);
    const cyMin = yScale.getPixelForValue(a.cmin.y);
    ctx.fillStyle = theme.error;
    ctx.textAlign = 'left';
    const cminLabel = 'Cmin ' + a.cmin.y;
    let cminLX = cxMin + 10;
    let cminLY = cyMin + 14;
    if (cminLX + 80 > chart.chartArea.right) { ctx.textAlign = 'right'; cminLX = cxMin - 10; }
    if (cminLY > chart.chartArea.bottom - 4) cminLY = cyMin - 6;
    ctx.fillText(cminLabel, cminLX, cminLY);

    let narr = '';
    let narrColor = theme.tooltipTitle;
    if (a.drug.tt === 'tmic') {
      narr = 'fT>MIC(SS) = ' + a.r.pctMIC + '%';
      narrColor = a.r.pctMIC >= 60 ? theme.success : a.r.pctMIC >= 40 ? theme.warning : theme.error;
    } else if (a.drug.tt === 'auc') {
      narr = 'AUC/MIC = ' + a.r.aucMic;
      if (a.drug.l === 'Vancomicina') narrColor = a.r.aucMic >= 400 && a.r.aucMic <= 600 ? theme.success : theme.error;
      else narrColor = a.drug.col;
    } else if (a.drug.tt === 'trough') {
      narr = 'Vale = ' + a.r.cmin + ' mg/L';
      narrColor = a.r.cmin >= 15 && a.r.cmin <= 30 ? theme.success : a.r.cmin < 15 ? theme.warning : theme.error;
    } else if (a.drug.tt === 'cmax') {
      narr = 'fCmax/MIC = ' + a.r.cmaxMic;
      narrColor = a.r.cmaxMic >= 8 ? theme.success : theme.warning;
    }
    if (narr) {
      ctx.font = '600 11px "DM Sans",-apple-system,sans-serif';
      ctx.textAlign = 'right';
      const tw = ctx.measureText(narr).width;
      const px = chart.chartArea.right - 8;
      const py = chart.chartArea.top + 18;
      ctx.globalAlpha = 0.92;
      ctx.fillStyle = theme.narrativeSurface;
      ctx.fillRect(px - tw - 10, py - 12, tw + 18, 20);
      ctx.globalAlpha = 1;
      ctx.fillStyle = narrColor;
      ctx.fillText(narr, px, py);
    }

    if (a.drug.tt === 'auc') {
      const aucX = xScale.getPixelForValue(a.maxT - 12);
      const aucY = yScale.getPixelForValue(a.r.cmax * 0.35);
      ctx.font = '500 9px "JetBrains Mono",monospace';
      ctx.textAlign = 'center';
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = a.drug.col;
      ctx.fillText('AUC₂₄ = ' + a.r.auc24 + ' mg·h/L', aucX, aucY);
      ctx.globalAlpha = 1;
    }

    let warnBanner = '';
    const warnIcon = '⚠';
    const selKey = a.sel;
    if (selKey === 'vancomycin') warnBanner = 'Modelo monocomp. — Cmax superestimado (fase α bicompartimental)';
    else if (selKey === 'teicoplanin') warnBanner = 'Modelo monocomp. aproximado — real: tricompartimental (faixa de incerteza exibida)';
    else if (selKey === 'voriconazole') warnBanner = 'Cinética NÃO-LINEAR — modelo linear é aproximação (faixa de incerteza exibida)';
    else if (selKey === 'amphoB_lipo') warnBanner = 'PK multicompartimental complexa — modelo simplificado (faixa de incerteza exibida)';

    if (warnBanner) {
      ctx.font = '600 10px "DM Sans",-apple-system,sans-serif';
      const bw = ctx.measureText(warnIcon + ' ' + warnBanner).width;
      const bx = chart.chartArea.left + 6;
      const by = chart.chartArea.top + 6;
      ctx.globalAlpha = 0.95;
      const bpad = 6;
      ctx.fillStyle = theme.warningSurface;
      ctx.fillRect(bx, by, bw + bpad * 2 + 4, 22);
      ctx.strokeStyle = theme.warningOutline;
      ctx.lineWidth = 1;
      ctx.strokeRect(bx, by, bw + bpad * 2 + 4, 22);
      ctx.globalAlpha = 1;
      ctx.fillStyle = theme.warningText;
      ctx.textAlign = 'left';
      ctx.fillText(warnIcon + ' ' + warnBanner, bx + bpad + 2, by + 15);
    }

    if (a.hasUncertainty) {
      ctx.font = 'italic 9px "DM Sans",-apple-system,sans-serif';
      ctx.textAlign = 'right';
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = a.drug.col;
      ctx.fillText('Faixa sombreada = incerteza do modelo (' + a.uncReason + ')', chart.chartArea.right - 4, chart.chartArea.bottom - 6);
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  }
};

/**
 * Create or update Chart.js instance.
 */
export function updateChart(chartRef, sel, drug, r, micv, intv, cmpData, viewMaxH) {
  const theme = readThemeTokens();
  const { ds, yMax, cmaxPt, cminPt } = buildDatasets(sel, drug, r, micv, intv, cmpData, viewMaxH);
  const maxT = Math.min(viewMaxH || r.totalH, r.totalH);

  const hasUnc = !!UNCERTAINTY_DRUGS[sel];
  const annotations = {
    cmax: cmaxPt, cmin: cminPt, drug, r, micv, intv, maxT, yMax,
    hasUncertainty: hasUnc, uncReason: hasUnc ? UNCERTAINTY_DRUGS[sel].reason : '',
    sel, schedule: r.schedule
  };

  document.getElementById('lg-unc').style.display = hasUnc ? '' : 'none';
  document.getElementById('lg-unc-t').style.display = hasUnc ? '' : 'none';
  if (hasUnc) {
    document.getElementById('lg-unc').style.background = drug.col + '18';
    document.getElementById('lg-unc').style.borderColor = drug.col + '40';
  }

  const tickStep = maxT > 96 ? 24 : maxT > 48 ? 12 : maxT > 24 ? 8 : 4;

  if (chartRef.chart) {
    chartRef.chart.data.datasets = ds;
    chartRef.chart._pkAnnotations = annotations;
    chartRef.chart.options.scales.x.max = maxT;
    chartRef.chart.options.scales.x.ticks.stepSize = tickStep;
    chartRef.chart.options.scales.y.max = Math.ceil(yMax);
    chartRef.chart.update('none');
  } else {
    chartRef.chart = new Chart(document.getElementById('pkC'), {
      type: 'line', data: { datasets: ds },
      plugins: [pkLabelPlugin],
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 400, easing: 'easeOutQuart' },
        interaction: { mode: 'nearest', axis: 'x', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: theme.tooltipBackground, borderColor: theme.tooltipBorder, borderWidth: 1,
            titleFont: { family: 'JetBrains Mono', size: 11, weight: '500' }, bodyFont: { family: 'DM Sans', size: 11 },
            titleColor: theme.tooltipTitle, bodyColor: theme.tooltipBody, padding: { top: 6, bottom: 6, left: 10, right: 10 }, cornerRadius: 8,
            filter: function (i) { var lb = i.dataset.label; return lb === 'Total' || lb === 'Livre' || lb === 'MIC' || lb === 'Comparação'; },
            callbacks: {
              title: function (c) { return 't = ' + c[0].parsed.x + 'h'; },
              label: function (c) { return '  ' + c.dataset.label + ': ' + c.parsed.y.toFixed(1) + ' mg/L'; }
            }
          }
        },
        scales: {
          x: {
            type: 'linear', min: 0, max: maxT,
            title: { display: true, text: 'Tempo (horas)', color: theme.axisColor, font: { family: 'DM Sans', size: 12, weight: '500' } },
            ticks: { stepSize: tickStep, color: theme.axisColor, font: { family: 'JetBrains Mono', size: 10 }, padding: 4 },
            grid: { color: theme.gridColor }, border: { color: theme.borderColor }
          },
          y: {
            min: 0, max: Math.ceil(yMax),
            title: { display: true, text: 'Concentração (mg/L)', color: theme.axisColor, font: { family: 'DM Sans', size: 12, weight: '500' } },
            ticks: { color: theme.axisColor, font: { family: 'JetBrains Mono', size: 10 }, padding: 6, callback: function (v) { return v % 1 === 0 ? v : ''; } },
            grid: { color: theme.gridColor }, border: { color: theme.borderColor }
          }
        }
      }
    });
    chartRef.chart._pkAnnotations = annotations;
  }
}

