/* Danh sách bài viết hiển thị ở trang chủ.
 * `npm run new -- <slug> "<Tiêu đề>"` tự thêm bài mới vào đầu danh sách này;
 * bạn chỉ cần điền tags + summary. Trang chủ tự sắp theo ngày mới nhất.
 * Tuỳ chọn: cover: "bars" (tên mẫu) hoặc "cover.svg" (file trong thư mục bài) để chọn ảnh bìa,
 * không khai báo thì ảnh bìa tự sinh theo tag đầu tiên. Xem assets/js/covers.js.
 */
window.POSTS = [
  {
    slug: "sorting-visualizer",
    title: "Trực quan hoá các thuật toán sắp xếp",
    date: "2026-10-31",
    tags: ["thuật toán", "simulation"],
    summary: "Xem Bubble, Selection, Insertion và Quick sort chạy từng bước, đếm số lần so sánh và hoán đổi.",
  },
];
