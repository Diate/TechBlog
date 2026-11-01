/* Trình mô phỏng: lấy từng bước từ generator trong code/sorting.js rồi vẽ lên các cột. */
(function () {
  const $ = (id) => document.getElementById(id);
  const stage = $('bars');
  const algoSel = $('algo');
  const sizeInp = $('size');
  const speedInp = $('speed');
  const runBtn = $('run');

  let arr = [];
  let bars = [];
  let hot = [];            // các cột đang được tô màu so sánh / hoán đổi
  let gen = null;          // generator của lần chạy hiện tại
  let state = 'idle';      // idle | running | paused | done
  let cmp = 0;
  let swp = 0;
  let raf = 0;
  let last = 0;
  let acc = 0;

  const stepsPerSecond = () => speedInp.value ** 2; // 1..60 -> 1..3600 bước/giây

  function render() {
    $('cmp').textContent = cmp;
    $('swp').textContent = swp;
    runBtn.textContent = { idle: 'Chạy', running: 'Tạm dừng', paused: 'Tiếp tục', done: 'Chạy lại' }[state];
  }

  function shuffle() {
    stop();
    const n = Number(sizeInp.value);
    arr = Array.from({ length: n }, (_, i) => i + 1);
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    stage.replaceChildren(
      ...arr.map((v) => {
        const bar = document.createElement('i');
        bar.style.height = (v / n) * 100 + '%';
        return bar;
      }),
    );
    bars = [...stage.children];
    hot = [];
    gen = null;
    cmp = swp = 0;
    state = 'idle';
    render();
  }

  function paint(step) {
    hot.forEach((b) => (b.className = ''));
    const a = bars[step.i];
    const b = bars[step.j];
    if (step.type === 'swap') {
      a.style.height = (arr[step.i] / arr.length) * 100 + '%';
      b.style.height = (arr[step.j] / arr.length) * 100 + '%';
      swp++;
    } else {
      cmp++;
    }
    a.className = b.className = step.type;
    hot = [a, b];
  }

  // Chạy 1 bước. Trả về false khi thuật toán đã xong.
  function advance() {
    gen ??= Sorting[algoSel.value](arr);
    const r = gen.next();
    if (r.done) {
      hot.forEach((b) => (b.className = ''));
      bars.forEach((b) => (b.className = 'done'));
      stop();
      state = 'done';
      render();
      return false;
    }
    paint(r.value);
    return true;
  }

  function tick(now) {
    if (state !== 'running') return;
    acc += Math.min((now - last) / 1000, 0.1) * stepsPerSecond();
    last = now;
    while (acc >= 1) {
      acc -= 1;
      if (!advance()) return;
    }
    render();
    raf = requestAnimationFrame(tick);
  }

  function start() {
    if (state === 'done') shuffle();
    state = 'running';
    acc = 0;
    last = performance.now();
    render();
    raf = requestAnimationFrame(tick);
  }

  function stop() {
    cancelAnimationFrame(raf);
    if (state === 'running') state = 'paused';
  }

  runBtn.addEventListener('click', () => (state === 'running' ? (stop(), render()) : start()));
  $('step').addEventListener('click', () => {
    if (state === 'done') shuffle();
    stop();
    if (state === 'idle') state = 'paused';
    advance();
    if (state !== 'done') render();
  });
  $('shuffle').addEventListener('click', shuffle);
  algoSel.addEventListener('change', shuffle);
  sizeInp.addEventListener('input', shuffle);

  shuffle();
})();
