import fs from 'node:fs';
import path from 'node:path';
import { vi } from 'vitest';

const INDEX_HTML = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf8');

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function getSection(tagName) {
  const match = INDEX_HTML.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i'));
  return match ? match[1] : '';
}

function stripScripts(html) {
  return html.replace(/<script\b[\s\S]*?<\/script>/gi, '');
}

export function readCssFixture(relativePath) {
  return fs.readFileSync(path.resolve(process.cwd(), relativePath), 'utf8');
}

export async function renderApp(options = {}) {
  const { width = 1280 } = options;

  vi.resetModules();

  document.head.innerHTML = stripScripts(getSection('head'));
  document.body.innerHTML = stripScripts(getSection('body'));
  document.body.className = '';
  document.body.removeAttribute('data-theme');

  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width
  });

  Object.defineProperty(window.navigator, 'serviceWorker', {
    configurable: true,
    value: {
      register: vi.fn().mockResolvedValue(undefined)
    }
  });

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  });

  window.scrollTo = vi.fn();

  class MockChart {
    static instances = [];

    constructor(canvas, config) {
      this.canvas = canvas;
      this.config = cloneValue(config);
      this.data = cloneValue(config.data);
      this.options = cloneValue(config.options);
      this.update = vi.fn();
      this.resize = vi.fn();
      this.ctx = {};
      this.chartArea = { left: 0, top: 0, right: 400, bottom: 280 };
      this.scales = {
        x: { getPixelForValue: (value) => value },
        y: { getPixelForValue: (value) => value }
      };
      this._pkAnnotations = null;
      MockChart.instances.push(this);
    }
  }

  globalThis.Chart = MockChart;

  await import('../../../src/main.js');
  window.dispatchEvent(new Event('load'));
  await Promise.resolve();

  const themeModule = await import('../../../src/ui/theme.js');

  return {
    chart: MockChart.instances[0] || null,
    MockChart,
    themeModule
  };
}
