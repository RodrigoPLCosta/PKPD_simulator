// @ts-check

/**
 * Main entry point — imports all CSS and initialises UI modules.
 */

/* ── Styles ── */
import './styles/tokens.css';
import './styles/theme.css';
import './styles/base.css';
import './styles/chart.css';
import './styles/controls.css';

/* ── UI bootstrap ── */
import { initControls, getChartRef } from './ui/controls.js';
import { initTheme } from './ui/theme.js';
import { initClinicalPanel } from './ui/clinicalPanel.js';

/* ── Init ── */
initClinicalPanel();
initControls();
initTheme(getChartRef());

/* ── Service Worker registration ── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('./sw.js').catch(function () {
      /* SW registration failed — app still works without offline support */
    });
  });
}
