/* Ảnh bìa sinh từ code cho trang chủ: COVERS.render(post) -> phần tử <svg> (hoặc <img>).
 *
 * Chọn hình theo thứ tự (thông tin lấy từ file bài, xem scripts/lib/posts-index.mjs):
 *   1. post.coverSvg: <template id="cover"><svg>…</svg></template> trong file bài -> SVG vẽ tay, có thể dùng các lớp .ink .soft .pale .line .hair
 *   2. post.cover là đường dẫn ảnh ("assets/img/a.png", tính từ gốc site)         -> <img>
 *   3. post.cover là tên mẫu ("bars", "tree"...) từ <meta name="cover">             -> mẫu đó
 *   4. tag đầu tiên có trong TOPIC_MOTIF                                          -> mẫu của chủ đề
 *   5. còn lại                                                                    -> mẫu chọn theo slug
 * Hình chỉ phụ thuộc slug (RNG gieo từ slug) nên mỗi bài luôn ra đúng một hình.
 * Màu lấy từ biến CSS (xem .cover trong main.css), nên đổi theo giao diện.
 */
(function () {
  const W = 320, H = 180;

  // Chủ đề -> mẫu. Thêm dòng ở đây khi có chủ đề mới.
  const TOPIC_MOTIF = {
    'thuật toán': 'bars',
    'cấu trúc dữ liệu': 'tree', 'compiler': 'tree', 'cơ sở dữ liệu': 'tree',
    'lý thuyết đồ thị': 'graph', 'toán rời rạc': 'graph', 'hệ phân tán': 'graph',
    'mạng máy tính': 'packets', 'bảo mật': 'packets', 'mật mã': 'packets',
    'hệ điều hành': 'blocks', 'kiến trúc phần mềm': 'blocks', 'trình duyệt': 'blocks', 'web': 'blocks',
    'học máy': 'curve', 'tối ưu hoá': 'curve', 'hiệu năng': 'curve',
    'đồ hoạ': 'grid', 'xử lý ảnh': 'grid', 'game': 'grid', 'quy hoạch động': 'grid',
    'âm thanh': 'wave', 'vật lý': 'wave', 'dsp': 'wave', 'xử lý tín hiệu': 'wave',
  };
  const HUES = ['--accent', '--indigo', '--green', '--ochre'];

  // ---------- RNG gieo từ chuỗi ----------
  function seedFrom(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return () => {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return (h ^= h >>> 16) >>> 0;
    };
  }
  function rngFrom(str) {
    let a = seedFrom(str)();
    return () => { // mulberry32
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const n1 = (x) => +x.toFixed(1);
  const range = (n) => Array.from({ length: n }, (_, i) => i);
  function shuffled(a, r) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ---------- Các mẫu: mỗi mẫu trả về phần ruột của <svg viewBox="0 0 320 180"> ----------
  // class: ink (đặc), soft (nhạt), pale (sáng), line / hair (nét đậm / mảnh), thick (nét dày).
  const MOTIFS = {
    // Các cột đang được sắp xếp dở (selection sort dừng ở bước k).
    bars(r) {
      const n = 24, a = shuffled(range(n), r), k = 5 + Math.floor(r() * 12);
      for (let i = 0; i < k; i++) {
        let m = i;
        for (let j = i + 1; j < n; j++) if (a[j] < a[m]) m = j;
        [a[i], a[m]] = [a[m], a[i]];
      }
      const gap = 3, w = (272 - gap * (n - 1)) / n;
      const bars = a.map((v, i) => {
        const h = 22 + (v / (n - 1)) * 112;
        return `<rect class="${i < k ? 'ink' : i === k ? 'pale' : 'soft'}" x="${n1(24 + i * (w + gap))}" y="${n1(156 - h)}" width="${n1(w)}" height="${n1(h)}"/>`;
      });
      return `<path class="hair" d="M24 157.5H296"/>${bars.join('')}`;
    },

    // Cây nhị phân bốn tầng, một đường từ gốc xuống lá được tô đậm.
    tree(r) {
      const pos = (l, i) => [n1((W * (i + 0.5)) / 2 ** l), 30 + l * 40];
      const alive = new Set(['0:0']);
      for (let l = 1; l < 4; l++) for (let i = 0; i < 2 ** l; i++) {
        if (alive.has(`${l - 1}:${i >> 1}`) && (l < 2 || r() > 0.28)) alive.add(`${l}:${i}`);
      }
      let path = ['0:0'], i = 0;
      for (let l = 1; l < 4; l++) {
        const kids = [2 * i, 2 * i + 1].filter((c) => alive.has(`${l}:${c}`));
        if (!kids.length) break;
        i = kids[Math.floor(r() * kids.length)];
        path.push(`${l}:${i}`);
      }
      const onPath = new Set(path);
      let edges = '', nodes = '';
      for (const key of alive) {
        const [l, idx] = key.split(':').map(Number);
        const [x, y] = pos(l, idx);
        if (l > 0) {
          const [px, py] = pos(l - 1, idx >> 1);
          const hot = onPath.has(key);
          edges += `<path class="${hot ? 'line thick' : 'hair'}" d="M${px} ${py}L${x} ${y}"/>`;
        }
        nodes += `<circle class="${onPath.has(key) ? 'ink' : 'soft'}" cx="${x}" cy="${y}" r="${onPath.has(key) ? 7 : 5.5}"/>`;
      }
      return edges + nodes;
    },

    // Đồ thị ngẫu nhiên, nối mỗi đỉnh với hai đỉnh gần nhất; một đường đi được tô đậm.
    graph(r) {
      const pts = [];
      for (let t = 0; t < 400 && pts.length < 11; t++) {
        const p = [28 + r() * 264, 24 + r() * 132];
        if (pts.every((q) => Math.hypot(p[0] - q[0], p[1] - q[1]) > 44)) pts.push(p);
      }
      const near = (i) => pts.map((p, j) => [j, Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1])])
        .filter(([j]) => j !== i).sort((a, b) => a[1] - b[1]);
      const edge = new Set();
      pts.forEach((_, i) => near(i).slice(0, 2).forEach(([j]) => edge.add(i < j ? `${i}-${j}` : `${j}-${i}`)));
      const walk = [Math.floor(r() * pts.length)];
      for (let s = 0; s < 4; s++) {
        const next = near(walk.at(-1)).find(([j]) => !walk.includes(j));
        if (!next) break;
        walk.push(next[0]);
      }
      const hot = new Set(walk.slice(1).map((j, k) => [walk[k], j].sort((a, b) => a - b).join('-')));
      const d = (k) => k.split('-').map((i) => pts[i].map(n1).join(' ')).join('L');
      const lines = [...edge].map((k) => `<path class="${hot.has(k) ? 'line thick' : 'hair'}" d="M${d(k)}"/>`).join('');
      const dots = pts.map((p, i) => `<circle class="${walk.includes(i) ? 'ink' : 'soft'}" cx="${n1(p[0])}" cy="${n1(p[1])}" r="${walk.includes(i) ? 7 : 5.5}"/>`).join('');
      return lines + dots;
    },

    // Ba sóng sin chồng nhau.
    wave(r) {
      const curve = (amp, freq, phase, cy) => {
        let d = '';
        for (let x = 0; x <= W; x += 4) d += `${x ? 'L' : 'M'}${x} ${n1(cy + amp * Math.sin((x / W) * freq * Math.PI * 2 + phase))}`;
        return d;
      };
      const ph = () => r() * Math.PI * 2;
      return `<path class="hair" d="M0 90H${W}"/>`
        + `<path class="hair" d="${curve(26, 3 + r() * 2, ph(), 90)}"/>`
        + `<path class="line" d="${curve(38, 1.5 + r() * 1.5, ph(), 90)}"/>`
        + `<path class="line thick" d="${curve(20, 4 + r() * 3, ph(), 90)}"/>`;
    },

    // Automat tế bào một chiều (luật 90, 30 hoặc 110), mỗi hàng là một thế hệ.
    grid(r) {
      const rule = [90, 30, 110][Math.floor(r() * 3)], cols = 28, rows = 16, s = 10;
      let row = Array(cols).fill(0);
      if (rule === 110) row = row.map(() => (r() > 0.6 ? 1 : 0)); else row[Math.floor(cols / 2)] = 1;
      let d = '';
      for (let y = 0; y < rows; y++) {
        row.forEach((on, x) => { if (on) d += `M${20 + x * s} ${10 + y * s}h${s - 1.5}v${s - 1.5}h-${s - 1.5}z`; });
        row = row.map((_, x) => (rule >> ((row[x - 1] ?? 0) * 4 + row[x] * 2 + (row[x + 1] ?? 0))) & 1);
      }
      return `<path class="ink" d="${d}"/>`;
    },

    // Sơ đồ khối: một khối vào, hai khối xử lý, một khối ra.
    blocks(r) {
      const fills = shuffled(['ink', 'soft', 'soft', 'pale'], r);
      const box = (x, y, w, h, c) => `<rect class="${c}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
      const arrow = (x, y) => `<path class="ink" d="M${x} ${y}l-8 -4v8z"/>`; // mũi tên chỉ sang phải, đầu nhọn tại (x, y)
      return `<rect class="hair dash" x="112" y="16" width="96" height="148"/>`
        + box(24, 64, 64, 52, fills[0]) + box(128, 28, 64, 44, fills[1])
        + box(128, 108, 64, 44, fills[2]) + box(232, 64, 64, 52, fills[3])
        + `<path class="line" d="M88 90H100V50H128M100 90V130H128M192 50H212V90H225M192 130H212V90"/>`
        + arrow(128, 50) + arrow(128, 130) + arrow(232, 90);
    },

    // Ba đường sống (lifeline) và các thông điệp qua lại giữa chúng, như sơ đồ tuần tự.
    packets(r) {
      const xs = [70, 160, 250];
      let out = xs.map((x, i) => `<rect class="${i === 1 ? 'ink' : 'soft'}" x="${x - 28}" y="18" width="56" height="16"/>`
        + `<path class="hair" d="M${x} 34V162"/>`).join('');
      let prev = -1;
      for (let m = 0; m < 5; m++) {
        let a = Math.floor(r() * 3), b = Math.floor(r() * 3);
        if (a === b) b = (a + 1 + Math.floor(r() * 2)) % 3;
        if (a === prev) [a, b] = [b, a];
        prev = b;
        const y = 56 + m * 24, dir = Math.sign(xs[b] - xs[a]), x2 = xs[b] - dir * 2;
        out += `<path class="line${m % 2 ? ' dash' : ''}" d="M${xs[a]} ${y}H${x2}"/>`
          + `<path class="ink" d="M${x2} ${y}l${-dir * 8} -4v8z"/>`; // đầu nhọn tại x2, hướng tới b
      }
      return out;
    },

    // Đường đồng mức và một đường đi xuống đáy (gradient descent).
    curve(r) {
      const cx = 150 + r() * 20, cy = 84 + r() * 12, rot = -25 + r() * 50;
      const rings = range(6).map((k) => `<ellipse class="hair" cx="${n1(cx)}" cy="${n1(cy)}" rx="${(k + 1) * 20}" ry="${(k + 1) * 11.5}" transform="rotate(${n1(rot)} ${n1(cx)} ${n1(cy)})"/>`).join('');
      const ang = r() * Math.PI * 2;
      let p = [cx + Math.cos(ang) * 112, cy + Math.sin(ang) * 66];
      const pts = [p];
      for (let s = 0; s < 7; s++) {
        const j = (r() - 0.5) * 14 * 0.8 ** s;
        p = [cx + (p[0] - cx) * 0.74 + j, cy + (p[1] - cy) * 0.74 - j];
        pts.push(p);
      }
      const d = pts.map((q, i) => `${i ? 'L' : 'M'}${n1(q[0])} ${n1(q[1])}`).join('');
      const dots = pts.map((q, i) => `<circle class="${i === pts.length - 1 ? 'pale' : 'ink'}" cx="${n1(q[0])}" cy="${n1(q[1])}" r="${i === pts.length - 1 ? 6 : 3.5}"/>`).join('');
      return `${rings}<path class="line thick" d="${d}"/>${dots}`;
    },
  };

  const IMAGE = /\.(svg|png|jpe?g|webp|avif|gif)$/i;

  function render(post) {
    if (post.coverSvg) {
      const holder = document.createElement('template');
      holder.innerHTML = post.coverSvg;
      const svg = holder.content.querySelector('svg');
      if (svg) {
        svg.classList.add('cover');
        svg.setAttribute('aria-hidden', 'true'); // trang trí: tiêu đề bài đã nằm ngay cạnh
        svg.setAttribute('focusable', 'false');
        if (!svg.style.getPropertyValue('--c')) svg.style.setProperty('--c', 'var(--accent)');
        return svg;
      }
    }
    if (IMAGE.test(post.cover || '')) {
      const img = document.createElement('img');
      img.className = 'cover';
      img.src = post.cover;
      img.alt = ''; // trang trí: tiêu đề bài đã nằm ngay cạnh
      img.loading = 'lazy';
      img.decoding = 'async';
      return img;
    }
    const names = Object.keys(MOTIFS);
    const seed = rngFrom(post.slug);
    const byTag = (post.tags || []).map((t) => TOPIC_MOTIF[t.toLowerCase()]).find(Boolean);
    const name = MOTIFS[post.cover] ? post.cover : byTag || names[Math.floor(seed() * names.length)];
    const hue = HUES[Math.floor(rngFrom(post.slug + '#hue')() * HUES.length)];
    const wrap = document.createElement('template');
    wrap.innerHTML = `<svg class="cover" viewBox="0 0 ${W} ${H}" style="--c: var(${hue})" aria-hidden="true" focusable="false">${MOTIFS[name](rngFrom(post.slug + '#' + name))}</svg>`;
    return wrap.content.firstElementChild;
  }

  window.COVERS = { render, motifs: Object.keys(MOTIFS) };
})();
