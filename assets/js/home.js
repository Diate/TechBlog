/* Dựng danh sách bài, ô tìm kiếm, bộ lọc chủ đề và nút đổi kiểu hiển thị ở trang chủ từ window.POSTS (assets/js/posts.js). */
(function () {
  const posts = (window.POSTS || []).slice().sort((a, b) => b.date.localeCompare(a.date));
  const list = document.getElementById('post-list');
  const filters = document.getElementById('filters');
  const count = document.getElementById('count');
  const status = document.getElementById('status');
  const search = document.getElementById('q');
  const viewBtns = [...document.querySelectorAll('.view')];
  const topics = filters.closest('.topics');
  const VISIBLE_TOPICS = 8; // quá số này thì gập bớt, mở bằng nút "Xem thêm" (CSS: .extra)
  let more = null; // nút "Xem thêm chủ đề", chỉ tạo khi có nhiều chủ đề
  let activeTag = null;
  let query = '';

  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* bị chặn thì bỏ qua */ } },
  };
  let view = store.get('view') === 'grid' ? 'grid' : 'list';

  // Số thứ tự cố định theo thứ tự đăng (bài cũ nhất = 01), không đổi khi lọc.
  const numberOf = (p) => String(posts.length - posts.indexOf(p)).padStart(2, '0');

  // Bỏ dấu và chữ hoa để gõ "thuat toan" vẫn ra "Thuật toán".
  const fold = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
  const haystack = new Map(posts.map((p) => [p, fold([p.title, p.summary || '', ...(p.tags || [])].join(' '))]));

  function h(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') node.className = v;
      else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v);
    }
    node.append(...children);
    return node;
  }

  function renderFilters() {
    const counts = new Map();
    for (const p of posts) for (const t of p.tags || []) counts.set(t, (counts.get(t) || 0) + 1);
    // Nhiều bài nhất lên trước; bằng nhau thì theo chữ cái.
    const tags = [...counts.keys()].sort((a, b) => counts.get(b) - counts.get(a) || a.localeCompare(b, 'vi'));

    const topic = (label, n, tag, i) =>
      h('li', { class: i >= VISIBLE_TOPICS ? 'extra' : '' },
        h('button', {
          class: 'topic', type: 'button', 'aria-pressed': String(tag === activeTag),
          onclick: () => { activeTag = activeTag === tag ? null : tag; renderFilters(); renderList(); },
        }, h('span', {}, label), h('span', { class: 'count' }, String(n))));

    filters.replaceChildren(
      topic('Tất cả', posts.length, null, 0),
      ...tags.map((tag, i) => topic(tag, counts.get(tag), tag, i + 1)));

    const hidden = tags.length + 1 - VISIBLE_TOPICS;
    topics.classList.toggle('is-long', hidden > 0);
    if (hidden > 0 && !more) {
      more = h('button', {
        class: 'topics-more', type: 'button', 'aria-controls': 'filters',
        onclick: () => { topics.classList.toggle('is-open'); renderMore(); },
      });
      filters.after(more);
    }
    if (more) renderMore();
  }

  function renderMore() {
    const open = topics.classList.contains('is-open');
    more.setAttribute('aria-expanded', String(open));
    more.textContent = open ? 'Thu gọn' : `Xem thêm ${filters.querySelectorAll('.extra').length} chủ đề`;
  }

  function entry(p) {
    return h('article', { class: 'entry' },
      h('div', { class: 'entry-body' },
        h('p', { class: 'entry-meta' },
          h('span', { class: 'entry-num' }, numberOf(p)),
          h('time', { datetime: p.date }, p.date)),
        h('h3', { class: 'entry-title' }, h('a', { href: `posts/${p.slug}/` }, p.title)),
        ...(p.summary ? [h('p', { class: 'entry-summary' }, p.summary)] : [])),
      h('div', { class: 'entry-cover' }, window.COVERS.render(p)),
      h('p', { class: 'entry-tags' }, ...(p.tags || []).map((t) => h('span', {}, '#' + t))));
  }

  let statusTimer = 0;
  function announce(text) { // gõ nhanh thì chỉ đọc kết quả cuối
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => { status.textContent = text; }, 300);
  }

  function reset() {
    activeTag = null; query = ''; search.value = '';
    renderFilters(); renderList();
  }

  function renderList() {
    const terms = fold(query).split(/\s+/).filter(Boolean);
    const shown = posts.filter((p) =>
      (!activeTag || (p.tags || []).includes(activeTag)) && terms.every((t) => haystack.get(p).includes(t)));
    count.textContent = `(${shown.length})`;
    const filtered = [activeTag && `Chủ đề ${activeTag}`, query.trim() && `Tìm "${query.trim()}"`].filter(Boolean);
    announce(`${filtered.length ? filtered.join(', ') + ': ' : ''}${shown.length} bài viết`);
    if (!shown.length) {
      list.replaceChildren(posts.length
        ? h('p', { class: 'empty' }, 'Không có bài nào khớp.', h('button', { type: 'button', onclick: reset }, 'Xoá bộ lọc'))
        : h('p', { class: 'empty' }, 'Chưa có bài viết nào.'));
      return;
    }
    list.replaceChildren(...shown.map(entry));
  }

  function setView(next) {
    view = next;
    list.dataset.view = view;
    viewBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
    store.set('view', view);
  }

  viewBtns.forEach((b) => b.addEventListener('click', () => setView(b.dataset.view)));
  search.addEventListener('input', () => { query = search.value; renderList(); });
  list.dataset.view = view;
  viewBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === view)));

  renderFilters();
  renderList();
})();
