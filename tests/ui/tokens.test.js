import { describe, expect, it } from 'vitest';
import { readCssFixture } from './helpers/renderApp.js';

function getBlock(css, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\}`, 'i'));
  return match ? match[1] : '';
}

describe('MD3 tokens', () => {
  it('defines the required color tokens in dark and light themes', () => {
    const css = readCssFixture('src/styles/tokens.css');
    const darkBlock = getBlock(css, ':root');
    const lightBlock = getBlock(css, 'body[data-theme="light"]');
    const required = [
      '--md-sys-color-primary',
      '--md-sys-color-secondary',
      '--md-sys-color-tertiary',
      '--md-sys-color-error',
      '--md-sys-color-outline',
      '--md-sys-color-surface',
      '--md-sys-color-surface-dim',
      '--md-sys-color-surface-bright',
      '--md-sys-color-surface-container-lowest',
      '--md-sys-color-surface-container-low',
      '--md-sys-color-surface-container',
      '--md-sys-color-surface-container-high',
      '--md-sys-color-surface-container-highest',
      '--md-sys-color-on-primary',
      '--md-sys-color-on-secondary',
      '--md-sys-color-on-tertiary',
      '--md-sys-color-on-error',
      '--md-sys-color-on-surface'
    ];

    expect(darkBlock).not.toBe('');
    expect(lightBlock).not.toBe('');
    required.forEach((token) => {
      expect(darkBlock).toContain(token);
      expect(lightBlock).toContain(token);
    });
  });
});
