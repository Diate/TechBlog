# Viết một topic mới

Đọc file này là đủ để làm một bài mới, không cần đọc mã nguồn của dự án.
Xem từng thành phần chạy thật (kèm HTML để chép): `npm run dev` rồi mở http://localhost:8000/templates/components/

## 1. Quy trình

1. Tạo bài: `npm run new -- ten-bai "Tiêu đề bài"`
   (PowerShell chặn `npm`: `node scripts/new-post.mjs ten-bai "Tiêu đề bài"`). Lệnh này copy `templates/post/` thành `posts/ten-bai/` và thêm bài vào `assets/js/posts.js`.
2. Chạy `npm run dev`, mở http://localhost:8000/posts/ten-bai/ và để mở trong lúc làm.
3. Viết nội dung trong `posts/ten-bai/index.html` theo khung ở mục 2.
4. Làm mô phỏng trong `posts/ten-bai/sim.js` (khung chạy sẵn, chỉ thay `update()` và `draw()`).
5. Điền `tags` và `summary` cho bài trong `assets/js/posts.js` (tuỳ chọn `cover`, mục 5).
6. Đi qua checklist ở mục 6, rồi commit và push. Site tự deploy.

## 2. Khung của một bài

Sắp theo thứ tự này; bỏ phần nào không cần, đừng đảo thứ tự. Blog này sống nhờ mô phỏng, nên **mô phỏng đứng trước, giải thích đứng sau**.

| # | Phần | Thành phần |
|---|---|---|
| 1 | Đoạn mở đầu, 1 đến 2 câu: bài cho người đọc điều gì | `<p>` đầu tiên sau `.post-meta` (tự to hơn) |
| 2 | Mô phỏng, đặt ngay sau đoạn mở đầu | `<section class="sim" aria-label="...">` |
| 3 | Ý tưởng cốt lõi | `<h2>` + chữ, thêm sơ đồ khối nếu có nhiều phần |
| 4 | Cách làm | `<h2>` + khối code `data-src`, thêm sơ đồ tuần tự nếu có nhiều bên trao đổi |
| 5 | So sánh số liệu (nếu có) | `<table>` |
| 6 | File code của bài | `<ul class="code-links">` |

Mỗi `<h2>` nói một ý và tự được đánh số ở lề trái. Không lồng quá một tầng `<h3>`.

## 3. Muốn nói gì thì dùng gì

| Ý định | Dùng | Ghi chú |
|---|---|---|
| Cho người đọc tự thử, tự chỉnh | Mô phỏng `.sim` | Luôn có nút Chạy/Tạm dừng; thêm nút Bước nếu có thể đi từng bước |
| Các phần của hệ thống và dữ liệu giữa chúng | Sơ đồ khối `figure.diagram` | Khối quan trọng nhất thêm `key` |
| Nhiều bên trao đổi theo thứ tự thời gian | Sơ đồ tuần tự `figure.diagram` | Một nhãn ngắn cho mỗi mũi tên |
| Code người đọc sẽ chép | Khối code `data-src="code/..."` | Một bản duy nhất, có nút tải |
| Vài dòng code minh hoạ | `<pre><code class="language-js">` | Escape `<` thành `&lt;` |
| So sánh số liệu giữa các lựa chọn | `<table>` | Cột đầu là tên đối tượng |
| Lưu ý, ngoại lệ, mẹo ngoài mạch chính | `<div class="note">` | Không quá hai cái mỗi bài |
| Ảnh chụp, ảnh kết quả | `<figure>` hoặc `<figure class="wide">` | Luôn có `alt` |

Xem mẫu HTML của từng thứ trong trang thư viện thành phần (đường dẫn ở đầu file).

## 4. Quy ước thiết kế

