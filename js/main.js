const SERIES_LABELS = {
  all: 'All Works',
  music: 'Music & Dance',
  dream: 'Dreamscapes',
  amuletto: 'Amuletto',
  defilements: 'The Three Defilements',
  locomotive: 'Flying Locomotive',
  circus: 'Space Circus',
  forgetting: 'The Forgetting Flower',
  small: 'Small Studies',
  wagging: 'The Wagging Tail',
  illustration: 'Illustrations',
  sculpture: 'Sculpture'
};

let WORKS = [];
let activeFilter = 'all';
let currentIndex = 0;

function fmtPrice(w) {
  return w.status === 'display' ? 'On Display · Not for Sale' : `${w.price.toLocaleString()} THB`;
}

function buildFilters() {
  const present = new Set(WORKS.map(w => w.series));
  const order = ['all', ...Object.keys(SERIES_LABELS).filter(k => k !== 'all' && present.has(k))];
  const container = document.getElementById('filters');
  container.innerHTML = order.map(key =>
    `<button class="filter-btn${key === 'all' ? ' active' : ''}" data-series="${key}">${SERIES_LABELS[key]}</button>`
  ).join('');
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    activeFilter = btn.dataset.series;
    container.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b === btn));
    renderGallery();
  });
}

function renderGallery() {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = WORKS.map((w, i) => {
    const visible = activeFilter === 'all' || w.series === activeFilter;
    return `
      <div class="card${visible ? '' : ' hidden'}" data-index="${i}">
        <div class="card-img"><img src="${w.img}" alt="${w.title}" loading="lazy"></div>
        <div class="card-body">
          <h3>${w.title}</h3>
          <p class="meta">${w.size} &middot; ${w.technique}</p>
          <p class="price">${fmtPrice(w)}</p>
        </div>
      </div>`;
  }).join('');
  gallery.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => openLightbox(parseInt(card.dataset.index, 10)));
  });
}

function openLightbox(index) {
  currentIndex = index;
  updateLightbox();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function stepLightbox(dir) {
  const visibleIndices = WORKS
    .map((w, i) => i)
    .filter(i => activeFilter === 'all' || WORKS[i].series === activeFilter);
  const pos = visibleIndices.indexOf(currentIndex);
  let next = pos;
  if (pos === -1) {
    next = 0;
  } else {
    next = (pos + dir + visibleIndices.length) % visibleIndices.length;
  }
  currentIndex = visibleIndices[next];
  updateLightbox();
}

function updateLightbox() {
  const w = WORKS[currentIndex];
  document.getElementById('lightboxImg').src = w.img;
  document.getElementById('lightboxImg').alt = w.title;
  document.getElementById('lightboxTitle').textContent = w.title;
  document.getElementById('lightboxMeta').textContent = `${w.size} · ${w.technique}`;
  document.getElementById('lightboxPrice').textContent = fmtPrice(w);
}

function initLightboxControls() {
  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightboxPrev').addEventListener('click', () => stepLightbox(-1));
  document.getElementById('lightboxNext').addEventListener('click', () => stepLightbox(1));
  document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (!document.getElementById('lightbox').classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') stepLightbox(-1);
    if (e.key === 'ArrowRight') stepLightbox(1);
  });
}

function initHeader() {
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  });
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  toggle.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
}

function init() {
  WORKS = typeof WORKS_DATA !== 'undefined' ? WORKS_DATA : [];
  buildFilters();
  renderGallery();
  initLightboxControls();
  initHeader();
}

document.addEventListener('DOMContentLoaded', init);
