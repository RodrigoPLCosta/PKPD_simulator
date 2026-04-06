import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderApp } from './helpers/renderApp.js';

describe('mobile navigation smoke', () => {
  it('opens and closes the parameter drawer', async () => {
    const user = userEvent.setup();
    await renderApp({ width: 390 });

    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sb-overlay');
    const fab = document.getElementById('fab-params');

    await user.click(fab);
    expect(sidebar).toHaveClass('drawer-open');
    expect(overlay).toHaveClass('show');

    await user.keyboard('{Escape}');
    expect(sidebar).not.toHaveClass('drawer-open');
    expect(overlay).not.toHaveClass('show');
  });
});
