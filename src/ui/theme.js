// @ts-check

/**
 * Theme toggle — MD3 tokens + accessibility font boost.
 */

import { icon, setIcon } from './icons.js';

/**
 * @typedef {import('../types/contracts.js').ThemeTokens} ThemeTokens
 */

const DEFAULT_THEME = 'light';
let currentTheme = DEFAULT_THEME;

const FALLBACK_THEME_TOKENS = {
  dark: {
    themeColor: '#18212c',
    axisColor: '#8a9aaf',
    gridColor: 'rgba(138, 154, 175, 0.12)',
    borderColor: 'rgba(138, 154, 175, 0.22)',
    tooltipBackground: '#1f2936',
    tooltipTitle: '#e2e8f3',
    tooltipBody: '#c0c9da',
    tooltipBorder: '#425061',
    narrativeSurface: 'rgba(16, 22, 31, 0.88)',
    warningSurface: '#36250a',
    warningOutline: '#b98928',
    warningText: '#ffd48d',
    success: '#7bdba2',
    warning: '#efc072',
    error: '#ffb4ab'
  },
  light: {
    themeColor: '#ebedf4',
    axisColor: '#5b6878',
    gridColor: 'rgba(91, 104, 120, 0.14)',
    borderColor: 'rgba(91, 104, 120, 0.24)',
    tooltipBackground: '#ffffff',
    tooltipTitle: '#171c24',
    tooltipBody: '#43505f',
    tooltipBorder: '#c3c8d4',
    narrativeSurface: 'rgba(255, 255, 255, 0.92)',
    warningSurface: '#fff2d2',
    warningOutline: '#a86e00',
    warningText: '#704900',
    success: '#156d31',
    warning: '#775a12',
    error: '#ba1a1a'
  }
};

const THEME_TOKEN_MAP = {
  themeColor: '--md-sys-color-surface-container',
  axisColor: '--md-sys-color-outline',
  gridColor: '--chart-grid',
  borderColor: '--chart-border',
  tooltipBackground: '--chart-tooltip-background',
  tooltipTitle: '--chart-tooltip-title',
  tooltipBody: '--chart-tooltip-body',
  tooltipBorder: '--chart-tooltip-border',
  narrativeSurface: '--chart-narrative-surface',
  warningSurface: '--chart-warning-surface',
  warningOutline: '--chart-warning-outline',
  warningText: '--chart-warning-text',
  success: '--gn',
  warning: '--am',
  error: '--md-sys-color-error'
};

/**
 * @param {string} variableName
 * @param {keyof typeof FALLBACK_THEME_TOKENS.dark} fallbackKey
 * @returns {string}
 */
function readCssVariable(variableName, fallbackKey) {
  const target = document.body || document.documentElement;
  const cssValue = getComputedStyle(target).getPropertyValue(variableName).trim();
  if (cssValue) return cssValue;
  return FALLBACK_THEME_TOKENS[currentTheme === 'light' ? 'light' : 'dark'][fallbackKey];
}

function syncThemeToggle() {
  const lightBtn = document.getElementById('btn-theme-light');
  const darkBtn = document.getElementById('btn-theme-dark');
  const labelIcon = document.getElementById('tb-theme-icon');
  if (lightBtn) {
    lightBtn.setAttribute('aria-pressed', currentTheme === 'light' ? 'true' : 'false');
    lightBtn.innerHTML = icon('sun', { size: 16 });
  }
  if (darkBtn) {
    darkBtn.setAttribute('aria-pressed', currentTheme === 'dark' ? 'true' : 'false');
    darkBtn.innerHTML = icon('moon', { size: 16 });
  }
  if (labelIcon) {
    labelIcon.innerHTML = icon(currentTheme === 'light' ? 'sun' : 'moon', { size: 16 });
  }
}

function syncThemeMeta() {
  const meta = /** @type {HTMLMetaElement | null} */ (document.querySelector('meta[name="theme-color"]'));
  if (meta) {
    meta.content = readThemeTokens().themeColor;
  }
}

