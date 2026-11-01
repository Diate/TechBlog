// Quét posts/*.html và rút thông tin hiện ở trang chủ ngay từ chính trang bài,
// nên mỗi topic chỉ là MỘT file và không có sổ đăng ký nào để sửa tay.
//
//   tiêu đề   <h1>
//   ngày      <time datetime="YYYY-MM-DD"> (trong .post-meta)
//   chủ đề    các <span>#tag</span> trong .post-meta (tag đầu tiên quyết định mẫu ảnh bìa)
//   tóm tắt   <meta name="description" content="...">
//   ảnh bìa   <meta name="cover" content="bars"> hoặc <template id="cover"><svg>...</svg></template> (tuỳ chọn)
//
// Tên file (bỏ .html) là slug. File bắt đầu bằng "_" là bản nháp: không vào danh sách, không được deploy.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ' };
const decode = (s) => s.replace(/&(?:amp|lt|gt|quot|#39|nbsp);/g, (m) => ENTITIES[m]);
const plain = (html) => decode(html.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();

function metaContent(html, name) {
  for (const [, attrs] of html.matchAll(/<meta\b([^>]*)>/gi)) {
    if (new RegExp(`\\bname\\s*=\\s*"${name}"`, 'i').test(attrs)) {
      const content = attrs.match(/\bcontent\s*=\s*"([^"]*)"/i);
      return content ? decode(content[1]).trim() : '';
    }
  }
  return '';
}

export function parsePost(slug, source) {
  const errors = [];
  const warnings = [];
  const html = source.replace(/<!--[\s\S]*?-->/g, ''); // ví dụ nằm trong chú thích không được tính

  const title = plain(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '');
  const date = html.match(/<time\b[^>]*\bdatetime\s*=\s*"(\d{4}-\d{2}-\d{2})"/i)?.[1] || '';
  const metaBlock = html.match(/<p\b[^>]*\bclass="[^"]*\bpost-meta\b[^"]*"[^>]*>([\s\S]*?)<\/p>/i)?.[1] || '';
  const tags = [...new Set([...metaBlock.matchAll(/<span\b[^>]*>\s*#([^<]+?)\s*<\/span>/gi)].map((m) => decode(m[1]).trim()).filter(Boolean))];
  const summary = metaContent(html, 'description');
  const cover = metaContent(html, 'cover');
  const coverSvg = html.match(/<template\b[^>]*\bid\s*=\s*"cover"[^>]*>([\s\S]*?)<\/template>/i)?.[1].trim() || '';

  if (!SLUG.test(slug)) errors.push(`tên file "${slug}.html" phải là chữ thường, số và dấu gạch ngang (vd: a-star-pathfinding)`);
  if (!title) errors.push('thiếu <h1> (tiêu đề)');
  if (!date) errors.push('thiếu <time datetime="YYYY-MM-DD"> (ngày đăng)');
  if (!tags.length) warnings.push('chưa có chủ đề: thêm <span>#tên-chủ-đề</span> vào .post-meta');
  if (tags.includes('tag')) warnings.push('còn chủ đề mẫu "#tag", hãy đổi thành chủ đề thật');
  if (!summary) warnings.push('thiếu <meta name="description"> (tóm tắt hiện ở trang chủ)');

  const post = { slug, title, date, tags, summary };
  if (cover) post.cover = cover;
  if (coverSvg) post.coverSvg = coverSvg;
  return { post, errors, warnings };
}

export async function readPosts(root) {
  const dir = path.join(root, 'posts');
  const names = (await readdir(dir).catch(() => [])).filter((f) => f.endsWith('.html') && !f.startsWith('_')).sort();
  const posts = [];
  const errors = [];
  const warnings = [];
  for (const name of names) {
    const slug = name.slice(0, -'.html'.length);
    const { post, errors: e, warnings: w } = parsePost(slug, await readFile(path.join(dir, name), 'utf8'));
    errors.push(...e.map((m) => `posts/${name}: ${m}`));
    warnings.push(...w.map((m) => `posts/${name}: ${m}`));
    if (!e.length) posts.push(post);
  }
  return { posts, errors, warnings };
}

// File JS trang chủ đọc (index.html nạp assets/posts-index.js).
export const postsScript = (posts) =>
  `/* Tự sinh bởi scripts/lib/posts-index.mjs từ posts/*.html, đừng sửa tay. */\nwindow.POSTS = ${JSON.stringify(posts, null, 2)};\n`;

export const INDEX_URL = '/assets/posts-index.js';