- **Màu**: chỉ dùng biến CSS (`var(--accent)`), không viết mã màu trong bài, không thêm màu mới. `--accent` là màu nhấn duy nhất. `--indigo`, `--green`, `--ochre` chỉ dùng trong mô phỏng, sơ đồ và code. `--faint` chỉ cho đồ hoạ, không bao giờ cho chữ (không đủ tương phản). Bảng màu đầy đủ ở cuối trang thư viện.
- **Màu trong mô phỏng** giữ nghĩa cố định để mọi bài đọc giống nhau: chưa xử lý `--faint`, đang xét `--indigo`, vừa thay đổi `--accent`, xong `--green`. Canvas đọc màu bằng `getComputedStyle(document.documentElement).getPropertyValue('--accent')` (xem `templates/post/sim.js`), vẽ lại khi cần.
- **Chữ**: nội dung dùng serif, nhãn, nút và code dùng mono. Font đậm cỡ lớn (`--display`) chỉ dành cho trang chủ.
- **Độ rộng đọc**: không tự đổi `--measure` hay kéo rộng đoạn văn. Cần chỗ rộng thì dùng thành phần mở rộng (`.sim`, `.code`, `figure.wide`, `figure.diagram`).
- **Trợ năng**: sơ đồ có `<title>` và `<desc>` (mô tả đầy đủ bằng lời), ảnh có `alt`, mô phỏng dùng được bằng bàn phím, nút có chữ rõ ràng. Không dùng ảnh chỉ để trang trí.
- **Ngôn ngữ**: giao diện và lời giải thích bằng tiếng Việt; thuật ngữ tiếng Anh giữ nguyên, đặt trong `<code>` khi là tên hàm, biến, file.
- **Đường dẫn**: luôn tương đối (`../../assets/...`, `images/...`), không bắt đầu bằng `/`, để chạy được cả trên GitHub Pages theo dạng project site.
- **Không làm**: nhúng thư viện ngoài, nhúng ảnh base64, viết `style="color:..."`, thêm hiệu ứng chuyển động ngoài những gì đã có.

## 5. Chủ đề và ảnh bìa

- Dùng lại tag đã có ở trang chủ trước khi tạo tag mới, để danh sách chủ đề không loãng.
- **Tag đầu tiên** của bài quyết định mẫu ảnh bìa tự sinh, qua bảng `TOPIC_MOTIF` ở đầu `assets/js/covers.js`. Tag mới chưa có trong bảng thì ảnh chọn theo `slug`; muốn cố định thì thêm một dòng vào bảng đó.
- Ghi đè cho riêng một bài: `cover: "bars"` (tên mẫu: `bars`, `tree`, `graph`, `wave`, `grid`, `blocks`, `packets`, `curve`) hoặc `cover: "cover.svg"` (file 16:9 trong thư mục bài).
- `summary` dài 1 đến 2 câu; danh sách trang chủ cắt sau hai dòng.

## 6. Checklist trước khi đăng

- [ ] Có `<title>` đúng, `description` điền sẵn, `tags` và `summary` đã điền trong `posts.js`
- [ ] Tag đầu tiên đúng chủ đề (ảnh bìa trang chủ trông hợp bài)
- [ ] Mô phỏng chạy, Bước/Tạm dừng/Chạy lại đều đúng, tab được bằng bàn phím
- [ ] Sơ đồ có `<title>` + `<desc>`; ảnh có `alt`
- [ ] Bấm nút ◐ ở header: sáng và tối đều đọc rõ, mô phỏng không "mất màu"
- [ ] Thu cửa sổ còn khoảng 390px: không cuộn ngang toàn trang (chỉ bảng, code, sơ đồ được cuộn trong khung của nó)
- [ ] Console trình duyệt không có lỗi
- [ ] Mở trang chủ: bài hiện đúng ngày, tag, ảnh bìa, và bấm vào mở đúng bài

## 7. Cái gì nằm ở đâu

| Muốn sửa | Chỗ sửa |
|---|---|
| Màu, chữ, bố cục chung, thành phần dùng chung | `assets/css/main.css` (các mục có đề mục ở đầu) |
| CSS riêng chỉ một mô phỏng | thẻ `<style>` trong `posts/<slug>/index.html` |
| Danh sách bài, tag, ảnh bìa từng bài | `assets/js/posts.js` |
| Bảng tag → mẫu ảnh bìa, thêm mẫu mới | `assets/js/covers.js` |
| Header, footer, nút sáng/tối, tô màu code | `assets/js/main.js` |
| Tên blog | hằng `SITE_TITLE` trong `assets/js/main.js` |
| Trang chủ: tìm kiếm, lọc, danh sách/lưới | `assets/js/home.js` + `index.html` |
