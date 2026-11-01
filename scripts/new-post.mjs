// Tạo bài viết mới từ templates/post và đăng ký vào assets/js/posts.js.
//   npm run new -- ten-bai-viet "Tiêu đề bài viết"
//   node scripts/new-post.mjs ten-bai-viet "Tiêu đề bài viết"
import { cp, readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [slug, ...rest] = process.argv.slice(2);
const title = rest.join(' ').trim();

if (!slug || !title || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('Cách dùng: npm run new -- <slug> "<Tiêu đề>"');
  console.error('  slug chỉ gồm chữ thường, số và dấu gạch ngang. Vd: a-star-pathfinding');
  process.exit(1);
}

const dest = path.join(root, 'posts', slug);
if (existsSync(dest)) {
  console.error(`posts/${slug} đã tồn tại, chọn slug khác.`);
  process.exit(1);
}

const date = new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD theo giờ máy
const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

await cp(path.join(root, 'templates', 'post'), dest, { recursive: true });

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

for await (const file of walk(dest)) {
  if (!/\.(html|js|css|md)$/.test(file)) continue;
  const text = await readFile(file, 'utf8');
  const shownTitle = file.endsWith('.html') ? escapeHtml(title) : title;
  await writeFile(
    file,
    text.replaceAll('{{TITLE}}', shownTitle).replaceAll('{{SLUG}}', slug).replaceAll('{{DATE}}', date),
  );
}

// Bài mới nằm đầu danh sách.
const postsFile = path.join(root, 'assets', 'js', 'posts.js');
const entry = [
  '',
  '  {',
  `    slug: ${JSON.stringify(slug)},`,
  `    title: ${JSON.stringify(title)},`,
  `    date: ${JSON.stringify(date)},`,
  `    tags: [],`,
  `    summary: "",`,
  '  },',
].join('\n');
const registry = await readFile(postsFile, 'utf8');
if (!registry.includes('window.POSTS = [')) {
  console.error('Không tìm thấy "window.POSTS = [" trong assets/js/posts.js, hãy tự thêm bài vào đó.');
  process.exit(1);
}
await writeFile(postsFile, registry.replace('window.POSTS = [', 'window.POSTS = [' + entry));

console.log(`Đã tạo posts/${slug}/`);
console.log('Việc tiếp theo:');
console.log(`  1. Sửa posts/${slug}/index.html`);
console.log(`  2. Điền tags + summary trong assets/js/posts.js`);
console.log('  3. npm run dev rồi mở http://localhost:8000');
console.log('Cần biết làm gì, thiết kế ra sao: templates/GUIDE.md (mẫu từng thành phần: http://localhost:8000/templates/components/)');
