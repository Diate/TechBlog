# Tech Blog

Blog kỹ thuật tĩnh: HTML + CSS + JS thuần, deploy lên GitHub Pages.
**Mỗi topic là một file duy nhất** trong `posts/` (nội dung, ngày, chủ đề, tóm tắt, ảnh bìa SVG, mô phỏng, CSS, code).
Thêm file là bài tự xuất hiện ở trang chủ, không phải sửa chỗ nào khác.

## Cấu trúc

```
index.html               trang chủ (tiêu đề lớn, tìm kiếm, lọc chủ đề, danh sách/lưới bài)
posts/
  <slug>.html            MỖI TOPIC LÀ MỘT FILE NÀY; tên file là địa chỉ bài
  _<slug>.html           bản nháp: không hiện ở trang chủ, không được deploy
assets/
  css/main.css           giao diện chung + khung .sim, .code, .diagram, .code-links
  fonts/                 Newsreader + Plex Mono + Archivo (tự host, có subset tiếng Việt)
  js/main.js             chèn header/footer, đổi sáng/tối, code lấy từ <script> của bài, tô màu code
  js/home.js             dựng trang chủ (tìm kiếm, lọc, đổi kiểu hiển thị)
  js/covers.js           sinh ảnh bìa SVG cho từng bài
  img/                   (tuỳ chọn) ảnh chụp dùng trong bài
templates/
  post.html              mẫu một file cho topic mới (npm run new copy file này)
  GUIDE.md               hướng dẫn viết topic mới: quy trình, khung bài, quy ước thiết kế, checklist
  components/            thư viện thành phần: xem chạy thật + HTML để chép (chỉ để tra cứu, không deploy)
scripts/
  serve.mjs              chạy local (npm run dev)
  new-post.mjs           tạo topic mới (npm run new)
  build-site.mjs         dựng thư mục site để deploy (npm run build; workflow cũng chạy lệnh này)
  lib/posts-index.mjs    quét posts/*.html để sinh danh sách bài
.github/workflows/       tự deploy lên GitHub Pages khi push vào main
```

Danh sách bài **không nằm trong repo**: nó được sinh từ `posts/*.html` thành `assets/posts-index.js`. `npm run dev` trả file đó theo yêu cầu (F5 là thấy bài mới), còn `npm run build` / workflow ghi nó vào `_site/`. Nhờ vậy trang tĩnh không cần sổ đăng ký nào để sửa tay.

## Chạy local

```
npm run dev
```

Mở http://localhost:8000. Cần chạy qua server (không mở thẳng file `.html`), vì danh sách bài do server sinh ra.
Đổi cổng: `PORT=3000 npm run dev` (PowerShell: `$env:PORT=3000; npm run dev`).
Terminal in LỖI hoặc cảnh báo nếu một bài thiếu thông tin (tiêu đề, ngày, chủ đề, tóm tắt).

Xem đúng thứ sẽ được deploy: `npm run build` rồi mở thư mục `_site/` bằng một server tĩnh bất kỳ.

## Viết bài mới

Làm gì, thiết kế ra sao: đọc `templates/GUIDE.md` (một trang). Xem từng thành phần chạy thật kèm HTML để chép:
`npm run dev` rồi mở http://localhost:8000/templates/components/

```
npm run new -- a-star-pathfinding "Thuật toán A* tìm đường"
```

Lệnh này tạo `posts/a-star-pathfinding.html` từ `templates/post.html`, vậy thôi. Mở nó ra và sửa:
nội dung, các `#tag` trong `.post-meta`, `<meta name="description">` (tóm tắt), mô phỏng trong `<script id="sim-code">`.
Hoặc không dùng lệnh: tự copy `templates/post.html` thành `posts/<slug>.html`.

Nếu PowerShell chặn `npm` (lỗi execution policy), gọi thẳng: `node scripts/new-post.mjs <slug> "<Tiêu đề>"`.

