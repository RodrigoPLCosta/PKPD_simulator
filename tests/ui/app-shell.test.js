import { screen } from '@testing-library/dom';
import { describe, expect, it } from 'vitest';
import { renderApp } from './helpers/renderApp.js';

describe('app shell', () => {
  it('boots the current shell in jsdom with the essential regions', async () => {
    await renderApp();

    expect(screen.getByRole('heading', { name: /simulador pk\/pd/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /tema/i })).toBeInTheDocument();
    expect(document.getElementById('sidebar')).toBeInTheDocument();
    expect(document.getElementById('pkC')).toBeInTheDocument();
    expect(document.getElementById('class-tabs')).toBeInTheDocument();
    expect(document.getElementById('dg').children.length).toBeGreaterThan(0);
    expect(document.getElementById('dose-n')).toBeInTheDocument();
    expect(document.getElementById('gfr-n')).toBeInTheDocument();
  });
});
