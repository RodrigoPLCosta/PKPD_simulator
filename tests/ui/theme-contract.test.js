import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderApp } from './helpers/renderApp.js';

describe('theme contract', () => {
  it('switches token-backed chart colors without breaking the shell', async () => {
    const user = userEvent.setup();
    const { chart, themeModule } = await renderApp();

    const lightTokens = themeModule.readThemeTokens();
    expect(chart.options.scales.x.grid.color).toBe(lightTokens.gridColor);
    expect(document.body.dataset.theme).toBe('light');

    await user.click(screen.getByRole('button', { name: /tema escuro/i }));

    const darkTokens = themeModule.readThemeTokens();
    expect(darkTokens.gridColor).not.toBe(lightTokens.gridColor);
    expect(chart.options.scales.x.grid.color).toBe(darkTokens.gridColor);
    expect(chart.options.plugins.tooltip.backgroundColor).toBe(darkTokens.tooltipBackground);
    expect(document.querySelector('meta[name="theme-color"]').content).toBe(darkTokens.themeColor);
    expect(document.getElementById('sidebar')).toBeInTheDocument();
    expect(document.getElementById('pkC')).toBeInTheDocument();
  });
});
