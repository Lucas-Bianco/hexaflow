/* HexaFlow, direction B. Two scroll moments only:
   1) Home: leader lines draw in, one by one, while a sticky section scrolls.
   2) Drop Testing: sticky measurement view scrubs 18 real frames against a 2.2 s ruler. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  // progress 0..1 through a tall section that holds a sticky stage
  function progress(section) {
    var r = section.getBoundingClientRect();
    var span = r.height - window.innerHeight;
    return span > 0 ? clamp(-r.top / span, 0, 1) : 0;
  }

  function onScroll(fn) {
    var ticking = false;
    function run() { ticking = false; fn(); }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(run); }
    }, { passive: true });
    window.addEventListener('resize', run);
    fn();
  }

  /* ---------- 1. leader-line callouts ---------- */
  var cs = document.querySelector('[data-callouts]');
  if (cs) {
    var groups = [].slice.call(cs.querySelectorAll('[data-callout]'));
    var items = [].slice.call(cs.querySelectorAll('[data-list] li'));
    var n = groups.length;
    var START = 0.06, END = 0.92, seg = (END - START) / n;
    onScroll(function () {
      var p = reduce ? 1 : progress(cs);
      groups.forEach(function (g, i) {
        var a = START + i * seg;
        var local = clamp((p - a) / (seg * 0.85), 0, 1);
        var leader = g.querySelector('.leader');
        var tip = g.querySelector('.tip');
        var tag = g.querySelector('.tag');
        leader.style.strokeDashoffset = String(1 - local);
        var on = local > 0.02, done = local > 0.98;
        tip.classList.toggle('on', on);
        tag.classList.toggle('on', done);
        if (items[i]) items[i].classList.toggle('on', done);
      });
    });
  }

  /* ---------- 2. drop-tower frame scrub ---------- */
  var ds = document.querySelector('[data-drop]');
  if (ds) {
    var FRAMES = 18, WINDOW_S = 2.2;
    var runs = {
      drop:  { label: 'Drop 1', cap: 'Drop 1 (best)', text: 'First drop produced the best capillary dispersal.', dir: '../assets/drop/' },
      drop2: { label: 'Drop 3', cap: 'Drop 3 (double water)', text: 'Water was left in the system because the code could not be changed; leaving water in was the only way to get more water into the system for the final drop.', dir: '../assets/drop2/' }
    };
    var cur = 'drop', lastIdx = -1;
    var img = ds.querySelector('[data-frame]');
    var tagRun = ds.querySelector('[data-tag-run]');
    var tagFrame = ds.querySelector('[data-tag-frame]');
    var roRun = ds.querySelector('[data-ro-run]');
    var roFrame = ds.querySelector('[data-ro-frame]');
    var roT = ds.querySelector('[data-ro-t]');
    var capLab = ds.querySelector('[data-cap-lab]');
    var capText = ds.querySelector('[data-cap-text]');
    var marker = ds.querySelector('[data-marker]');
    var markerT = ds.querySelector('[data-marker-t]');
    var ruler = ds.querySelector('[data-ruler]');
    var stops = ds.querySelector('[data-stops]');
    var btns = [].slice.call(ds.querySelectorAll('[data-run]'));
    var pad = function (v) { return (v < 10 ? '0' : '') + v; };
    var src = function (run, i) { return runs[run].dir + 'f-' + pad(i + 1) + '.jpg'; };

    // build ruler: ticks every 0.1 s (labels every 0.2 s), plus 18 frame stops
    for (var k = 0; k <= 22; k++) {
      var pct = (k / 22) * 100;
      var t = document.createElement('div');
      t.className = 'tick' + (k % 2 ? ' minor' : '');
      t.style.top = pct + '%';
      ruler.appendChild(t);
      if (k % 2 === 0) {
        var l = document.createElement('div');
        l.className = 'tick-l';
        l.style.top = pct + '%';
        l.textContent = (k / 10).toFixed(1);
        ruler.appendChild(l);
      }
    }
    for (var f = 0; f < FRAMES; f++) {
      var s = document.createElement('div');
      s.className = 'stop';
      s.style.top = (f / (FRAMES - 1)) * 100 + '%';
      stops.appendChild(s);
    }
    var unit = document.createElement('div');
    unit.className = 'tick-l';
    unit.style.top = '-18px';
    unit.textContent = 't / s';
    ruler.appendChild(unit);

    // preload all frames of both runs
    ['drop', 'drop2'].forEach(function (r) {
      for (var i = 0; i < FRAMES; i++) { var im = new Image(); im.src = src(r, i); }
    });

    function render(force) {
      var p = reduce ? 0 : progress(ds);
      var idx = clamp(Math.floor(p * FRAMES), 0, FRAMES - 1);
      var frac = idx / (FRAMES - 1);
      var tt = (frac * WINDOW_S).toFixed(2) + ' s';
      marker.style.top = frac * 100 + '%';
      markerT.textContent = tt;
      if (idx === lastIdx && !force) return;
      lastIdx = idx;
      img.src = src(cur, idx);
      img.alt = 'Drop tower frame ' + (idx + 1) + ' of ' + FRAMES + ', ' + runs[cur].label;
      tagFrame.textContent = 'F ' + pad(idx + 1) + ' / ' + FRAMES;
      roFrame.textContent = pad(idx + 1) + ' / ' + FRAMES;
      roT.textContent = tt;
    }
    function setRun(r) {
      cur = r;
      btns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-run') === r)); });
      tagRun.textContent = runs[r].label.toUpperCase();
      roRun.textContent = runs[r].label;
      capLab.textContent = runs[r].cap;
      capText.textContent = runs[r].text;
      render(true);
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { setRun(b.getAttribute('data-run')); }); });
    onScroll(function () { render(false); });
  }
})();
