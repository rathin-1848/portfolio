/* Shared behaviour: nav, starfield, reveal, scroll effects */
(function () {
  var doc = document;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;

  /* ---- mobile nav ---- */
  var burger = doc.getElementById('hamburger');
  var links = doc.getElementById('navLinks');
  if (burger && links) {
    burger.addEventListener('click', function () {
      var on = links.classList.toggle('active');
      burger.classList.toggle('active', on);
      burger.setAttribute('aria-expanded', String(on));
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('active');
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- scroll progress ---- */
  var bar = doc.querySelector('.progress');
  function onScroll() {
    var h = doc.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
    scrubWords();
    timeline();
  }

  /* ---- reveal on scroll ---- */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  window.observeReveal = function (root) {
    (root || doc).querySelectorAll('.reveal:not(.is-visible)').forEach(function (el) { io.observe(el); });
  };
  window.observeReveal();

  /* ---- active nav link ---- */
  var sections = doc.querySelectorAll('main section[id], section[id]');
  var anchors = doc.querySelectorAll('.nav-links a[href^="#"]');
  if (sections.length && anchors.length) {
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          anchors.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { so.observe(s); });
  }

  /* ---- hero headline: split into letters ---- */
  var h1 = doc.querySelector('.hero h1[data-split]');
  if (h1) {
    var i = 0;
    var lines = h1.dataset.split.split('|');
    h1.setAttribute('aria-label', lines.join(' '));
    h1.innerHTML = lines.map(function (t) {
      return '<span class="line" aria-hidden="true">' + t.split('').map(function (c) {
        return '<span class="ch" style="--i:' + (i++) + '">' + (c === ' ' ? '&nbsp;' : c) + '</span>';
      }).join('') + '</span>';
    }).join('');
  }

  /* ---- scroll-scrubbed statement ---- */
  var st = doc.querySelector('.statement');
  var words = [];
  if (st) {
    st.setAttribute('aria-label', st.textContent.trim());
    st.innerHTML = st.textContent.trim().split(/\s+/).map(function (w) {
      return '<span class="w" aria-hidden="true">' + w + '</span>';
    }).join(' ');
    words = st.querySelectorAll('.w');
  }
  function scrubWords() {
    if (!words.length) return;
    var r = st.getBoundingClientRect();
    var p = (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.3);
    p = Math.max(0, Math.min(1, p));
    var n = Math.round(p * words.length);
    words.forEach(function (w, k) { w.classList.toggle('lit', k < n); });
  }

  /* ---- timeline fill ---- */
  var tl = doc.querySelector('.timeline');
  function timeline() {
    if (!tl) return;
    var r = tl.getBoundingClientRect();
    var mid = innerHeight * 0.6;
    var p = Math.max(0, Math.min(1, (mid - r.top) / r.height));
    tl.style.setProperty('--fill', (p * 100) + '%');
    tl.querySelectorAll('.tl-item').forEach(function (it) {
      var b = it.getBoundingClientRect();
      it.classList.toggle('on', b.top < mid);
    });
  }

  /* ---- pointer: spotlight, hero parallax, card glow, tilt ---- */
  var spot = doc.querySelector('.spotlight');
  var orbit = doc.querySelector('.orbit');
  if (fine && !reduce) {
    addEventListener('pointermove', function (e) {
      if (spot) { spot.style.setProperty('--mx', e.clientX + 'px'); spot.style.setProperty('--my', e.clientY + 'px'); }
      if (orbit) {
        orbit.style.setProperty('--px', (e.clientX / innerWidth - 0.5).toFixed(3));
        orbit.style.setProperty('--py', (e.clientY / innerHeight - 0.5).toFixed(3));
      }
      mouse.x = e.clientX; mouse.y = e.clientY;
    }, { passive: true });

    doc.addEventListener('pointermove', function (e) {
      var sk = e.target.closest && e.target.closest('.skill-card');
      if (sk) {
        var r = sk.getBoundingClientRect();
        sk.style.setProperty('--cx', (e.clientX - r.left) + 'px');
        sk.style.setProperty('--cy', (e.clientY - r.top) + 'px');
      }
      var card = e.target.closest && e.target.closest('.project-card');
      if (card) {
        var b = card.getBoundingClientRect();
        var x = (e.clientX - b.left) / b.width - 0.5;
        var y = (e.clientY - b.top) / b.height - 0.5;
        card.style.setProperty('--bx',(e.clientX - b.left) + 'px');card.style.setProperty('--by',(e.clientY - b.top) + 'px');
        card.style.transform = 'rotateY(' + (x * 7).toFixed(2) + 'deg) rotateX(' + (-y * 7).toFixed(2) + 'deg) translateY(-6px)';
      }
    });
    doc.addEventListener('pointerout', function (e) {
      var card = e.target.closest && e.target.closest('.project-card');
      if (card && !card.contains(e.relatedTarget)) card.style.transform = '';
    });
  }

  /* ---- starfield ---- */
  var mouse = { x: -999, y: -999 };
  var cv = doc.getElementById('stars');
  if (cv && !reduce) {
    var ctx = cv.getContext('2d');
    var stars = [], W, H, dpr = Math.min(devicePixelRatio || 1, 2);
    function size() {
      W = cv.width = innerWidth * dpr; H = cv.height = innerHeight * dpr;
      var n = Math.min(140, Math.round(innerWidth * innerHeight / 11000));
      stars = [];
      for (var k = 0; k < n; k++) {
        stars.push({
          x: Math.random() * W, y: Math.random() * H,
          r: (Math.random() * 1.3 + 0.3) * dpr,
          s: Math.random() * 0.12 + 0.02,
          t: Math.random() * 6.28,
          gold: Math.random() < 0.14
        });
      }
    }
    size(); addEventListener('resize', size);
    var running = true;
    doc.addEventListener('visibilitychange', function () { running = !doc.hidden; if (running) frame(); });
    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      for (var k = 0; k < stars.length; k++) {
        var s = stars[k];
        var bo = window.poBoost || 0;
        s.t += 0.02; s.y -= (s.s + bo * 0.45) * dpr; if (s.y < -5) { s.y = H + 5; s.x = Math.random() * W; } else if (s.y > H + 5) { s.y = -5; s.x = Math.random() * W; }
        var dx = s.x - mouse.x * dpr, dy = s.y - mouse.y * dpr, d = Math.sqrt(dx * dx + dy * dy);
        var push = d < 140 * dpr ? (1 - d / (140 * dpr)) * 14 * dpr : 0;
        var x = s.x + (d ? dx / d * push : 0), y = s.y + (d ? dy / d * push : 0);
        ctx.globalAlpha = 0.25 + 0.55 * Math.abs(Math.sin(s.t));
        ctx.fillStyle = s.gold ? '#E2B93B' : '#ECE8DC';
        ctx.beginPath(); ctx.arc(x, y, s.r, 0, 6.283); ctx.fill();
        if (Math.abs(bo) > 2) { ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = s.r; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + bo * 2.4 * dpr); ctx.stroke(); }
      }
      requestAnimationFrame(frame);
    }
    frame();
  }

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();
})();
