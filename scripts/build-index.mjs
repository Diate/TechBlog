// Sinh assets/posts-index.js từ posts/*.html và ghi vào repo (file này được commit).
//   npm run index
// Cần chạy lại mỗi khi đổi tiêu đề, ngày, #tag hay tóm tắt của một bài, hoặc thêm/xoá bài bằng tay:
// trang chủ chạy bằng Live Server hay mở thẳng file chỉ đọc file này, không tự quét posts/.
// `npm run new` và `npm run dev` đã tự làm việc này; deploy thì `npm run build` luôn sinh lại.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readPosts, writeIndexFile, INDEX_URL } from './lib/posts-index.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { posts, errors, warnings } = await readPosts(root);
for (const w of warnings) console.warn(`cảnh báo  ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`LỖI      ${e}`);
  console.error('Sửa các lỗi trên rồi chạy lại (chưa ghi gì).');
  process.exit(1);
}

const changed = await writeIndexFile(root, posts);
console.log(`${changed ? 'Đã cập nhật' : 'Không đổi:'} ${INDEX_URL.slice(1)} (${posts.length} bài).`);
