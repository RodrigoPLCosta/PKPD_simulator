import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.resolve(root, relativePath), 'utf8');
}

describe('product claim: the app no longer depends on CDN bootstrapping and ships PWA build support', () => {
  it('bundles Chart.js locally instead of loading it from a CDN script tag', () => {
    const indexHtml = read('index.html');
    const chartRuntime = read('src/ui/chartRuntime.js');

    expect(indexHtml).not.toContain('cdnjs.cloudflare.com/ajax/libs/Chart.js');
    expect(chartRuntime).toContain("import RealChart from 'chart.js/auto'");
  });

  it('builds with Vite PWA precaching instead of the legacy handwritten service worker', () => {
    const viteConfig = read('vite.config.js');
    const packageJson = read('package.json');

    expect(viteConfig).toContain('VitePWA');
    expect(viteConfig).toContain('injectRegister: false');
    expect(viteConfig).toContain("includeAssets: ['manifest.json', 'icons/*.png']");
    expect(packageJson).toContain('"typecheck"');
  });
});
