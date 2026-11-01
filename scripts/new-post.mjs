// Tạo topic mới: copy templates/post.html thành posts/<slug>.html.
// Đó là file DUY NHẤT của topic (nội dung, ngày, tag, tóm tắt, ảnh bìa, mô phỏng, CSS, code);
// trang chủ tự quét thư mục posts/ nên không có gì khác phải sửa.
//   npm run new -- ten-bai-viet "Tiêu đề bài viết"
//   node scripts/new-post.mjs ten-bai-viet "Tiêu đề bài viết"
import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readPosts, writeIndexFile } from './lib/posts-index.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [slug, ...rest] = process.argv.slice(2);
const title = rest.join(' ').trim();

if (!slug || !title || !/^_?[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('Cách dùng: npm run new -- <slug> "<Tiêu đề>"');
  console.error('  slug chỉ gồm chữ thường, số và dấu gạch ngang. Vd: a-star-pathfinding');
  console.error('  Bắt đầu slug bằng _ (vd: _a-star) để làm bản nháp: không hiện ở trang chủ, không được deploy.');
  process.exit(1);
}

const dest = path.join(root, 'posts', `${slug}.html`);
if (existsSync(dest)) {
  console.error(`posts/${slug}.html đã tồn tại, chọn slug khác.`);
  process.exit(1);
}

const date = new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD theo giờ máy
const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

await copyFile(path.join(root, 'templates', 'post.html'), dest);
const text = await readFile(dest, 'utf8');
await writeFile(dest, text.replaceAll('{{TITLE}}', escapeHtml(title)).replaceAll('{{DATE}}', date));

const { posts, errors } = await readPosts(root);
if (!errors.length) await writeIndexFile(root, posts); // bản nháp (_slug) không vào danh sách

console.log(`Đã tạo posts/${slug}.html`);
console.log('Việc tiếp theo:');
console.log(`  1. Xem bài: npm run dev rồi mở http://localhost:8000/posts/${slug}.html (hoặc mở file bằng Live Server)`);
console.log('  2. Sửa file đó: nội dung, #tag trong .post-meta, <meta name="description"> (tóm tắt), mô phỏng.');
console.log('  3. Sửa xong thì chạy npm run index để trang chủ cập nhật khi xem bằng Live Server (npm run dev tự làm việc này).');
console.log('  Chi tiết: templates/GUIDE.md');
