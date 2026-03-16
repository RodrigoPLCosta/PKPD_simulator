/**
 * Theme toggle — light/dark mode + accessibility font boost.
 */

let isLight = false;

export function initTheme(chartRef) {
  const themeBtn = document.getElementById('btn-theme');

  themeBtn.addEventListener('click', function () {
    isLight = !isLight;
    document.body.classList.toggle('light', isLight);
    document.body.classList.add('a11y');
    themeBtn.innerHTML = isLight ? '&#9789; Tema' : '&#9788; Tema';

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = isLight ? '#f5f7fa' : '#0f1520';

    if (chartRef.chart) {
      const gridColor = isLight ? 'rgba(0,0,0,.06)' : 'rgba(130,150,185,.04)';
      const borderColor = isLight ? 'rgba(0,0,0,.1)' : 'rgba(130,150,185,.08)';
      const tickColor = isLight ? '#4a5568' : '#536078';
      const titleColor = isLight ? '#4a5568' : '#536078';
      chartRef.chart.options.scales.x.grid.color = gridColor;
      chartRef.chart.options.scales.y.grid.color = gridColor;
      chartRef.chart.options.scales.x.border.color = borderColor;
      chartRef.chart.options.scales.y.border.color = borderColor;
      chartRef.chart.options.scales.x.ticks.color = tickColor;
      chartRef.chart.options.scales.y.ticks.color = tickColor;
      chartRef.chart.options.scales.x.title.color = titleColor;
      chartRef.chart.options.scales.y.title.color = titleColor;
      chartRef.chart.options.plugins.tooltip.backgroundColor = isLight ? '#fff' : '#151d2e';
      chartRef.chart.options.plugins.tooltip.titleColor = isLight ? '#1a2030' : '#e4e9f2';
      chartRef.chart.options.plugins.tooltip.bodyColor = isLight ? '#4a5568' : '#8896b0';
      chartRef.chart.options.plugins.tooltip.borderColor = isLight ? 'rgba(0,0,0,.1)' : 'rgba(130,150,185,.15)';
      chartRef.chart.update('none');
    }
  });

  // Enable a11y by default
  document.body.classList.add('a11y');
}

export function getIsLight() { return isLight; }
