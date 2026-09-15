import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
const root = path.resolve(process.env.SERVE_ROOT || 'dist');
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.pdf': 'application/pdf' };
http.createServer(async (req, res) => {
  try {
    let name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (name.includes('..')) { res.writeHead(400).end(); return; }
    if (!path.extname(name)) {
      const candidate = path.join(name, 'index.html');
      try { await readFile(path.join(root, candidate)); name = candidate; }
      catch { name = '/index.html'; }
    }
    let content = await readFile(path.join(root, name));
    const type = types[path.extname(name)] || 'application/octet-stream';
    const headers = { 'Content-Type': type, 'Cache-Control': name === '/index.html' ? 'no-cache' : 'public, max-age=3600' };
    if (/javascript|text\/|json|svg/.test(type) && req.headers['accept-encoding']?.includes('gzip')) {
      content = gzipSync(content);
      headers['Content-Encoding'] = 'gzip';
    }
    res.writeHead(200, headers).end(content);
  } catch { res.writeHead(404).end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`Serving ${root} on http://127.0.0.1:${port}`));
