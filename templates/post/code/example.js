// Ví dụ file code đính kèm của bài "{{TITLE}}".
// File này được hiển thị trong bài và có nút tải về.
export function fibonacci(n) {
  let [a, b] = [0, 1];
  for (let i = 0; i < n; i++) [a, b] = [b, a + b];
  return a;
}
