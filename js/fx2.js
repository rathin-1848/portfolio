/* Round 3: page wipe, hero letters, aurora, side dots, bands, vision reveal, scramble, click bursts */
(function () {
  var doc = document, root = doc.documentElement, body = doc.body;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(pointer: fine)').matches;
  var inner = root.classList.contains('inner');

  /* detail page art takes the project's colour */
  var da = doc.querySelector('.detail-art');
  if (da && window.PO_HUE) da.style.setProperty('--hue', PO_HUE[da.dataset.art] || 'var(--gold)');

  if (reduce) { root.classList.add('revealed'); return; }

  /* ---------- aurora ---------- */
  var au = doc.createElement('div');
  au.className = 'aurora'; au.setAttribute('aria-hidden', 'true');
  au.innerHTML = '<i></i><i></i><i></i>';
  body.insertBefore(au, body.firstChild);

  /* ---------- page wipe ---------- */
  function mkWipe() {
    var w = doc.createElement('div');
    w.className = 'wipe'; w.setAttribute('aria-hidden', 'true');
    w.innerHTML = '<i></i><i></i>';
    body.appendChild(w);
    return w;
  }
  function headWords() {
    doc.querySelectorAll('.page-hero h1,.detail-heading h1').forEach(function (h) {
      var t = h.textContent.trim();
      h.setAttribute('aria-label', t);
      h.innerHTML = t.split(/\s+/).map(function (w, i) {
        return '<span class="hw" aria-hidden="true"><span style="--i:' + i + '">' + w + '</span></span>';
      }).join(' ');
      setTimeout(function () { h.classList.add('is-visible'); }, 700);
    });
  }
  if (inner) {
    headWords();
    var w0 = mkWipe();
    w0.classList.add('arrive');
    root.classList.add('revealed');
    void w0.offsetHeight;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        w0.classList.remove('arrive'); w0.classList.add('go');
        setTimeout(function () { w0.remove(); }, 1300);
      });
    });
  } else root.classList.add('revealed');

  doc.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if ((a.target && a.target !== '_self') || a.hasAttribute('download')) return;
    if (!/^(https?|file):$/.test(a.protocol)) return;
    if (a.host !== location.host || a.protocol !== location.protocol) return;
    if (a.pathname === location.pathname) return;
    e.preventDefault();
    var w = mkWipe(); void w.offsetHeight; w.classList.add('cover');
    setTimeout(function () { location.href = a.href; }, 900);
  });
  addEventListener('pageshow', function (e) {
    if (e.persisted) doc.querySelectorAll('.wipe').forEach(function (n) { n.remove(); });
  });

  /* ---------- hero letters react to the cursor ---------- */
  var h1 = doc.querySelector('.hero h1');
  var letters = [].slice.call(doc.querySelectorAll('.hero h1 .ch'));
  if (h1 && letters.length && fine) {
    var tid = setInterval(function () {
      if (!root.classList.contains('loaded')) return;
      clearInterval(tid);
      setTimeout(function () {
        h1.classList.add('live');
        addEventListener('pointermove', function (e) {
          if (scrollY > innerHeight * 0.8) return;
          letters.forEach(function (l) {
            var r = l.getBoundingClientRect();
            var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
            var k = Math.max(0, 1 - Math.hypot(dx, dy) / 170);
            l.style.setProperty('--k', k.toFixed(2));
            l.style.translate = '0 ' + (-k * 16).toFixed(1) + 'px';
            l.style.rotate = (-dx / 170 * k * 9).toFixed(1) + 'deg';
            l.style.scale = (1 + k * 0.1).toFixed(3);
          });
        }, { passive: true });
      }, 2600);
    }, 100);
  }

  /* ---------- side dots ---------- */
  var dots = null;
  if (doc.getElementById('home')) {
    var items = [['home', 'Home'], ['about', 'About'], ['skills', 'Skills'], ['projects', 'Projects'], ['paradox-orbit', 'Paradox Orbit'], ['goal', 'Goal'], ['vision', 'Vision'], ['contact', 'Contact']];
    dots = doc.createElement('nav');
    dots.className = 'dots'; dots.setAttribute('aria-label', 'Sections');
    dots.innerHTML = items.map(function (it) { return '<a href="#' + it[0] + '" aria-label="' + it[1] + '"><span>' + it[1] + '</span></a>'; }).join('');
    body.appendChild(dots);
  }

  /* ---------- scroll-linked: bands, vision dome, dots ---------- */
  var b1 = doc.getElementById('band1'), b2 = doc.getElementById('band2'), bands = doc.querySelector('.bands');
  var vis = doc.getElementById('vision');
  var ticking = false;
  function scrollFx() {
    ticking = false;
    if (bands) {
      var r = bands.getBoundingClientRect();
      var p = Math.max(0, Math.min(1, (innerHeight - r.top) / (innerHeight + r.height)));
      var tr = innerWidth * 1.1;
      b1.style.transform = 'translate3d(' + (-p * tr).toFixed(1) + 'px,0,0)';
      b2.style.transform = 'translate3d(' + (-tr + p * tr).toFixed(1) + 'px,0,0)';
    }
    if (vis) {
      var v = vis.getBoundingClientRect();
      var q = Math.max(0, Math.min(1, (innerHeight - v.top) / (innerHeight * 0.9)));
      vis.style.clipPath = q >= 1 ? 'none' : 'circle(' + (q * 104).toFixed(1) + '% at 50% 0%)';
    }
    if (dots) {
      var cur = 0, ids = [].slice.call(dots.children);
      ids.forEach(function (a, i) {
        var el = doc.getElementById(a.getAttribute('href').slice(1));
        if (el && el.getBoundingClientRect().top <= innerHeight * 0.5) cur = i;
      });
      ids.forEach(function (a, i) { a.classList.toggle('on', i === cur); });
      dots.classList.toggle('on-paper', ids[cur].getAttribute('href') === '#vision' && vis && vis.getBoundingClientRect().bottom > innerHeight * 0.5);
    }
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(scrollFx); } }
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  scrollFx();

  /* ---------- nav link text scramble ---------- */
  var chars = '01{}<>/*+#';
  function scramble(el) {
    if (el._sc) return;
    el._sc = true;
    var orig = el.textContent, n = orig.length, f = 0, total = 14;
    el.style.minWidth = el.getBoundingClientRect().width + 'px';
    el.style.textAlign = 'center';
    var iv = setInterval(function () {
      var out = '';
      for (var i = 0; i < n; i++) {
        out += (orig[i] === ' ' || i < (f / total) * n) ? orig[i] : chars[Math.floor(Math.random() * chars.length)];
      }
      el.textContent = out;
      if (++f > total) { clearInterval(iv); el.textContent = orig; el.style.minWidth = ''; el.style.textAlign = ''; el._sc = false; }
    }, 28);
  }
  doc.querySelectorAll('.nav-link,.footer-links a').forEach(function (a) {
    a.addEventListener('mouseenter', function () { scramble(a); });
  });

  /* ---------- sparkle trail + click burst ---------- */
  if (fine) {
    var cv = doc.createElement('canvas');
    cv.id = 'fxc'; cv.setAttribute('aria-hidden', 'true');
    body.appendChild(cv);
    var ctx = cv.getContext('2d'), dpr = Math.min(devicePixelRatio || 1, 2), parts = [], run = false, lx = -99, ly = -99;
    function size() { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    size(); addEventListener('resize', size);
    var cols = ['#E2B93B', '#F6DE95', '#7B72FF', '#3FD0B5'];
    function add(x, y, vx, vy, life, s, c) { parts.push({ x: x, y: y, vx: vx, vy: vy, l: life, m: life, s: s, c: c }); if (!run) { run = true; requestAnimationFrame(loop); } }
    function loop() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (var i = parts.length - 1; i >= 0; i--) {
        var p = parts[i];
        p.x += p.vx; p.y += p.vy; p.vx *= 0.96; p.vy *= 0.96; p.l -= 1;
        if (p.l <= 0) { parts.splice(i, 1); continue; }
        ctx.globalAlpha = p.l / p.m; ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.s * (0.4 + 0.6 * p.l / p.m), 0, 6.283); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (parts.length) requestAnimationFrame(loop); else run = false;
    }
    addEventListener('pointermove', function (e) {
      if (Math.hypot(e.clientX - lx, e.clientY - ly) < 14) return;
      lx = e.clientX; ly = e.clientY;
      add(lx, ly, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8 + 0.3, 38, 2.2, cols[Math.random() < 0.7 ? 0 : 1]);
    }, { passive: true });
    addEventListener('pointerdown', function (e) {
      for (var i = 0; i < 22; i++) {
        var a = Math.random() * 6.283, s = 1.6 + Math.random() * 4.4;
        add(e.clientX, e.clientY, Math.cos(a) * s, Math.sin(a) * s, 46 + Math.random() * 24, 2 + Math.random() * 2.6, cols[i % 4]);
      }
    });
  }
})();
