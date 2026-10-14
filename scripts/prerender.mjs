import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { render, routes, siteUrl } from '../dist-ssr/entry-server.js';

const template = (await readFile('dist/index.html', 'utf8')).replace(/<title>.*?<\/title>/, '');
const manifest = JSON.parse(await readFile('dist/.vite/manifest.json', 'utf8'));
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
for (const route of routes) {
  const { html, head } = await render(route);
  const page = route === '/' ? 'HomePage' : route === '/projects' ? 'ProjectsPage' : route === '/experience' ? 'Experience' : route.startsWith('/projects/') ? 'ProjectDetailPage' : route.startsWith('/blog/') ? 'BlogPost' : route === '/blog' ? 'BlogList' : null;
  const styles = new Set();
  const scripts = new Set();
  const visited = new Set();
  const visit = key => {
    if (visited.has(key)) return;
    visited.add(key);
    const item = manifest[key];
    if (!item) return;
    if (item.file && item.file.endsWith('.js') && !template.includes(item.file)) scripts.add(item.file);
    for (const css of item.css ?? []) if (!template.includes(css)) styles.add(css);
    for (const dependency of item.imports ?? []) visit(dependency);
  };
  if (page) for (const key of Object.keys(manifest)) if (key.endsWith(`/${page}.tsx`)) visit(key);
  const inlinedStyles = [];
  const stylesheetLinks = [];
  for (const file of styles) {
    try {
      const content = await readFile(path.join('dist', file), 'utf8');
      if (content.length < 60000) {
        inlinedStyles.push(`<style data-route-css="${escape(file)}">${content}</style>`);
        continue;
      }
    } catch {}
    stylesheetLinks.push(`<link rel="stylesheet" href="/${escape(file)}">`);
  }
  const stylesheetTags = [...inlinedStyles, ...stylesheetLinks].join('\n');
  const modulePreloadLinks = [...scripts].map(file => `<link rel="modulepreload" crossorigin href="/${escape(file)}">`).join('\n');
  let pageTemplate = template;
  if (route !== '/') {
    pageTemplate = pageTemplate.replace(/<link\s+rel="preload"[^>]*href="\/images\/optimized\/landscapes-atardecer-[^"]*"[^>]*>\s*/gi, '');
  }
  if (head.includes('property="og:title"')) {
    pageTemplate = pageTemplate.replace(/<meta\s+property="og:title"[^>]*>\s*/gi, '');
  }
  if (head.includes('property="og:description"')) {
    pageTemplate = pageTemplate.replace(/<meta\s+property="og:description"[^>]*>\s*/gi, '');
  }
  if (head.includes('name="description"')) {
    pageTemplate = pageTemplate.replace(/<meta\s+name="description"[^>]*>\s*/gi, '');
  }
  if (head.includes('name="twitter:title"')) {
    pageTemplate = pageTemplate.replace(/<meta\s+name="twitter:title"[^>]*>\s*/gi, '');
  }
  if (head.includes('name="twitter:description"')) {
    pageTemplate = pageTemplate.replace(/<meta\s+name="twitter:description"[^>]*>\s*/gi, '');
  }
  pageTemplate = pageTemplate.replace(/(<link\s+rel="stylesheet"[^>]*href="\/assets\/index-[^"]*\.css"[^>]*?)>/i, (match, p1) => {
    if (p1.includes('fetchpriority')) return match;
    return `${p1} fetchpriority="high">`;
  });
  const injectedHead = [head, stylesheetTags, modulePreloadLinks].filter(Boolean).join('\n');
  const result = pageTemplate.replace('<!--app-head-->', injectedHead).replace('<div id="root"></div>', `<div id="root" data-prerendered="${escape(route)}">${html}</div>`);
  const file = path.join('dist', route, 'index.html');
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, result);
}
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(route => `  <url><loc>${escape(siteUrl + route)}</loc></url>`).join('\n')}\n</urlset>\n`;
await writeFile('dist/sitemap.xml', sitemap);
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n# Agentmap: ${siteUrl}/ai-catalog.json\n`);
console.log(`Prerendered ${routes.length} routes; sitemap and canonical URLs use ${siteUrl}.`);
