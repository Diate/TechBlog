// Server tĩnh tối giản để xem blog ở local, không cần cài gì thêm.
//   npm run dev            -> http://localhost:8000
//   PORT=3000 npm run dev  -> đổi cổng
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readPosts, postsScript, writeIndexFile, INDEX_URL } from './lib/posts-index.mjs';

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
  let info = await stat(file).catch(() => null);
  if (!info && !path.extname(file)) { // /posts/ten-bai -> posts/ten-bai.html, như GitHub Pages
    const withHtml = file + '.html';
    info = await stat(withHtml).catch(() => null);
    if (info) return withHtml;
  }
  if (!info) return null;
  return info.isDirectory() ? path.join(file, 'index.html') : file;
}

// Danh sách bài được sinh lại mỗi lần tải trang, nên thêm/sửa file trong posts/ là thấy ngay (F5).
let lastReport = '';
async function postsIndex() {
  const { posts, errors, warnings } = await readPosts(root);
  const report = [...errors.map((e) => `LỖI      ${e}`), ...warnings.map((w) => `cảnh báo  ${w}`)].join('\n');
  if (report !== lastReport) { lastReport = report; if (report) console.warn(report); }
  // Giữ assets/posts-index.js trong repo luôn khớp posts/ (để Live Server dùng được). Có lỗi thì không ghi,
  // kẻo bài đang sửa dở biến mất khỏi file sẽ được commit.
  if (!errors.length && (await writeIndexFile(root, posts).catch(() => false))) console.log('Đã cập nhật assets/posts-index.js');
  return postsScript(posts);
}

createServer(async (req, res) => {
  try {
    if (new URL(req.url, 'http://localhost').pathname === INDEX_URL) {
      res.writeHead(200, { 'Content-Type': MIME['.js'], 'Cache-Control': 'no-store' });
      return res.end(await postsIndex());
    }
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
