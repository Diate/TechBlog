/* Khung mô phỏng cho "{{TITLE}}": canvas + vòng lặp requestAnimationFrame + nút chạy/dừng.
 * Thay phần update() và draw() bằng logic của bạn.
 */
(function () {
  const canvas = document.getElementById('stage');
  const ctx = canvas.getContext('2d');
  const toggle = document.getElementById('toggle');

  let running = false;
  let last = 0;
  let t = 0; // thời gian mô phỏng, tính bằng giây

  // Canvas sắc nét trên màn hình retina: kích thước thật = kích thước CSS × devicePixelRatio.
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function update(dt) {
    t += dt;
  }

  function draw() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent');
    const x = (Math.sin(t * 2) * 0.5 + 0.5) * (w - 40) + 20;
    ctx.beginPath();
    ctx.arc(x, h / 2, 14, 0, Math.PI * 2);
    ctx.fill();
  }

  function frame(now) {
    if (!running) return;
    update(Math.min((now - last) / 1000, 0.1));
    last = now;
    draw();
    requestAnimationFrame(frame);
  }

  toggle.addEventListener('click', () => {
    running = !running;
    toggle.textContent = running ? 'Tạm dừng' : 'Chạy';
    if (running) {
      last = performance.now();
      requestAnimationFrame(frame);
    }
  });

  window.addEventListener('resize', resize);
  resize();
})();
