import { describe, expect, it } from 'vitest';
import { readCssFixture } from './helpers/renderApp.js';

describe('typography contract', () => {
  it('applies MD3 type scale tokens to the critical regions', () => {
    const tokens = readCssFixture('src/styles/tokens.css');
    const base = readCssFixture('src/styles/base.css');
    const controls = readCssFixture('src/styles/controls.css');
    const chart = readCssFixture('src/styles/chart.css');

    expect(tokens).toContain('--md-sys-typescale-display-small-size');
    expect(tokens).toContain('--md-sys-typescale-headline-medium-size');
    expect(tokens).toContain('--md-sys-typescale-title-large-size');
    expect(tokens).toContain('--md-sys-typescale-body-medium-size');
    expect(tokens).toContain('--md-sys-typescale-label-small-size');

    expect(base).toMatch(/\.hd h1\{[^}]*var\(--md-sys-typescale-title-large-size\)/);
    expect(base).toMatch(/\.st\{[^}]*var\(--md-sys-typescale-label-small-size\)/);
    expect(base).toMatch(/body\{[^}]*var\(--md-sys-typescale-body-medium-size\)/);
    expect(chart).toMatch(/\.cmp-bar label\{[^}]*var\(--md-sys-typescale-label-medium-size\)/);
  });
});
