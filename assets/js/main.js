/* Script dùng chung cho mọi trang. Nạp trong <head>, không cần defer:
 *   <script src="../../assets/js/main.js"></script>
 * Việc làm: áp theme sớm (tránh nháy), chèn header/footer, bọc + nạp + tô màu khối code.
 * Màu giao diện và màu token code đều ở assets/css/main.css.
 */
(function () {
  // Thư mục gốc của site, suy ra từ vị trí file này nên đúng ở mọi trang,
  // kể cả khi deploy ở subpath kiểu https://user.github.io/ten-repo/
  const ROOT = new URL('../../', document.currentScript.src).href;
  const SITE_TITLE = 'Tech Blog'; // đổi tên blog ở đây
  const HLJS = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/';

  // ---------- Theme ----------
  const root = document.documentElement;
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* bỏ qua */ } },
  };
  const savedTheme = store.get('theme');
  if (savedTheme) root.dataset.theme = savedTheme;

  const isDark = () =>
    root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;

  // ---------- Header / footer ----------
  function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') node.className = v;
      else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v);
    }
    node.append(...children);
    return node;
  }

  // Nửa tròn đặc: biểu tượng "sáng/tối" quen thuộc, xoay 180° khi đổi theme (xem .theme-toggle trong CSS).
  const THEME_ICON =
    '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">' +
    '<circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
    '<path d="M8 1.75a6.25 6.25 0 0 1 0 12.5z" fill="currentColor"/></svg>';

  function injectChrome() {
    const toggle = el('button', { class: 'theme-toggle', type: 'button' });
    toggle.innerHTML = THEME_ICON;
    const paint = () => {
      const dark = isDark();
      toggle.dataset.mode = dark ? 'dark' : 'light';
      const label = dark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối';
      toggle.setAttribute('aria-label', label);
      toggle.title = label;
    };
    toggle.addEventListener('click', () => {
      const next = isDark() ? 'light' : 'dark';
      root.dataset.theme = next;
      store.set('theme', next);
      paint();
    });
    paint();

    // Đánh dấu trang hiện tại khi đang ở trang chủ.
    const onHome = location.pathname.replace(/index\.html$/, '') === new URL(ROOT).pathname;
    const navLink = el('a', { href: ROOT }, 'Bài viết');
    if (onHome) navLink.setAttribute('aria-current', 'page');

    const main = document.querySelector('main');
    if (main) { main.id ||= 'main'; main.tabIndex = -1; }

    const header = el('header', { class: 'site-header' },
      el('div', { class: 'container' },
        el('a', { class: 'brand', href: ROOT }, SITE_TITLE),
        el('nav', { 'aria-label': 'Chính' }, navLink),
        toggle));
    const footer = el('footer', { class: 'site-footer' },
      el('div', { class: 'container' }, `© ${new Date().getFullYear()} ${SITE_TITLE}`));

    document.body.prepend(el('a', { class: 'skip-link', href: '#main' }, 'Bỏ qua tới nội dung'), header);
    document.body.append(footer);
  }

  // ---------- Code lấy từ chính trang ----------
  // Code của bài nằm trong <script id="..."> ngay trong file bài: đoạn chạy thật cũng là đoạn được hiển thị
  // và tải về, nên chỉ có một bản để sửa. Dùng <script type="text/plain"> nếu chỉ để hiển thị, không chạy.
  const dedent = (text) => {
    const lines = text.split('\n');
    const indents = lines.filter((l) => l.trim()).map((l) => l.match(/^[ \t]*/)[0].length);
    const cut = indents.length ? Math.min(...indents) : 0;
    return lines.map((l) => l.slice(cut)).join('\n').trim();
  };
  const sourceText = (selector) => {
    const node = document.querySelector(selector);
    return node ? dedent(node.textContent) : null;
  };
  const blobUrl = (text) => URL.createObjectURL(new Blob([text + '\n'], { type: 'text/plain;charset=utf-8' }));

  // <a data-from="#id" download="ten.js">  -> link tải về nội dung của #id
  function enhanceDownloads() {
    document.querySelectorAll('a[data-from]').forEach((a) => {
      const text = sourceText(a.dataset.from);
      if (text != null) a.href = blobUrl(text);
    });
  }

  // ---------- Khối code ----------
  // <pre><code class="language-js">…</code></pre>                                  -> tô màu
  // <pre><code data-from="#id" data-filename="a.js"></code></pre>                  -> lấy code từ phần tử #id, kèm thanh tên file + nút tải
  // <pre><code data-src="code/a.js"></code></pre>                                  -> nạp từ một file riêng (ít dùng)
  // <pre><code data-filename="a.js">…</code></pre>                                 -> hiện tên file
  async function enhanceCode() {
    const blocks = [...document.querySelectorAll('pre > code')];
    if (!blocks.length) return;

    const loaded = blocks.map(async (code) => {
      const pre = code.parentElement;
      const src = code.dataset.src;
      const from = code.dataset.from;
      const inline = from ? sourceText(from) : null;
      const name = code.dataset.filename || (src && src.split('/').pop());
      const wrap = el('div', { class: 'code' });
      pre.replaceWith(wrap);

      if (name) {
        const bar = el('div', { class: 'code-bar' }, el('span', {}, name));
        if (inline != null) bar.append(el('a', { href: blobUrl(inline), download: name }, 'Tải về'));
        else if (src) bar.append(el('a', { href: src, download: name }, 'Tải về'));
        wrap.append(bar);
      }
      wrap.append(pre);
      pre.tabIndex = 0; // vùng cuộn được phải focus được bằng bàn phím

      if (from) {
        code.textContent = inline ?? `// Không tìm thấy phần tử ${from} chứa code.`;
        if (!code.className && inline != null && name) code.className = 'language-' + (name.split('.').pop() || 'plaintext');
      } else if (src) {
        if (!code.className) code.className = 'language-' + (name.split('.').pop() || 'plaintext');
        try {
          const res = await fetch(src);
          if (!res.ok) throw new Error(res.status);
          code.textContent = await res.text();
        } catch {
          code.textContent = `// Không tải được ${src}. Hãy chạy qua web server (npm run dev) thay vì mở file trực tiếp.`;
          code.className = '';
        }
      }
      return code;
    });

    const codes = await Promise.all(loaded);
    // Chỉ nạp bộ tô màu; màu của từng loại token nằm trong main.css để hợp với giao diện sáng/tối.
    if (!window.hljs) {
      await new Promise((resolve) => {
        const s = el('script', { src: HLJS + 'highlight.min.js' });
        s.onload = s.onerror = resolve;
        document.head.append(s);
      });
    }
    if (window.hljs) codes.forEach((c) => c.className && hljs.highlightElement(c));
  }

  // ---------- Sơ đồ ----------
  // <figure class="diagram"> chứa SVG; trên màn hình hẹp nó cuộn ngang, nên chỉ khi đó mới cho focus bằng bàn phím.
  function enhanceDiagrams() {
    const watch = new ResizeObserver((entries) => {
      for (const { target: f } of entries) {
        if (f.scrollWidth > f.clientWidth) f.tabIndex = 0;
        else f.removeAttribute('tabindex');
      }
    });
    document.querySelectorAll('figure.diagram').forEach((f) => watch.observe(f));
  }

  document.addEventListener('DOMContentLoaded', () => {
    injectChrome();
    enhanceDownloads();
    enhanceCode();
    enhanceDiagrams();
  });
})();
