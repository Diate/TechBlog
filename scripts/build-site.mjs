// Dựng thư mục site sẽ được deploy (workflow GitHub Pages cũng chạy đúng lệnh này).
//   npm run build                      -> _site/
//   node scripts/build-site.mjs <dir>  -> thư mục khác
// Việc nó làm: copy phần "public" của repo, bỏ bản nháp (posts/_*.html), và sinh assets/posts-index.js
// từ posts/*.html để trang chủ biết có những bài nào.
import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readPosts, postsScript, INDEX_URL } from './lib/posts-index.mjs';

// Thêm file/thư mục public ở gốc repo (vd: CNAME, favicon.ico, robots.txt) vào đây, nếu không nó sẽ không lên site.
const PUBLIC = ['index.html', 'assets', 'posts'];

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.resolve(root, process.argv[2] || '_site');
if (out === root || root.startsWith(out + path.sep)) {
  console.error(`Từ chối ghi vào ${out}: đó là thư mục dự án hoặc thư mục cha của nó.`);
  process.exit(1);
}

const { posts, errors, warnings } = await readPosts(root);
for (const w of warnings) console.warn(`cảnh báo  ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`LỖI      ${e}`);
  console.error('Sửa các lỗi trên rồi chạy lại.');
  process.exit(1);
}

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
const postsDir = path.join(root, 'posts') + path.sep;
for (const item of PUBLIC) {
  const from = path.join(root, item);
  if (!existsSync(from)) { console.warn(`cảnh báo  ${item} có trong PUBLIC nhưng không tồn tại, bỏ qua`); continue; }
  await cp(from, path.join(out, item), {
    recursive: true,
    filter: (src) => !(src.startsWith(postsDir) && path.basename(src).startsWith('_')), // bản nháp
  });
}
await writeFile(path.join(out, INDEX_URL), postsScript(posts));
await writeFile(path.join(out, '.nojekyll'), '');

console.log(`Đã dựng ${path.relative(root, out) || '.'}/ với ${posts.length} bài.`);
