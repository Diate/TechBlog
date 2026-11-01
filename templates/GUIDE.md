# Viết một topic mới

**Một topic = một file** trong `posts/`. Nội dung, ngày, chủ đề, tóm tắt, ảnh bìa, mô phỏng, CSS và code đều nằm trong file đó.
Thêm file là bài tự xuất hiện ở trang chủ, không phải đăng ký hay sửa chỗ nào khác.

Đọc file này là đủ để làm một bài, không cần đọc mã nguồn của dự án.
Xem từng thành phần chạy thật (kèm HTML để chép): `npm run dev` rồi mở http://localhost:8000/templates/components/

## 1. Quy trình

1. Tạo bài: `npm run new -- ten-bai "Tiêu đề bài"`
   (PowerShell chặn `npm`: `node scripts/new-post.mjs ten-bai "Tiêu đề bài"`). Hoặc tự copy `templates/post.html` thành `posts/ten-bai.html`.
2. Chạy `npm run dev`, mở http://localhost:8000/posts/ten-bai.html và để mở trong lúc làm. Sửa file rồi F5.
3. Trong file đó, sửa theo khung ở mục 2. Có ba chỗ nhớ điền: `#tag` trong `.post-meta`, `<meta name="description">` (tóm tắt), và `<time>` nếu muốn đổi ngày.
4. Làm mô phỏng trong thẻ `<script id="sim-code">` ở cuối file (khung chạy sẵn, chỉ thay `update()` và `draw()`).
5. Đi qua checklist ở mục 6, rồi commit và push. Site tự deploy.

Muốn viết dở mà chưa cho ai thấy: đặt tên file bắt đầu bằng `_` (ví dụ `posts/_a-star.html`). Bài đó không hiện ở trang chủ và không được deploy. Bỏ dấu `_` khi sẵn sàng.

## 2. Khung của một bài

Sắp theo thứ tự này; bỏ phần nào không cần, đừng đảo thứ tự. Blog này sống nhờ mô phỏng, nên **mô phỏng đứng trước, giải thích đứng sau**.

| # | Phần | Thành phần |
|---|---|---|
| 1 | Đoạn mở đầu, 1 đến 2 câu: bài cho người đọc điều gì | `<p>` đầu tiên sau `.post-meta` (tự to hơn) |
| 2 | Mô phỏng, đặt ngay sau đoạn mở đầu | `<section class="sim" aria-label="...">` |
| 3 | Ý tưởng cốt lõi | `<h2>` + chữ, thêm sơ đồ khối nếu có nhiều phần |
| 4 | Cách làm | `<h2>` + khối code, thêm sơ đồ tuần tự nếu có nhiều bên trao đổi |
| 5 | So sánh số liệu (nếu có) | `<table>` |
| 6 | File code của bài | `<ul class="code-links">` |

Mỗi `<h2>` nói một ý và tự được đánh số ở lề trái. Không lồng quá một tầng `<h3>`.

## 3. Trang chủ đọc gì từ file của bạn

Không có sổ đăng ký: trang chủ đọc thẳng từ file, nên thứ bạn thấy trong bài cũng chính là thứ hiện ở danh sách.

| Hiện ở trang chủ | Lấy từ trong file |
|---|---|
| Địa chỉ bài | tên file (bỏ `.html`), chữ thường, số, dấu gạch ngang |
| Tiêu đề | `<h1>` |
| Ngày, thứ tự | `<time datetime="YYYY-MM-DD">` trong `.post-meta` |
| Chủ đề (lọc, tìm kiếm) | các `<span>#tên-chủ-đề</span>` trong `.post-meta` |
| Tóm tắt (cắt sau hai dòng) | `<meta name="description" content="...">` |
| Ảnh bìa | tự sinh theo chủ đề đầu tiên; ghi đè bằng `<meta name="cover" content="bars">` hoặc `<template id="cover"><svg>…</svg></template>` |

Thiếu `<h1>` hay `<time>` thì bài bị loại và terminal của `npm run dev` báo lý do; `npm run build` dừng với lỗi đó. Thiếu chủ đề hoặc tóm tắt chỉ bị cảnh báo.

## 4. Muốn nói gì thì dùng gì

| Ý định | Dùng | Ghi chú |
|---|---|---|
| Cho người đọc tự thử, tự chỉnh | Mô phỏng `.sim` | Luôn có nút Chạy/Tạm dừng; thêm nút Bước nếu có thể đi từng bước |
| Các phần của hệ thống và dữ liệu giữa chúng | Sơ đồ khối `figure.diagram` | Khối quan trọng nhất thêm `key` |
| Nhiều bên trao đổi theo thứ tự thời gian | Sơ đồ tuần tự `figure.diagram` | Một nhãn ngắn cho mỗi mũi tên |
| Code người đọc sẽ chép | `<pre><code data-from="#id">` | Lấy từ `<script id="id">` trong file, có nút tải |
| Vài dòng code minh hoạ | `<pre><code class="language-js">` | Escape `<` thành `&lt;` |
| So sánh số liệu giữa các lựa chọn | `<table>` | Cột đầu là tên đối tượng |
| Lưu ý, ngoại lệ, mẹo ngoài mạch chính | `<div class="note">` | Không quá hai cái mỗi bài |
| Hình minh hoạ | `<figure>` + SVG nội tuyến | Có `role="img"` và `aria-label`; thêm `class="wide"` để rộng hơn |
| Ảnh chụp | `<img src="../assets/img/ten.png" alt="...">` | File ảnh là thứ duy nhất nằm ngoài file bài |

