# Tech Blog

Blog kỹ thuật tĩnh: HTML + CSS + JS thuần, không build step, deploy lên GitHub Pages.
Mỗi bài là một thư mục riêng chứa trang HTML, mô phỏng (JS), ảnh và file code.

## Cấu trúc

```
index.html               trang chủ (tiêu đề lớn, tìm kiếm, lọc chủ đề, danh sách/lưới bài)
assets/
  css/main.css           giao diện chung + khung .sim, .code, .diagram, .code-links
  fonts/                 Newsreader + Plex Mono + Archivo (tự host, có subset tiếng Việt)
  js/main.js             chèn header/footer, đổi sáng/tối, nạp + tô màu code
  js/posts.js            DANH SÁCH BÀI hiển thị ở trang chủ
  js/home.js             dựng trang chủ từ posts.js (tìm kiếm, lọc, đổi kiểu hiển thị)
  js/covers.js           sinh ảnh bìa SVG cho từng bài
posts/
  <slug>/
    index.html           nội dung bài
    sim.js               mô phỏng
    code/                file code đính kèm (hiện trong bài + nút tải)
    images/              ảnh
templates/
  GUIDE.md               hướng dẫn viết topic mới: quy trình, khung bài, quy ước thiết kế, checklist
  components/            thư viện thành phần: xem chạy thật + HTML để chép (chỉ để tra cứu, không deploy)
  post/                  mẫu cho bài mới (npm run new copy thư mục này)
scripts/                 serve.mjs (chạy local), new-post.mjs (tạo bài)
.github/workflows/       tự deploy lên GitHub Pages khi push vào main
```

## Chạy local

```
npm run dev
```

Mở http://localhost:8000. Cần chạy qua server (không mở thẳng file `.html`), vì trang nạp code bằng `fetch`.
Đổi cổng: `PORT=3000 npm run dev` (PowerShell: `$env:PORT=3000; npm run dev`).

## Viết bài mới

Làm gì, thiết kế ra sao: đọc `templates/GUIDE.md` (một trang). Xem từng thành phần chạy thật kèm HTML để chép:
`npm run dev` rồi mở http://localhost:8000/templates/components/

```
npm run new -- a-star-pathfinding "Thuật toán A* tìm đường"
```

Lệnh này copy `templates/post` thành `posts/a-star-pathfinding/` và thêm bài vào đầu `assets/js/posts.js`.
Sau đó: sửa `index.html` + `sim.js`, điền `tags` và `summary` trong `posts.js`.
Tuỳ chọn thêm `cover` để chọn ảnh bìa, xem "Ảnh bìa" bên dưới.

Nếu PowerShell chặn `npm` (lỗi execution policy), gọi thẳng: `node scripts/new-post.mjs <slug> "<Tiêu đề>"`.

### Ảnh
Bỏ vào `posts/<slug>/images/` rồi `<img src="images/ten.png" alt="...">`.
Ảnh mặc định nằm trong cột chữ; thêm `class="wide"` vào `<figure>` để ảnh mở rộng sang phải như khung mô phỏng.
Dán ảnh chụp màn hình: lưu thành file `.png`/`.webp` trong thư mục đó, không nhúng base64 vào HTML.

### Ảnh bìa
Trang chủ hiện một ảnh bìa cho mỗi bài, `assets/js/covers.js` tự sinh bằng SVG (không cần ảnh thật). Chọn theo thứ tự:
1. `cover: "cover.svg"` (hoặc `.png`, `.webp`...) trong `posts.js`: dùng file trong thư mục bài, tỉ lệ 16:9.
2. `cover: "bars"`: dùng một mẫu có sẵn: `bars`, `tree`, `graph`, `wave`, `grid`, `blocks`, `packets`, `curve`.
3. Không khai báo: lấy mẫu theo tag đầu tiên có trong bảng `TOPIC_MOTIF` đầu `covers.js` (thêm dòng ở đó khi có chủ đề mới).
4. Tag chưa có trong bảng: mẫu chọn theo `slug`.

Ảnh luôn giống nhau cho cùng một `slug`, màu lấy từ biến CSS của theme.

### Sơ đồ
Sơ đồ khối, sơ đồ tuần tự... viết tay bằng SVG trong `<figure class="diagram">`, xem mẫu trong `posts/sorting-visualizer/index.html`:
- `<figcaption>` đặt đầu `figure` làm tiêu đề; `<svg>` có `viewBox` rộng khoảng 680, `role="img"` kèm `<title>` và `<desc>` (đây là nội dung, không phải trang trí).
- Lớp dùng trong SVG: `.box` (khung), `.box.solid` (khung đặc, chữ `.inv`), `.box.key` (nhấn), `.line` (nét, thêm `.dash` hoặc `.key`), `.life` (đường sống), `.muted`, `.sm`, `.tag`; mũi tên là `<marker class="head">` (`id` phải khác nhau giữa các sơ đồ).
- Màn hình hẹp thì sơ đồ cuộn ngang, `main.js` tự cho nó focus bằng bàn phím khi đó.

### File code
- `<pre><code data-src="code/file.js"></code></pre>` tự nạp file, tô màu, hiện tên file + nút "Tải về".
- Hoặc dùng `<a href="code/file.js" download>` để chỉ đặt link.

## Giao diện

Phong cách "tạp chí kỹ thuật": giấy + mực + một màu nhấn đỏ son, chữ serif cho nội dung, chữ mono cho nhãn, nút và code.
Mọi thứ nằm trong `assets/css/main.css`.

- **Màu** khai báo thành biến ở đầu file (`--bg`, `--text`, `--accent`...). Giá trị tối được khai báo hai chỗ (theo hệ thống và theo nút đổi theme), sửa màu thì sửa cả hai.
  `--indigo`, `--green`, `--ochre` chỉ dùng cho sơ đồ mô phỏng và màu code. Trong mô phỏng: cột chưa xử lý `--faint`, đang so sánh `--indigo`, vừa đổi `--accent`, xong `--green`.
- **Chữ**: `--font` (nội dung và tiêu đề), `--mono` (nhãn, nút, code), `--display` (chỉ dòng chữ đậm "(mô phỏng)" ở đầu trang chủ). Thêm ký tự ngoài tiếng Việt thì cần thêm subset font tương ứng, xem `assets/fonts/LICENSE.txt`.
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
- **Luôn dùng đường dẫn tương đối** (`assets/...`, `../../assets/...`), đừng dùng `/assets/...`. Repo dạng project site nằm dưới `/<ten-repo>/`, đường dẫn bắt đầu bằng `/` sẽ hỏng.
- Workflow chỉ publish `index.html`, `assets/`, `posts/`. Thêm file public ở gốc repo (favicon, CNAME...) thì sửa dòng `cp` trong `pages.yml`.
- GitHub Pages phân biệt hoa/thường trong tên file; Windows thì không. Đặt tên file chữ thường để khỏi bị lỗi chỉ xảy ra khi đã deploy.
- Highlight code dùng highlight.js từ cdnjs, nên khối code cần mạng để có màu (không có mạng vẫn đọc được, chỉ không tô màu). Màu từng loại token nằm trong `main.css` (`.hljs-*`), không tải thêm file CSS nào từ CDN.