### Trang chủ đọc gì từ file bài
| Hiện ở trang chủ | Lấy từ |
|---|---|
| Địa chỉ | tên file (bỏ `.html`) |
| Tiêu đề | `<h1>` |
| Ngày, thứ tự | `<time datetime="YYYY-MM-DD">` trong `.post-meta` |
| Chủ đề | các `<span>#tag</span>` trong `.post-meta` |
| Tóm tắt | `<meta name="description">` |
| Ảnh bìa | tự sinh theo chủ đề đầu tiên, hoặc `<meta name="cover">` / `<template id="cover">` |

### Hình và ảnh
Hình minh hoạ vẽ bằng SVG nội tuyến ngay trong file bài (có `role="img"` và `aria-label`), để topic vẫn là một file.
Ảnh chụp: đặt vào `assets/img/` rồi `<img src="../assets/img/ten.png" alt="...">`; đừng nhúng base64 vào HTML.
Ảnh mặc định nằm trong cột chữ; thêm `class="wide"` vào `<figure>` để mở rộng sang phải như khung mô phỏng.

### Ảnh bìa
Trang chủ hiện một ảnh bìa cho mỗi bài, `assets/js/covers.js` tự sinh bằng SVG. Chọn theo thứ tự:
1. `<template id="cover"><svg viewBox="0 0 320 180">…</svg></template>` trong file bài: SVG vẽ tay, dùng được các lớp `ink`, `soft`, `pale`, `line`, `hair`, `thick`.
2. `<meta name="cover" content="assets/img/a.png">`: ảnh có sẵn (đường dẫn tính từ gốc site, tỉ lệ 16:9).
3. `<meta name="cover" content="bars">`: một mẫu có sẵn: `bars`, `tree`, `graph`, `wave`, `grid`, `blocks`, `packets`, `curve`.
4. Không khai báo: mẫu theo chủ đề đầu tiên có trong bảng `TOPIC_MOTIF` đầu `covers.js` (thêm dòng ở đó khi có chủ đề mới).
5. Chủ đề chưa có trong bảng: mẫu chọn theo `slug`.

Ảnh luôn giống nhau cho cùng một `slug`, màu lấy từ biến CSS của theme.

### Sơ đồ
Sơ đồ khối, sơ đồ tuần tự... viết tay bằng SVG trong `<figure class="diagram">`, xem mẫu trong `posts/sorting-visualizer.html`:
- `<figcaption>` đặt đầu `figure` làm tiêu đề; `<svg>` có `viewBox` rộng khoảng 680, `role="img"` kèm `<title>` và `<desc>` (đây là nội dung, không phải trang trí).
- Lớp dùng trong SVG: `.box` (khung), `.box.solid` (khung đặc, chữ `.inv`), `.box.key` (nhấn), `.line` (nét, thêm `.dash` hoặc `.key`), `.life` (đường sống), `.muted`, `.sm`, `.tag`; mũi tên là `<marker class="head">` (`id` phải khác nhau giữa các sơ đồ).
- Màn hình hẹp thì sơ đồ cuộn ngang, `main.js` tự cho nó focus bằng bàn phím khi đó.

### Code
- `<pre><code data-from="#id" data-filename="a.js"></code></pre>` hiển thị nội dung của `<script id="id">` ngay trong file bài, kèm tên file và nút "Tải về" (tạo tại chỗ). Đoạn chạy thật cũng là đoạn được hiển thị, nên chỉ có một bản để sửa. Dùng `<script type="text/plain" id="id">` nếu chỉ để hiển thị.
- `<a data-from="#id" download="a.js">` chỉ đặt link tải về.
- `data-src="đường/dẫn"` vẫn dùng được để nạp một file riêng, nhưng làm vậy topic không còn là một file.

## Giao diện

Phong cách "tạp chí kỹ thuật": giấy + mực + một màu nhấn đỏ son, chữ serif cho nội dung, chữ mono cho nhãn, nút và code.
Mọi thứ nằm trong `assets/css/main.css`.

