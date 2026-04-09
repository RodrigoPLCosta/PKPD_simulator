import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderApp } from '../../ui/helpers/renderApp.js';

describe('ui contract: undo restores every parameter-changing preset flow', () => {
  it('undoes dose, interval, infusion, MIC and scenario shortcuts', async () => {
    const user = userEvent.setup();
    await renderApp();

    const doseInput = /** @type {HTMLInputElement} */ (document.getElementById('dose-n'));
    const intervalInput = /** @type {HTMLInputElement} */ (document.getElementById('int-n'));
    const infusionInput = /** @type {HTMLInputElement} */ (document.getElementById('inf-n'));
    const micDisplay = /** @type {HTMLInputElement} */ (document.getElementById('mic-n'));
    const undoButton = document.getElementById('btn-undo');

    await user.click(document.querySelector('#dose-btns .dose-btn[data-v="2000"]'));
    expect(doseInput.value).toBe('2000');
    await user.click(undoButton);
    expect(doseInput.value).toBe('1000');

    await user.click(document.querySelector('#int-btns .int-btn[data-v="12"]'));
    expect(intervalInput.value).toBe('12');
    await user.click(undoButton);
    expect(intervalInput.value).toBe('8');

    await user.click(document.querySelector('#inf-btns .inf-btn[data-v="180"]'));
    expect(infusionInput.value).toBe('180');
    await user.click(undoButton);
    expect(infusionInput.value).toBe('30');

    await user.click(document.getElementById('mic-up'));
    expect(micDisplay.value).toBe('4');
    await user.click(undoButton);
    expect(micDisplay.value).toBe('2');

    await user.click(Array.from(document.querySelectorAll('.sc-btn')).find((button) => button.textContent === 'Mero IC-like q8h'));
    expect(infusionInput.value).toBe('480');
    expect(intervalInput.value).toBe('8');
    await user.click(undoButton);
    expect(infusionInput.value).toBe('30');
    expect(intervalInput.value).toBe('8');
  });
});
