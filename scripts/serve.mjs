// Server tĩnh tối giản để xem blog ở local, không cần cài gì thêm.
//   npm run dev            -> http://localhost:8000
//   PORT=3000 npm run dev  -> đổi cổng
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT) || 8000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
};

async function resolveFile(urlPath) {
  const rel = decodeURIComponent(urlPath.split('?')[0]);
  const file = path.join(root, path.normalize(rel));
  if (file !== root && !file.startsWith(root + path.sep)) return null; // chặn ../
  const info = await stat(file).catch(() => null);
  if (!info) return null;
  return info.isDirectory() ? path.join(file, 'index.html') : file;
}

createServer(async (req, res) => {
  try {
    const file = await resolveFile(req.url);
    const body = file && (await readFile(file).catch(() => null));
    if (!body) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 Not found');
    }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(body);
  } catch {
    res.writeHead(400).end('Bad request');
  }
}).listen(port, () => console.log(`Blog đang chạy tại http://localhost:${port}`));
