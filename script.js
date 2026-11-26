/* =====================================================================
   Aladin Ahmed — Engineering Portfolio
   script.js  ·  Interactive behaviour. No frameworks, no build step.

   You do NOT need to edit this file to change content — everything is
   read from index.html. Modules:
     Theme       light / dark toggle (remembers the visitor's choice)
     Nav         mobile menu, header shadow, active-section highlight
     Filters     project category filtering + counts
     Projects    project detail pop-up (and #p-… deep links)
     Lightbox    full-screen image viewer with keyboard support
     Models      on-demand 3D model viewer (<model-viewer>)
     Reveal      subtle scroll-in animations
     FileCheck   hides buttons for files you haven't uploaded yet
   ===================================================================== */

(function () {
  'use strict';

  /* Settings ---------------------------------------------------------- */
  var CONFIG = {
    // Google's <model-viewer> library (via the jsDelivr CDN). Only downloaded when a visitor clicks "View 3D model".
    modelViewerSrc: 'https://cdn.jsdelivr.net/npm/@google/model-viewer@4.0.0/dist/model-viewer.min.js'
  };

  var $  = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ */
  var Theme = {
    init: function () {
      var btn = $('.theme-toggle');
      if (!btn) return;
      btn.addEventListener('click', function () {
        var dark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (dark) document.documentElement.removeAttribute('data-theme');
        else document.documentElement.setAttribute('data-theme', 'dark');
        try { localStorage.setItem('theme', dark ? 'light' : 'dark'); } catch (e) {}
      });
    }
  };

  /* ------------------------------------------------------------------ */
  var Nav = {
    init: function () {
      var header = $('.site-header');
      var toggle = $('.nav-toggle');
      var menu = $('#nav-links');
      var links = $$('#nav-links a');

      // Mobile menu
      var setOpen = function (open) {
        menu.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        toggle.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
      };
      toggle.addEventListener('click', function () { setOpen(!menu.classList.contains('is-open')); });
      links.forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('is-open')) { setOpen(false); toggle.focus(); } });
      document.addEventListener('click', function (e) {
        if (menu.classList.contains('is-open') && !menu.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
      });

      // Header border once scrolled
      var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();

      // Active section highlighting
      var sections = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); }).filter(Boolean);
      var setActive = function (id) {
        links.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + id;
          a.classList.toggle('is-active', on);
          if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      };
      var update = function () {
        var y = window.scrollY + window.innerHeight * 0.3;
        var current = sections[0] && sections[0].id;
        sections.forEach(function (s) { if (s.offsetTop <= y) current = s.id; });
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) current = sections[sections.length - 1].id;
        setActive(current);
      };
      var ticking = false;
      window.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; requestAnimationFrame(function () { update(); ticking = false; }); }
      }, { passive: true });
      window.addEventListener('resize', update);
      update();
    }
  };

  /* ------------------------------------------------------------------ */
  var Filters = {
    init: function () {
      var buttons = $$('.filter-btn');
      var cards = $$('.project-card');
      var empty = $('#no-results');
      if (!buttons.length) return;

      var catsOf = function (card) { return (card.getAttribute('data-category') || '').split(/\s+/); };

      // Counts on each button; hide categories with no projects
      buttons.forEach(function (btn) {
        var f = btn.getAttribute('data-filter');
        var n = f === 'all' ? cards.length : cards.filter(function (c) { return catsOf(c).indexOf(f) !== -1; }).length;
        var count = btn.querySelector('.count');
        if (count) count.textContent = n;
        if (n === 0 && f !== 'all') btn.hidden = true;
      });

      var apply = function (f) {
        var shown = 0;
        buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === f)); });
        cards.forEach(function (card) {
          var match = f === 'all' || catsOf(card).indexOf(f) !== -1;
          card.hidden = !match;
          if (match) {
            shown++;
            card.classList.add('is-visible');           // skip scroll-reveal for filtered cards
            if (!reducedMotion) { card.classList.remove('is-entering'); void card.offsetWidth; card.classList.add('is-entering'); }
          }
        });
        if (empty) empty.hidden = shown !== 0;
      };

      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () { apply(btn.getAttribute('data-filter')); });
      });
    }
  };

  /* ------------------------------------------------------------------ */
  var Projects = {
    modal: null,
    lastFocus: null,

    init: function () {
      var self = this;
      this.modal = $('#project-modal');
      if (!this.modal || typeof this.modal.showModal !== 'function') return;

      $$('.project-card').forEach(function (card) {
        var btn = card.querySelector('.project-open');
        if (btn) btn.addEventListener('click', function () { self.open(card); });
      });

      $('[data-close]', this.modal).addEventListener('click', function () { self.modal.close(); });
      // Click on the dark backdrop closes the dialog
      this.modal.addEventListener('click', function (e) { if (e.target === self.modal) self.modal.close(); });
      this.modal.addEventListener('close', function () {
        $('#modal-body').innerHTML = '';             // stops any playing video
        if (/^#p-/.test(location.hash)) history.replaceState(null, '', '#projects');
        if (self.lastFocus) self.lastFocus.focus({ preventScroll: true });
      });

      // Deep link: https://…/#p-gripper opens that project directly
      var fromHash = function () {
        var id = location.hash.slice(1);
        if (/^p-/.test(id)) { var card = document.getElementById(id); if (card) self.open(card, true); }
      };
      window.addEventListener('hashchange', fromHash);
      fromHash();
    },

    open: function (card, fromHash) {
      var details = card.querySelector('.project-details');
      this.lastFocus = card.querySelector('.project-open');

      $('#modal-title').textContent = card.querySelector('h3').textContent;
      var meta = $('#modal-meta');
      meta.innerHTML = '';
      var badge = card.querySelector('.project-thumb .badge');
      var cat = card.querySelector('.project-cat');
      if (badge) meta.appendChild(badge.cloneNode(true));
      if (cat) meta.appendChild(cat.cloneNode(true));

      var body = $('#modal-body');
      body.innerHTML = '';
      var summary = card.querySelector('.project-summary');
      if (summary) { var p = summary.cloneNode(true); p.style.fontSize = '1.02rem'; body.appendChild(p); }
      if (details) {
        Array.prototype.forEach.call(details.children, function (el) { body.appendChild(el.cloneNode(true)); });
      }

      Models.bind(body);
      FileCheck.run(body);

      if (!fromHash && card.id) history.replaceState(null, '', '#' + card.id);
      if (!this.modal.open) this.modal.showModal();
      this.modal.scrollTop = 0;
      $('[data-close]', this.modal).focus();
    }
  };

  /* ------------------------------------------------------------------ */
  var Lightbox = {
    box: null, items: [], index: 0,

    init: function () {
      var self = this;
      this.box = $('#lightbox');
      if (!this.box || typeof this.box.showModal !== 'function') return;
      $('[data-close]', this.box).addEventListener('click', function () { self.box.close(); });
      $('.lb-prev', this.box).addEventListener('click', function () { self.go(-1); });
      $('.lb-next', this.box).addEventListener('click', function () { self.go(1); });
      this.box.addEventListener('click', function (e) { if (e.target === self.box || e.target.classList.contains('lb-stage')) self.box.close(); });
      this.box.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') self.go(-1);
        if (e.key === 'ArrowRight') self.go(1);
      });
      // Any <a data-lightbox href="big.jpg"><img alt="…"></a> opens full-screen (works inside the
      // project pop-up too). Images in the same .gallery are grouped so you can arrow through them.
      document.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('a[data-lightbox]');
        if (!a || a.closest('.project-details')) return;
        e.preventDefault();
        var group = a.closest('.gallery') || a.parentNode;
        self.items = $$('a[data-lightbox]', group);
        self.index = self.items.indexOf(a);
        self.show();
        if (!self.box.open) self.box.showModal();
      });
    },

    show: function () {
      var a = this.items[this.index];
      var img = a.querySelector('img');
      var cap = a.closest('figure') && a.closest('figure').querySelector('figcaption');
      $('#lb-img').src = a.getAttribute('href');
      $('#lb-img').alt = img ? img.alt : '';
      $('#lb-caption').textContent = cap ? cap.textContent : (img ? img.alt : '');
      $('#lb-count').textContent = (this.index + 1) + ' / ' + this.items.length;
      var multi = this.items.length > 1;
      $('.lb-prev', this.box).hidden = !multi;
      $('.lb-next', this.box).hidden = !multi;
    },

    go: function (step) {
      if (this.items.length < 2) return;
      this.index = (this.index + step + this.items.length) % this.items.length;
      this.show();
    }
  };

  /* ------------------------------------------------------------------ */
  var Models = {
    loading: null,

    loadLibrary: function () {
      if (window.customElements && customElements.get('model-viewer')) return Promise.resolve();
      if (this.loading) return this.loading;
      this.loading = new Promise(function (resolve, reject) {
        var s = document.createElement('script');
        s.type = 'module';
        s.src = CONFIG.modelViewerSrc;
        s.onload = function () { customElements.whenDefined('model-viewer').then(resolve); };
        s.onerror = reject;
        document.head.appendChild(s);
      });
      return this.loading;
    },

    // <div class="model-slot" data-model="assets/x.glb" data-poster="assets/x.jpg"><button>…</button></div>
    bind: function (root) {
      var self = this;
      $$('.model-slot', root).forEach(function (slot) {
        var poster = slot.getAttribute('data-poster');
        if (poster && !slot.querySelector('img')) {
          var img = document.createElement('img'); img.src = poster; img.alt = ''; img.loading = 'lazy';
          slot.insertBefore(img, slot.firstChild);
        }
        var btn = slot.querySelector('button');
        if (!btn) return;
        btn.addEventListener('click', function () { self.activate(slot, btn); });
      });
    },

    activate: function (slot, btn) {
      var src = slot.getAttribute('data-model');
      var msg = function (text) {
        var m = slot.querySelector('.model-msg') || document.createElement('p');
        m.className = 'model-msg'; m.textContent = text;
        if (!m.parentNode) slot.appendChild(m);
      };
      btn.disabled = true;
      btn.lastChild.textContent = ' Loading 3D model…';

      FileCheck.exists(src).then(function (ok) {
        if (!ok) { btn.remove(); msg('3D model coming soon.'); return; }
        return Models.loadLibrary().then(function () {
          var mv = document.createElement('model-viewer');
          mv.setAttribute('src', src);
          mv.setAttribute('alt', 'Interactive 3D model — drag to rotate, scroll to zoom');
          mv.setAttribute('camera-controls', '');
          mv.setAttribute('touch-action', 'pan-y');
          mv.setAttribute('shadow-intensity', '1');
          mv.setAttribute('shadow-softness', '0.8');
          mv.setAttribute('exposure', '0.85');
          mv.setAttribute('tone-mapping', 'neutral');
          if (!reducedMotion) mv.setAttribute('auto-rotate', '');
          slot.innerHTML = '';
          slot.appendChild(mv);
        });
      }).catch(function () { btn.remove(); msg('The 3D viewer could not be loaded. Please check your connection.'); });
    }
  };

  /* ------------------------------------------------------------------ */
  var Reveal = {
    init: function () {
      var els = $$('.reveal');
      if (reducedMotion || !('IntersectionObserver' in window)) {
        els.forEach(function (el) { el.classList.add('is-visible'); });
        return;
      }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
      els.forEach(function (el) { io.observe(el); });
    }
  };

  /* ------------------------------------------------------------------ */
  // Links marked data-requires-file are hidden if the file isn't on the
  // server yet (e.g. a CV you haven't uploaded). No broken links for visitors.
  var FileCheck = {
    cache: {},
    exists: function (url) {
      if (!url) return Promise.resolve(false);
      if (location.protocol === 'file:') return Promise.resolve(true);   // can't check when opened locally
      if (this.cache[url] === undefined) {
        this.cache[url] = fetch(url, { method: 'HEAD', cache: 'no-store' })
          .then(function (r) { return r.ok; })
          .catch(function () { return true; });                           // network hiccup: don't hide
      }
      return this.cache[url];
    },
    run: function (root) {
      var self = this;
      $$('[data-requires-file]', root).forEach(function (el) {
        self.exists(el.getAttribute('href')).then(function (ok) { el.classList.toggle('is-missing', !ok); });
      });
    }
  };

  /* ------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', function () {
    var year = $('#year'); if (year) year.textContent = new Date().getFullYear();
    Theme.init();
    Nav.init();
    Filters.init();
    Lightbox.init();
    Projects.init();
    Reveal.init();
    FileCheck.run(document);
  });
})();