## 5. Quy ước thiết kế

- **Màu**: chỉ dùng biến CSS (`var(--accent)`), không viết mã màu trong bài, không thêm màu mới. `--accent` là màu nhấn duy nhất. `--indigo`, `--green`, `--ochre` chỉ dùng trong mô phỏng, sơ đồ và code. `--faint` chỉ cho đồ hoạ, không bao giờ cho chữ (không đủ tương phản). Bảng màu đầy đủ ở cuối trang thư viện.
- **Màu trong mô phỏng** giữ nghĩa cố định để mọi bài đọc giống nhau: chưa xử lý `--faint`, đang xét `--indigo`, vừa thay đổi `--accent`, xong `--green`. Canvas đọc màu bằng `getComputedStyle(document.documentElement).getPropertyValue('--accent')` (xem `templates/post.html`), vẽ lại khi cần.
- **CSS riêng** của topic đặt trong thẻ `<style>` ở `<head>` của chính file đó.
- **Chữ**: nội dung dùng serif, nhãn, nút và code dùng mono. Font đậm cỡ lớn (`--display`) chỉ dành cho trang chủ.
- **Độ rộng đọc**: không tự đổi `--measure` hay kéo rộng đoạn văn. Cần chỗ rộng thì dùng thành phần mở rộng (`.sim`, `.code`, `figure.wide`, `figure.diagram`).
- **Trợ năng**: sơ đồ có `<title>` và `<desc>` (mô tả đầy đủ bằng lời), hình và ảnh có mô tả, mô phỏng dùng được bằng bàn phím, nút có chữ rõ ràng. Không dùng ảnh chỉ để trang trí.
- **Ngôn ngữ**: giao diện và lời giải thích bằng tiếng Việt; thuật ngữ tiếng Anh giữ nguyên, đặt trong `<code>` khi là tên hàm, biến, file.
- **Đường dẫn**: luôn tương đối (`../assets/...`), không bắt đầu bằng `/`, để chạy được cả trên GitHub Pages theo dạng project site.
- **Không làm**: nhúng thư viện ngoài, nhúng ảnh base64, viết `style="color:..."`, thêm hiệu ứng chuyển động ngoài những gì đã có.

## 6. Checklist trước khi đăng

- [ ] Tên file đúng (đây là địa chỉ bài); `npm run dev` không in LỖI hay cảnh báo cho bài này
- [ ] `<h1>`, `<time>`, `#tag` (đã đổi khỏi `#tag` mẫu), `<meta name="description">` đã điền
- [ ] Chủ đề đầu tiên đúng (ảnh bìa trang chủ trông hợp bài)
- [ ] Mô phỏng chạy, Bước/Tạm dừng/Chạy lại đều đúng, tab được bằng bàn phím
- [ ] Sơ đồ có `<title>` + `<desc>`; hình và ảnh có mô tả
- [ ] Bấm nút ◐ ở header: sáng và tối đều đọc rõ, mô phỏng không "mất màu"
- [ ] Thu cửa sổ còn khoảng 390px: không cuộn ngang toàn trang (chỉ bảng, code, sơ đồ được cuộn trong khung của nó)
- [ ] Console trình duyệt không có lỗi
- [ ] Mở trang chủ: bài hiện đúng ngày, chủ đề, ảnh bìa, và bấm vào mở đúng bài

## 7. Cái gì nằm ở đâu

| Muốn sửa | Chỗ sửa |
|---|---|
| Một topic (mọi thứ của nó) | `posts/<slug>.html`, không có chỗ nào khác |
| Màu, chữ, bố cục chung, thành phần dùng chung | `assets/css/main.css` (các mục có đề mục ở đầu) |
| Bảng chủ đề → mẫu ảnh bìa, thêm mẫu mới | `assets/js/covers.js` |
| Header, footer, nút sáng/tối, tô màu code | `assets/js/main.js` |
| Tên blog | hằng `SITE_TITLE` trong `assets/js/main.js` |
| Trang chủ: tìm kiếm, lọc, danh sách/lưới | `assets/js/home.js` + `index.html` |
| Cách danh sách bài được quét và sinh ra | `scripts/lib/posts-index.mjs` |
| Những gì được đưa lên site | `PUBLIC` trong `scripts/build-site.mjs` |
