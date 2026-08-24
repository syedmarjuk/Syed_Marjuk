/* ============================================================
   main.js — rendering + interaction
   You should not need to edit this file. Content lives in data.js
   ============================================================ */
(function () {
  'use strict';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** Escape untrusted-ish text before injecting as HTML. */
  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /** Turn **bold** into <strong> (after escaping). */
  function bold(str) {
    return esc(str).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }

  const icon = (name, cls = '') =>
    `<svg class="${cls}" aria-hidden="true"><use href="#ic-${name}"></use></svg>`;


  /* ---------- 1. THEME ---------- */
  const THEME_KEY = 'sm-theme';
  const root = document.documentElement;

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    const btn = $('#themeBtn');
    const use = $('#themeIcon');
    if (use) use.setAttribute('href', t === 'dark' ? '#ic-sun' : '#ic-moon');
    if (btn) btn.setAttribute('aria-label',
      t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }

  let stored = null;
  try { stored = localStorage.getItem(THEME_KEY); } catch (e) { /* private mode */ }
  applyTheme(stored || 'dark');

  const themeBtn = $('#themeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* ignore */ }
    });
  }


  /* ---------- 2. NAV ---------- */
  const nav = $('#nav');
  const navLinks = $('#navLinks');
  const navToggle = $('#navToggle');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      const use = $('#navToggleIcon');
      if (use) use.setAttribute('href', open ? '#ic-close' : '#ic-menu');
    });

    // Close after tapping a link, and on Escape
    navLinks.addEventListener('click', e => {
      if (e.target.closest('a')) closeNav();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
        closeNav();
        navToggle.focus();
      }
    });
  }

  function closeNav() {
    if (!navLinks) return;
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    const use = $('#navToggleIcon');
    if (use) use.setAttribute('href', '#ic-menu');
  }

  // Shadow on scroll (throttled with rAF)
  let scrollQueued = false;
  window.addEventListener('scroll', () => {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(() => {
      if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 12);
      scrollQueued = false;
    });
  }, { passive: true });


  /* ---------- 3. RENDER: metrics with count-up ---------- */
  function renderMetrics() {
    const el = $('#metrics');
    if (!el || typeof SITE === 'undefined') return;
    const m = SITE.metrics;
    const rows = [
      { n: m.publications,    label: 'Publications' },
      { n: m.citations,       label: 'Citations' },
      { n: m.hIndex,          label: 'h-index' },
      { n: m.i10Index,        label: 'i10-index' },
      { n: m.cruises,         label: 'Cruises' },
      { n: m.yearsExperience, label: 'Years', suffix: '+' }
    ];
    el.innerHTML = rows.map(r => `
      <div class="metric">
        <dd class="metric-num"><span data-count="${r.n}">0</span>${
          r.suffix ? `<span class="suf">${esc(r.suffix)}</span>` : ''
        }</dd>
        <dt class="metric-label">${esc(r.label)}</dt>
      </div>`).join('');

    countUp();
  }

  function countUp() {
    const targets = $$('[data-count]');
    if (reduceMotion) {
      targets.forEach(t => { t.textContent = t.dataset.count; });
      return;
    }
    targets.forEach(t => {
      const end = parseInt(t.dataset.count, 10) || 0;
      const dur = 1100;
      const t0 = performance.now();
      function step(now) {
        const p = Math.min((now - t0) / dur, 1);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - p, 3);
        t.textContent = Math.round(end * eased);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }


  /* ---------- 4. RENDER: focus pillars ---------- */
  function renderFocus() {
    const el = $('#focus');
    if (!el || typeof FOCUS === 'undefined') return;
    el.innerHTML = FOCUS.map(f => `
      <article class="card">
        <div class="card-icon">${icon(f.icon)}</div>
        <h3>${esc(f.title)}</h3>
        <p>${esc(f.text)}</p>
      </article>`).join('');
  }


  /* ---------- 5. RENDER: cruises ---------- */
  function renderCruises() {
    if (typeof CRUISES === 'undefined') return;

    const v = $('#vessels');
    if (v) v.innerHTML = CRUISES.vessels.map(name =>
      `<div class="vessel">${icon('ship')}<span>${esc(name)}</span></div>`).join('');

    const p = $('#cruiseProgramme');
    if (p) p.textContent = CRUISES.programme;

    const a = $('#cruiseActivities');
    if (a) a.innerHTML = CRUISES.activities.map(t =>
      `<li>${icon('check')}<span>${esc(t)}</span></li>`).join('');
  }


  /* ---------- 6. RENDER: timeline ---------- */
  function renderTimeline() {
    const el = $('#timeline');
    if (!el || typeof EXPERIENCE === 'undefined') return;
    el.innerHTML = EXPERIENCE.map(job => `
      <article class="tl-item reveal${job.current ? ' is-current' : ''}">
        <div class="tl-meta">
          <span class="tl-period">${esc(job.period)}</span>
          ${job.place ? `<span class="tl-place">${icon('pin')}${esc(job.place)}</span>` : ''}
        </div>
        <h3>${esc(job.role)}</h3>
        <p class="tl-org">${esc(job.org)}</p>
        ${job.funder ? `<p class="tl-funder">${icon('fund')}${esc(job.funder)}</p>` : ''}
        <ul class="tl-points">
          ${job.points.map(pt => `<li>${esc(pt)}</li>`).join('')}
        </ul>
      </article>`).join('');
  }


  /* ---------- 7. RENDER: expertise bento ---------- */
  function renderExpertise() {
    const el = $('#expertise-grid');
    if (!el || typeof EXPERTISE === 'undefined') return;
    el.innerHTML = EXPERTISE.map(x => `
      <article class="card${x.span === 'wide' ? ' wide' : ''}">
        <div class="card-icon">${icon(x.icon)}</div>
        <h3 style="margin-bottom:var(--s-4)">${esc(x.title)}</h3>
        <ul class="tick-list">
          ${x.items.map(i => `<li>${icon('check')}<span>${esc(i)}</span></li>`).join('')}
        </ul>
      </article>`).join('');
  }


  /* ---------- 8. RENDER: publications + filter ---------- */
  let activeFilter = 'All';

  function pubTags() {
    const set = new Set();
    PUBLICATIONS.forEach(p => (p.tags || []).forEach(t => set.add(t)));
    return ['All', ...Array.from(set).sort()];
  }

  function renderPubFilters() {
    const el = $('#pubFilters');
    if (!el || typeof PUBLICATIONS === 'undefined') return;
    el.innerHTML = pubTags().map(t => `
      <button class="chip" type="button" data-filter="${esc(t)}"
              aria-pressed="${t === activeFilter}">${esc(t)}</button>`).join('');

    el.addEventListener('click', e => {
      const btn = e.target.closest('[data-filter]');
      if (!btn) return;
      activeFilter = btn.dataset.filter;
      $$('[data-filter]', el).forEach(b =>
        b.setAttribute('aria-pressed', String(b.dataset.filter === activeFilter)));
      renderPubList();
    });
  }

  function renderPubList() {
    const el = $('#pubList');
    if (!el || typeof PUBLICATIONS === 'undefined') return;

    const list = activeFilter === 'All'
      ? PUBLICATIONS
      : PUBLICATIONS.filter(p => (p.tags || []).includes(activeFilter));

    if (!list.length) {
      el.innerHTML = `<div class="empty">${icon('book')}
        <p style="margin:0 auto">No publications match “${esc(activeFilter)}”.</p></div>`;
      return;
    }

    el.innerHTML = list.map(p => `
      <article class="pub">
        <div class="pub-year">${esc(p.year)}<small>${esc(p.publisher || '')}</small></div>
        <div>
          <h3 class="pub-title">${esc(p.title)}</h3>
          <p class="pub-authors">${bold(p.authors)}</p>
          <p class="pub-journal">${esc(p.journal)}</p>
          <div class="pub-foot">
            ${(p.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('')}
            ${p.doi ? `<a class="doi-link" href="${esc(p.doi)}" target="_blank"
                rel="noopener noreferrer">DOI ${icon('ext')}</a>` : ''}
          </div>
        </div>
      </article>`).join('');
  }


  /* ---------- 9. RENDER: models ---------- */
  const STATUS_TEXT = { live: 'Live', development: 'In Development', planned: 'Planned' };

  // Model pages live in /models/. data.js stores bare filenames, so the
  // homepage needs the "models/" prefix while /models/ itself does not.
  const inModelsDir = /\/models(\/|\/index\.html)?$/.test(location.pathname) ||
                      location.pathname.indexOf('/models/') !== -1;
  const modelHref = url => (inModelsDir ? url : 'models/' + url);

  function modelCard(m) {
    const status = STATUS_TEXT[m.status] || m.status;
    const hasLink = m.status === 'live' && m.url;
    return `
      <article class="card model-card">
        <div class="model-head">
          <div class="card-icon" style="margin-bottom:0">${icon(m.icon || 'cube')}</div>
          <span class="status status-${esc(m.status)}">
            <span class="dot" style="background:currentColor;box-shadow:none"></span>${esc(status)}
          </span>
        </div>
        <h3>${esc(m.name)}</h3>
        <p>${esc(m.summary)}</p>

        ${(m.metrics && m.metrics.length) ? `
          <dl class="model-metrics">
            ${m.metrics.map(x => `<div><dt>${esc(x.label)}</dt><dd>${esc(x.value)}</dd></div>`).join('')}
          </dl>` : ''}

        <div class="stack-row">
          ${(m.stack || []).map(s => `<span class="tag">${esc(s)}</span>`).join('')}
        </div>

        <div class="model-foot">
          ${hasLink
            ? `<a class="btn btn-ghost" style="width:100%" href="${esc(modelHref(m.url))}">
                 Open model ${icon('arrow')}</a>`
            : `<button class="btn btn-ghost" style="width:100%;opacity:.5;cursor:not-allowed"
                 type="button" disabled>Not yet published</button>`}
        </div>
      </article>`;
  }

  function renderModels() {
    if (typeof MODELS === 'undefined') return;
    const home = $('#modelsGrid');
    if (home) home.innerHTML = MODELS.slice(0, 4).map(modelCard).join('');
    const all = $('#modelsAll');
    if (all) all.innerHTML = MODELS.map(modelCard).join('');
  }


  /* ---------- 10. RENDER: awards / education / conferences ---------- */
  function renderAwards() {
    const el = $('#awardGrid');
    if (!el || typeof AWARDS === 'undefined') return;
    el.innerHTML = AWARDS.map(a => `
      <article class="award${a.featured ? ' featured' : ''}">
        <div class="award-ico">${icon('trophy')}</div>
        <div>
          <p class="award-year">${esc(a.year)}</p>
          <h4>${esc(a.title)}</h4>
          <p>${esc(a.org)}</p>
        </div>
      </article>`).join('');
  }

  function renderEducation() {
    const el = $('#education');
    if (!el || typeof EDUCATION === 'undefined') return;
    // Skip the PhD (already shown as a highlighted card above)
    el.innerHTML = `<div class="card">
      <p class="eyebrow" style="margin-bottom:var(--s-3)">Education</p>
      ${EDUCATION.map(e => `
        <div class="edu-item">
          <div class="edu-top">
            <h4>${esc(e.degree)}</h4>
            <span class="edu-year">${esc(e.year)}</span>
          </div>
          <p class="edu-school">${esc(e.school)}</p>
          ${e.result ? `<span class="edu-result">${esc(e.result)}</span>` : ''}
        </div>`).join('')}
    </div>`;
  }

  function renderConferences() {
    const el = $('#confList');
    if (!el || typeof CONFERENCES === 'undefined') return;
    el.innerHTML = `<div class="card">${CONFERENCES.map(c => `
      <div class="conf-item">
        <div class="edu-top">
          <p class="conf-name">${esc(c.name)}</p>
          <span class="edu-year">${esc(c.year)}</span>
        </div>
        <p class="conf-host">${esc(c.host)}</p>
        ${c.talk ? `<p class="conf-talk">“${esc(c.talk)}”</p>` : ''}
      </div>`).join('')}</div>`;
  }


  /* ---------- 11. RENDER: contact ---------- */
  function renderContact() {
    const el = $('#contactLinks');
    if (!el || typeof SITE === 'undefined') return;

    const tiles = [
      { icon: 'mail', label: 'Email', value: SITE.email, href: 'mailto:' + SITE.email, ext: false },
      { icon: 'linkedin', label: 'LinkedIn', value: 'Connect', href: SITE.linkedin, ext: true },
      { icon: 'id', label: 'ORCID', value: SITE.orcid, href: SITE.orcidUrl, ext: true },
      { icon: 'cap', label: 'Google Scholar', value: 'Citations', href: SITE.scholar, ext: true }
    ];

    el.innerHTML = tiles.map(t => `
      <a class="link-tile" href="${esc(t.href)}"${t.ext ? ' target="_blank" rel="noopener noreferrer"' : ''}>
        ${icon(t.icon)}
        <span class="tile-txt">
          <small>${esc(t.label)}</small>
          ${esc(t.value)}
        </span>
      </a>`).join('');

    const cv = $('#cvLink');
    if (cv && SITE.cvPath) cv.setAttribute('href', SITE.cvPath);
  }


  /* ---------- 11b. RENDER: field gallery + lightbox ---------- */
  function renderGallery() {
    const el = $('#gallery');
    if (!el || typeof GALLERY === 'undefined') return;

    // No photos listed -> hide the whole section and its nav link,
    // so the page never shows an empty gap.
    if (!GALLERY.length) {
      const section = el.closest('section');
      if (section) section.hidden = true;
      const link = $('#navLinks a[href="#field"]');
      if (link) link.hidden = true;
      return;
    }

    el.innerHTML = GALLERY.map((g, i) => {
      // span: "wide" = two columns; shape: "tall" = portrait cell.
      const cls = [g.span === 'wide' ? 'wide' : '', g.shape === 'tall' ? 'tall' : '']
        .filter(Boolean).join(' ');
      // pos lets a photo nudge its crop, e.g. "center 30%"
      const pos = g.pos ? ` style="object-position:${esc(g.pos)}"` : '';
      return `
      <figure${cls ? ` class="${cls}"` : ''} data-i="${i}"
              tabindex="0" role="button"
              aria-label="Enlarge photo: ${esc(g.caption || g.alt)}">
        <img src="${esc(g.src)}" alt="${esc(g.alt)}" loading="lazy" decoding="async"${pos}>
        ${g.caption ? `<figcaption>${esc(g.caption)}</figcaption>` : ''}
      </figure>`;
    }).join('');

    initLightbox(el);
  }

  function initLightbox(gallery) {
    // Build the overlay once
    const box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Enlarged photo');
    box.innerHTML = `
      <button class="lightbox-close" type="button" aria-label="Close photo">
        <svg aria-hidden="true"><use href="#ic-close"></use></svg>
      </button>
      <div style="display:grid;place-items:center">
        <img alt="">
        <p class="lightbox-cap"></p>
      </div>`;
    document.body.appendChild(box);

    const img = $('img', box);
    const cap = $('.lightbox-cap', box);
    let lastFocus = null;

    function open(i) {
      const g = GALLERY[i];
      if (!g) return;
      img.src = g.src;
      img.alt = g.alt;
      cap.textContent = g.caption || '';
      lastFocus = document.activeElement;
      box.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      $('.lightbox-close', box).focus();
    }

    function close() {
      box.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    gallery.addEventListener('click', e => {
      const fig = e.target.closest('figure[data-i]');
      if (fig) open(parseInt(fig.dataset.i, 10));
    });
    gallery.addEventListener('keydown', e => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const fig = e.target.closest('figure[data-i]');
      if (fig) { e.preventDefault(); open(parseInt(fig.dataset.i, 10)); }
    });

    box.addEventListener('click', e => {
      // click the backdrop or the close button
      if (e.target === box || e.target.closest('.lightbox-close')) close();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && box.classList.contains('is-open')) close();
    });
  }


  /* ---------- 12. SCROLL REVEAL ---------- */
  function initReveal() {
    const items = $$('.reveal, .stagger');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(i => i.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    items.forEach(i => io.observe(i));
  }


  /* ---------- 13. ACTIVE SECTION IN NAV ---------- */
  function initActiveNav() {
    const sections = $$('main section[id]');
    const links = $$('#navLinks a[href^="#"]');
    if (!sections.length || !('IntersectionObserver' in window)) return;

    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const id = en.target.id;
        links.forEach(a =>
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(s => io.observe(s));
  }


  /* ---------- 14. PLANKTON CANVAS ---------- */
  function initPlankton() {
    const cv = $('#plankton');
    if (!cv || reduceMotion) return;

    const ctx = cv.getContext('2d', { alpha: true });
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1, parts = [], raf = null, visible = true;

    function resize() {
      const rect = cv.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height;
      cv.width  = Math.floor(w * dpr);
      cv.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      // scale count to viewport area, capped for performance
      const count = Math.min(Math.max(Math.round((w * h) / 22000), 26), 70);
      parts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.9 + 0.7,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.16 - 0.05,   // slight upward drift
        a: Math.random() * 0.45 + 0.18,
        ph: Math.random() * Math.PI * 2
      }));
    }

    function theme() {
      return root.getAttribute('data-theme') === 'light'
        ? { dot: '14,116,144', line: '14,116,144' }
        : { dot: '34,211,238', line: '45,212,191' };
    }

    let t = 0;
    function frame() {
      if (!visible) { raf = null; return; }
      t += 0.006;
      const c = theme();
      ctx.clearRect(0, 0, w, h);

      // connective lines (plankton network / neural net)
      for (let i = 0; i < parts.length; i++) {
        for (let j = i + 1; j < parts.length; j++) {
          const dx = parts[i].x - parts[j].x;
          const dy = parts[i].y - parts[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 16000) {
            const o = (1 - d2 / 16000) * 0.14;
            ctx.strokeStyle = `rgba(${c.line},${o})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(parts[i].x, parts[i].y);
            ctx.lineTo(parts[j].x, parts[j].y);
            ctx.stroke();
          }
        }
      }

      // drifting particles
      for (const p of parts) {
        p.x += p.vx + Math.sin(t + p.ph) * 0.12;
        p.y += p.vy;

        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        const pulse = 0.72 + Math.sin(t * 1.6 + p.ph) * 0.28;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c.dot},${p.a * pulse})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    }

    function start() { if (!raf) { visible = true; raf = requestAnimationFrame(frame); } }
    function stop()  { visible = false; if (raf) { cancelAnimationFrame(raf); raf = null; } }

    resize();
    start();

    let rt;
    window.addEventListener('resize', () => {
      clearTimeout(rt);
      rt = setTimeout(resize, 180);
    });

    // Pause when the hero scrolls out of view or the tab is hidden (perf)
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => {
        es[0].isIntersecting ? start() : stop();
      }, { threshold: 0 }).observe(cv);
    }
    document.addEventListener('visibilitychange', () => {
      document.hidden ? stop() : start();
    });
  }


  /* ---------- 15. BOOT ---------- */
  function boot() {
    renderMetrics();
    renderFocus();
    renderCruises();
    renderTimeline();
    renderExpertise();
    renderPubFilters();
    renderPubList();
    renderModels();
    renderGallery();
    renderAwards();
    renderEducation();
    renderConferences();
    renderContact();

    const y = $('#year');
    if (y) y.textContent = new Date().getFullYear();

    initReveal();
    initActiveNav();
    initPlankton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
