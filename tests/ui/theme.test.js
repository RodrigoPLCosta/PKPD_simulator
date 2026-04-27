import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderApp } from './helpers/renderApp.js';

describe('theme toggle', () => {
  it('switches the body theme contract and updates meta theme-color', async () => {
    const user = userEvent.setup();
    const { chart, themeModule } = await renderApp();

    const darkButton = screen.getByRole('button', { name: /tema escuro/i });
    const lightTokens = themeModule.readThemeTokens();

    expect(document.body.dataset.theme).toBe('light');
    expect(document.querySelector('meta[name="theme-color"]').content).toBe(lightTokens.themeColor);

    await user.click(darkButton);

    const darkTokens = themeModule.readThemeTokens();
    expect(document.body.dataset.theme).toBe('dark');
    expect(document.querySelector('meta[name="theme-color"]').content).toBe(darkTokens.themeColor);
    expect(darkTokens.themeColor).not.toBe(lightTokens.themeColor);
    expect(chart.update).toHaveBeenCalled();
  });
});
