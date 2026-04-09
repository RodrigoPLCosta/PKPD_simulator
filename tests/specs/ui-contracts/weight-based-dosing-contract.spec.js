import { fireEvent } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderApp } from '../../ui/helpers/renderApp.js';

describe('ui contract: weight-based dosing reacts on input, not only on blur', () => {
  it('recalculates vancomycin dose during input events', async () => {
    const user = userEvent.setup();
    await renderApp();

    await user.click(Array.from(document.querySelectorAll('.db')).find((button) => button.dataset.k === 'vancomycin'));

    const weightInput = /** @type {HTMLInputElement} */ (document.getElementById('wt-n'));
    const doseInput = /** @type {HTMLInputElement} */ (document.getElementById('dose-n'));
    const badge = document.getElementById('mgkg-badge');

    fireEvent.input(weightInput, { target: { value: '80' } });

    expect(weightInput.value).toBe('80');
    expect(doseInput.value).toBe('1250');
    expect(badge.textContent).toContain('15.6 mg/kg');
  });
});
