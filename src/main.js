/**
 * Main entry point — imports all CSS and initialises UI modules.
 */

/* ── Styles ── */
import './styles/theme.css';
import './styles/base.css';
import './styles/chart.css';
import './styles/controls.css';

/* ── UI bootstrap ── */
import { initControls, getChartRef } from './ui/controls.js';
import { initTheme } from './ui/theme.js';
import { initEducPanel } from './ui/educPanel.js';

/* ── Init ── */
if (typeof Chart === 'undefined') {
  document.getElementById('pkC').parentElement.innerHTML =
    '<p style="color:#f06060;padding:20px;text-align:center">Chart.js não carregou. Conecte-se à internet e recarregue a página.</p>';
} else {
  initControls();          // wires every control, runs first simulation
  initEducPanel();         // edu accordion click handler
  initTheme(getChartRef()); // light/dark toggle bound to chart instance
}

/* ── Service Worker registration ── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('./sw.js').catch(function () {
      /* SW registration failed — app still works without offline support */
    });
  });
}
