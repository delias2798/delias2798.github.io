import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';

const index = 'dist/index.html';
const fallback = 'dist/404.html';

/** Rutas del router (BrowserRouter) — carpetas con index.html para GitHub Pages */
const SPA_ROUTES = ['projects', 'about', 'contact', 'babylonPortfolio'];

if (!existsSync(index)) {
    console.error('copy-spa-fallback: dist/index.html not found. Run vite build first.');
    process.exit(1);
}

copyFileSync(index, fallback);
console.log('copy-spa-fallback: dist/404.html ← index.html');

for (const route of SPA_ROUTES) {
    const dir = join('dist', route);
    mkdirSync(dir, { recursive: true });
    copyFileSync(index, join(dir, 'index.html'));
    console.log(`copy-spa-fallback: dist/${route}/index.html ← index.html`);
}
