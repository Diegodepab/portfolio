import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { render, routes, siteUrl } from '../dist-ssr/entry-server.js';

const template = (await readFile('dist/index.html', 'utf8')).replace(/<title>.*?<\/title>/, '');
const manifest = JSON.parse(await readFile('dist/.vite/manifest.json', 'utf8'));
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
for (const route of routes) {
  const { html, head } = await render(route);
  const page = route === '/projects' ? 'ProjectsPage' : route.startsWith('/projects/') ? 'ProjectDetailPage' : route.startsWith('/blog/') ? 'BlogPost' : route === '/blog' ? 'BlogList' : null;
  const styles = new Set();
  const visited = new Set();
  const visit = key => {
    if (visited.has(key)) return;
    visited.add(key);
    const item = manifest[key];
    if (!item) return;
    for (const css of item.css ?? []) if (!template.includes(css)) styles.add(css);
    for (const dependency of item.imports ?? []) visit(dependency);
  };
  if (page) for (const key of Object.keys(manifest)) if (key.endsWith(`/${page}.tsx`)) visit(key);
  const stylesheetLinks = [...styles].map(file => `<link rel="stylesheet" href="/${escape(file)}">`).join('\n');
  const result = template.replace('<!--app-head-->', `${head}\n${stylesheetLinks}`).replace('<div id="root"></div>', `<div id="root" data-prerendered="${escape(route)}">${html}</div>`);
  const file = path.join('dist', route, 'index.html');
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, result);
}
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(route => `  <url><loc>${escape(siteUrl + route)}</loc></url>`).join('\n')}\n</urlset>\n`;
await writeFile('dist/sitemap.xml', sitemap);
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
console.log(`Prerendered ${routes.length} routes; sitemap and canonical URLs use ${siteUrl}.`);