- **Màu** khai báo thành biến ở đầu file (`--bg`, `--text`, `--accent`...). Giá trị tối được khai báo hai chỗ (theo hệ thống và theo nút đổi theme), sửa màu thì sửa cả hai.
  `--indigo`, `--green`, `--ochre` chỉ dùng cho sơ đồ mô phỏng và màu code. Trong mô phỏng: cột chưa xử lý `--faint`, đang so sánh `--indigo`, vừa đổi `--accent`, xong `--green`.
- **Chữ**: `--font` (nội dung và tiêu đề), `--mono` (nhãn, nút, code), `--display` (chỉ dòng chữ đậm "(Blog)" ở đầu trang chủ). Thêm ký tự ngoài tiếng Việt thì cần thêm subset font tương ứng, xem `assets/fonts/LICENSE.txt`.
- **Trang chủ**: khối `.catalog` luôn tối ở cả hai theme (nó khai báo bộ màu tối riêng ở đầu quy tắc, các thành phần bên trong tự ăn theo). Mặc định là danh sách; nút "Lưới" đổi sang lưới và được nhớ cho lần sau. Ô tìm kiếm bỏ dấu, nên gõ "thuat toan" vẫn ra "Thuật toán".
- **Bố cục bài viết**: lưới ba cột, cột lề (`--margin`) | cột chữ (`--measure`) | phần dư. Đoạn văn, bảng, danh sách nằm ở cột chữ; `.sim`, `.code` và `figure.wide` mở rộng sang phải.
  Số mục `01, 02...` ở lề trái là bộ đếm CSS của thẻ `<h2>`, không cần viết tay.
- **Nhiều chủ đề**: danh sách chủ đề xếp theo số bài (nhiều nhất lên trước). Quá `VISIBLE_TOPICS` (8, trong `assets/js/home.js`) thì gập bớt và có nút "Xem thêm"; chủ đề đang chọn luôn hiện.
- **Khung mô phỏng** `.sim`: thanh tiêu đề lấy từ `aria-label` của `<section>`, nên nhớ đặt `aria-label` có nghĩa.
- **Tên blog** ở đầu trang đổi bằng hằng `SITE_TITLE` trong `assets/js/main.js`.

## Deploy lên GitHub Pages

1. Tạo repo trên GitHub và push (nhánh `main`):
   ```
   git add .
   git commit -m "Khởi tạo blog"
   gh repo create <ten-repo> --public --source . --push
   ```
2. Trên GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**. Chỉ làm một lần.
3. Mỗi lần push vào `main`, workflow `.github/workflows/pages.yml` tự deploy.
   Địa chỉ: `https://<user>.github.io/<ten-repo>/` (đặt tên repo là `<user>.github.io` thì địa chỉ là gốc `https://<user>.github.io/`).

### Lưu ý
- **Luôn dùng đường dẫn tương đối** (`assets/...` ở trang chủ, `../assets/...` trong bài), đừng dùng `/assets/...`. Repo dạng project site nằm dưới `/<ten-repo>/`, đường dẫn bắt đầu bằng `/` sẽ hỏng.
- Workflow chạy `node scripts/build-site.mjs`: chỉ publish `index.html`, `assets/`, `posts/` (bỏ bản nháp `_*.html`) và sinh danh sách bài. Thêm file public ở gốc repo (favicon, CNAME...) thì thêm vào `PUBLIC` trong `scripts/build-site.mjs`.
- Một bài thiếu `<h1>` hoặc `<time>` làm bước build dừng với lỗi (để bài không biến mất âm thầm khỏi trang chủ).
- GitHub Pages phân biệt hoa/thường trong tên file; Windows thì không. Đặt tên file chữ thường để khỏi bị lỗi chỉ xảy ra khi đã deploy.
- Highlight code dùng highlight.js từ cdnjs, nên khối code cần mạng để có màu (không có mạng vẫn đọc được, chỉ không tô màu). Màu từng loại token nằm trong `main.css` (`.hljs-*`), không tải thêm file CSS nào từ CDN.