function injectHeaderIcons() {
  setIcon(document.getElementById('hd-logo'), 'brand', { size: 22 });
  setIcon(document.getElementById('btn-undo'), 'undo', { size: 16 });
  setIcon(document.getElementById('btn-snap'), 'save', { size: 16 });
  setIcon(document.getElementById('btn-clear'), 'trash', { size: 16 });
}

/**
 * @returns {ThemeTokens}
 */
export function readThemeTokens() {
  return {
    theme: currentTheme === 'light' ? 'light' : 'dark',
    themeColor: readCssVariable(THEME_TOKEN_MAP.themeColor, 'themeColor'),
    axisColor: readCssVariable(THEME_TOKEN_MAP.axisColor, 'axisColor'),
    gridColor: readCssVariable(THEME_TOKEN_MAP.gridColor, 'gridColor'),
    borderColor: readCssVariable(THEME_TOKEN_MAP.borderColor, 'borderColor'),
    tooltipBackground: readCssVariable(THEME_TOKEN_MAP.tooltipBackground, 'tooltipBackground'),
    tooltipTitle: readCssVariable(THEME_TOKEN_MAP.tooltipTitle, 'tooltipTitle'),
    tooltipBody: readCssVariable(THEME_TOKEN_MAP.tooltipBody, 'tooltipBody'),
    tooltipBorder: readCssVariable(THEME_TOKEN_MAP.tooltipBorder, 'tooltipBorder'),
    narrativeSurface: readCssVariable(THEME_TOKEN_MAP.narrativeSurface, 'narrativeSurface'),
    warningSurface: readCssVariable(THEME_TOKEN_MAP.warningSurface, 'warningSurface'),
    warningOutline: readCssVariable(THEME_TOKEN_MAP.warningOutline, 'warningOutline'),
    warningText: readCssVariable(THEME_TOKEN_MAP.warningText, 'warningText'),
    success: readCssVariable(THEME_TOKEN_MAP.success, 'success'),
    warning: readCssVariable(THEME_TOKEN_MAP.warning, 'warning'),
    error: readCssVariable(THEME_TOKEN_MAP.error, 'error')
  };
}

export function applyChartTheme(chart) {
  if (!chart) return;

  const tokens = readThemeTokens();
  chart.options.scales.x.grid.color = tokens.gridColor;
  chart.options.scales.y.grid.color = tokens.gridColor;
  chart.options.scales.x.border.color = tokens.borderColor;
  chart.options.scales.y.border.color = tokens.borderColor;
  chart.options.scales.x.ticks.color = tokens.axisColor;
  chart.options.scales.y.ticks.color = tokens.axisColor;
  chart.options.scales.x.title.color = tokens.axisColor;
  chart.options.scales.y.title.color = tokens.axisColor;
  chart.options.plugins.tooltip.backgroundColor = tokens.tooltipBackground;
  chart.options.plugins.tooltip.titleColor = tokens.tooltipTitle;
  chart.options.plugins.tooltip.bodyColor = tokens.tooltipBody;
  chart.options.plugins.tooltip.borderColor = tokens.tooltipBorder;
  chart.update('none');
}

function applyTheme(nextTheme, chartRef) {
  currentTheme = nextTheme;
  document.body.dataset.theme = currentTheme;
  document.body.classList.add('a11y');
  syncThemeToggle();
  syncThemeMeta();

  if (chartRef && chartRef.chart) {
    applyChartTheme(chartRef.chart);
  }
}

export function initTheme(chartRef) {
  injectHeaderIcons();

  currentTheme = document.body.dataset.theme || DEFAULT_THEME;
  document.body.dataset.theme = currentTheme;
  document.body.classList.add('a11y');
  syncThemeToggle();
  syncThemeMeta();

  const lightBtn = document.getElementById('btn-theme-light');
  const darkBtn = document.getElementById('btn-theme-dark');
  if (lightBtn) lightBtn.addEventListener('click', function () { if (currentTheme !== 'light') applyTheme('light', chartRef); });
  if (darkBtn) darkBtn.addEventListener('click', function () { if (currentTheme !== 'dark') applyTheme('dark', chartRef); });

  if (chartRef && chartRef.chart) {
    applyChartTheme(chartRef.chart);
  }
}

export function getIsLight() { return currentTheme === 'light'; }
export function getThemeName() { return currentTheme; }
