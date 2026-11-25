/* HexaFlow, direction D "journal". Vanilla JS, no libraries.
   Modules: masthead, reveal (highlighter + photo develop), hand-drawn marks, counters,
   capillary figure (Home), chapter story + margin trail (Journey), frame scrub + ruler,
   capillary rise, ladder rail (Drop Testing). Everything finishes instantly under
   prefers-reduced-motion. */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var NS = "http://www.w3.org/2000/svg";
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var qs = function (s, r) { return (r || document).querySelector(s); };
  var qsa = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var rem = function () { return parseFloat(getComputedStyle(document.documentElement).fontSize) || 16; };
  var mast = qs(".mast");

  function mk(tag, attrs, parent) {
    var el = document.createElementNS(NS, tag);
    for (var a in attrs) el.setAttribute(a, attrs[a]);
    if (parent) parent.appendChild(el);
    return el;
  }
  function seeded(seed) {
    var s = (seed % 2147483646) + 1;
    return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  }
  function onFrame(fn) {
    var ticking = false;
    return function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; fn(); });
    };
  }

  /* ---------------------------------------------------------------- masthead + menu */
  if (mast) {
    var solid = function () { mast.classList.toggle("is-solid", window.scrollY > 40); };
    window.addEventListener("scroll", solid, { passive: true });
    solid();
  }
  var pages = qs(".pages");
  if (pages) {
    document.addEventListener("click", function (e) { if (pages.open && !pages.contains(e.target)) pages.open = false; });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") pages.open = false; });
  }

  /* ---------------------------------------------------------------- reveal: highlighter + photo develop */
  var revealEls = qsa(".hl, .dev");
  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); revealIO.unobserve(en.target); }
      });
    }, { threshold: 0.35, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { revealIO.observe(el); });
  }

  /* ---------------------------------------------------------------- hand-drawn marks */
  function circlePath(cx, cy, rx, ry, rand) {
    var n = 70, a0 = -Math.PI * 0.8 + rand() * 0.7, turn = Math.PI * 2 * 1.13;
    var p1 = rand() * 6, p2 = rand() * 6, d = "";
    for (var i = 0; i <= n; i++) {
      var t = i / n, th = a0 + turn * t;
      var r = 1 + 0.035 * Math.sin(2 * th + p1) + 0.025 * Math.sin(3 * th + p2) + 0.08 * t;
      d += (i ? "L" : "M") + (cx + rx * r * Math.cos(th)).toFixed(1) + " " + (cy + ry * r * Math.sin(th)).toFixed(1) + " ";
    }
    return d;
  }
  function underlinePath(x1, x2, y, rand) {
    var len = Math.abs(x2 - x1), steps = Math.max(8, Math.round(len / 9)), ph = rand() * 6, d = "";
    var tilt = (rand() - 0.5) * 3;
    for (var i = 0; i <= steps; i++) {
      var t = i / steps;
      d += (i ? "L" : "M") + (x1 + (x2 - x1) * t).toFixed(1) + " " + (y + tilt * t + 1.5 * Math.sin(i * 0.9 + ph)).toFixed(1) + " ";
    }
    var back = x2 - (x2 - x1) * 0.55;
    d += "L" + (x2 - (x2 - x1) * 0.04).toFixed(1) + " " + (y + 5 + tilt).toFixed(1) + " L" + back.toFixed(1) + " " + (y + 4 + tilt * 0.6).toFixed(1);
    return d;
  }
  function arrowParts(x1, y1, x2, y2, bend, rand) {
    var dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy) || 1;
    var cx = (x1 + x2) / 2 - (dy / len) * bend * len, cy = (y1 + y2) / 2 + (dx / len) * bend * len;
    var d = "", n = 30, px = x2, py = y2, tx = 0, ty = 0;
    for (var i = 0; i <= n; i++) {
      var t = i / n, u = 1 - t;
      var x = u * u * x1 + 2 * u * t * cx + t * t * x2 + (rand() - 0.5) * 0.9;
      var y = u * u * y1 + 2 * u * t * cy + t * t * y2 + (rand() - 0.5) * 0.9;
      d += (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1) + " ";
    }
    tx = x2 - cx; ty = y2 - cy;
    var ang = Math.atan2(ty, tx), hl = 15, a1 = ang + Math.PI - 0.5, a2 = ang + Math.PI + 0.5;
    var head = "M" + (px + hl * Math.cos(a1)).toFixed(1) + " " + (py + hl * Math.sin(a1)).toFixed(1) +
      " L" + px.toFixed(1) + " " + py.toFixed(1) + " L" + (px + hl * Math.cos(a2)).toFixed(1) + " " + (py + hl * Math.sin(a2)).toFixed(1);
    return [d, head];
  }

  function buildMarks(host) {
    var spec;
    try { spec = JSON.parse(host.getAttribute("data-marks")); } catch (e) { return; }
    var W = host.clientWidth, H = host.clientHeight;
    if (!W || !H) return;
    var old = qs(":scope > svg.marks", host);
    if (old) old.remove();
    var photo = host.hasAttribute("data-photo");
    var svg = mk("svg", { "class": "marks" + (photo ? " on-photo" : ""), viewBox: "0 0 " + W + " " + H, "aria-hidden": "true", focusable: "false" });
    host.appendChild(svg);
    var rand = seeded(parseInt(host.getAttribute("data-seed") || "7", 10));
    var fs = Math.max(19, Math.min(30, W / 18));
    var drawn = !!host._drawn || reduce;
    var parts = [], labels = [], clock = 0;
    var X = function (v) { return v / 100 * W; };
    var Y = function (v, dy) { return v / 100 * H + (dy || 0); };

    spec.forEach(function (m) {
      clock += (m.wait || 0);
      var ds = [];
      if (m.t === "circle") ds = [circlePath(X(m.x), Y(m.y), X(m.rx), Y(m.ry) - Y(0), rand)];
      else if (m.t === "underline") ds = [underlinePath(X(m.x1), X(m.x2), Y(m.y, m.dy), rand)];
      else if (m.t === "arrow") ds = arrowParts(X(m.x1), Y(m.y1), X(m.x2), Y(m.y2), m.bend == null ? 0.12 : m.bend, rand);
      else if (m.t === "label") {
        var tx = mk("text", { x: X(m.x), y: Y(m.y), "text-anchor": m.a || "start", "font-size": fs }, svg);
        String(m.text).split("\n").forEach(function (ln, i) {
          var ts = mk("tspan", { x: X(m.x), dy: i ? fs * 0.95 : 0 }, tx);
          ts.textContent = ln;
        });
        labels.push({ el: tx, at: clock });
        return;
      }
      ds.forEach(function (d) {
        if (photo) { var h = mk("path", { d: d, "class": "halo" }, svg); parts.push({ el: h, at: clock }); }
        var p = mk("path", { d: d }, svg);
        parts.push({ el: p, at: clock });
        var L = p.getTotalLength();
        var dur = clamp(L / 380, 0.3, 1.5);
        parts[parts.length - 1].len = L; parts[parts.length - 1].dur = dur;
        if (photo) { parts[parts.length - 2].len = L; parts[parts.length - 2].dur = dur; }
        clock += dur + 0.06;
      });
    });

    parts.forEach(function (p) {
      p.el.style.strokeDasharray = p.len + " " + (p.len + 2);
      p.el.style.strokeDashoffset = drawn ? 0 : p.len + 1;
      p.el.style.transitionDuration = p.dur + "s";
      p.el.style.transitionDelay = p.at + "s";
    });
    labels.forEach(function (l) {
      l.el.style.transitionDelay = (l.at + 0.05) + "s";
      if (drawn) l.el.classList.add("is-in");
    });
    host._parts = parts; host._labels = labels;
  }

  function drawMarks(host) {
    if (host._drawn) return;
    host._drawn = true;
    if (!host._parts) buildMarks(host);
    var svg = qs(":scope > svg.marks", host);
    if (svg) svg.getBoundingClientRect(); // commit start state
    (host._parts || []).forEach(function (p) { p.el.style.strokeDashoffset = 0; });
    (host._labels || []).forEach(function (l) { l.el.classList.add("is-in"); });
  }

  var markHosts = qsa(".marked[data-marks]");
  markHosts.forEach(buildMarks);
  if ("ResizeObserver" in window) {
    var rt;
    var ro = new ResizeObserver(function () {
      clearTimeout(rt);
      rt = setTimeout(function () { markHosts.forEach(buildMarks); }, 120);
    });
    markHosts.forEach(function (h) { ro.observe(h); });
  }
  if (reduce || !("IntersectionObserver" in window)) {
    markHosts.forEach(function (h) { h._drawn = true; });
  } else {
    var markIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { drawMarks(en.target); markIO.unobserve(en.target); }
      });
    }, { threshold: 0.3, rootMargin: "0px 0px -8% 0px" });
    markHosts.forEach(function (h) { if (!h.hasAttribute("data-manual")) markIO.observe(h); });
  }

  /* ---------------------------------------------------------------- counters (once) */
  var counters = qsa("[data-count]");
  function runCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var dp = parseInt(el.getAttribute("data-dp") || "0", 10);
    var dur = 1500, t0 = null;
    var step = function (ts) {
      if (t0 === null) t0 = ts;
      var k = clamp((ts - t0) / dur, 0, 1), e = 1 - Math.pow(1 - k, 3);
      el.textContent = (target * e).toFixed(dp);
      if (k < 1) requestAnimationFrame(step); else el.textContent = target.toFixed(dp);
    };
    requestAnimationFrame(step);
  }
  if (!reduce && "IntersectionObserver" in window) {
    var cIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { runCount(en.target); cIO.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) {
      el.textContent = (0).toFixed(parseInt(el.getAttribute("data-dp") || "0", 10));
      cIO.observe(el);
    });
  }

  /* ---------------------------------------------------------------- wavy meniscus helper */
  function wavePath(x0, x1, yTop, period, amp, phase, base, close) {
    var d = "";
    for (var x = x0; x <= x1; x += 3) {
      var f = (1 - Math.cos(2 * Math.PI * (x - x0) / period)) / 2;
      var y = yTop - amp * f + 1.1 * Math.sin(x * 0.07 + phase);
      d += (x === x0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1) + " ";
    }
    if (close) d += "L" + x1 + " " + base + " L" + x0 + " " + base + " Z";
    return d;
  }

  /* progress of a tall track through the viewport (0 when top reaches sticky line, 1 when its end does) */
  function trackProgress(track, offsetPx) {
    var r = track.getBoundingClientRect();
    var total = r.height - (window.innerHeight - offsetPx);
    return clamp((offsetPx - r.top) / total, 0, 1);
  }

  /* ---------------------------------------------------------------- Home: capillary channel figure */
  var cap = qs("#cap");
  if (cap) {
    var R = 26, Wd = Math.sqrt(3) * R, ROWS = 10, COLS = 7;
    var padL = 134, padR = 92, padTop = 24, reservoirH = 44;
    var gridW = COLS * Wd + Wd / 2, gridH = (ROWS - 1) * 1.5 * R + 2 * R;
    var vbW = Math.round(gridW + padL + padR), vbH = Math.round(padTop + gridH + reservoirH + 30);
    cap.setAttribute("viewBox", "0 0 " + vbW + " " + vbH);
    var gridBottom = padTop + gridH, gridTop = padTop;
    var seen = {}, edges = [], cells = [];
    for (var r = 0; r < ROWS; r++) {
      var nCols = (r % 2 === 0) ? COLS : COLS - 1;
      for (var c = 0; c < nCols; c++) {
        var cx = padL + Wd / 2 + c * Wd + (r % 2 === 0 ? 0 : Wd / 2);
        var cy = padTop + R + r * 1.5 * R;
        var pts = [];
        for (var k = 0; k < 6; k++) {
          var ang = (Math.PI / 180) * (30 + 60 * k);
          pts.push([cx + R * Math.cos(ang), cy + R * Math.sin(ang)]);
        }
        cells.push(pts.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" "));
        for (var k2 = 0; k2 < 6; k2++) {
          var p = pts[k2], q = pts[(k2 + 1) % 6];
          var key = [p, q].map(function (v) { return v[0].toFixed(1) + "," + v[1].toFixed(1); }).sort().join("|");
          if (!seen[key]) { seen[key] = 1; edges.push([p, q]); }
        }
      }
    }
    var defs = mk("defs", {}, cap);
    var clip = mk("clipPath", { id: "wclip" }, defs);
    var clipPath = mk("path", { d: "M0 0" }, clip);
    var gInk = mk("g", {}, cap);
    var gWater = mk("g", { "clip-path": "url(#wclip)" }, cap);
    cells.forEach(function (pts) { mk("polygon", { points: pts, "class": "water-fill" }, gWater); });
    var items = edges.map(function (e) {
      var mid = (e[0][1] + e[1][1]) / 2;
      var order = clamp((gridBottom - mid) / gridH, 0, 1);
      var attrs = { x1: e[0][0], y1: e[0][1], x2: e[1][0], y2: e[1][1], pathLength: 1, "stroke-dasharray": 1, "stroke-dashoffset": 1, "class": "ink" };
      var l1 = mk("line", attrs, gInk);
      mk("line", { x1: e[0][0], y1: e[0][1], x2: e[1][0], y2: e[1][1], "class": "water-edge" }, gWater);
      return { el: l1, order: order };
    });
    var resY = gridBottom + 12, resX = padL - 6, resW = gridW + 12, resHt = reservoirH - 10;
    var resD = "M" + resX + " " + resY + " h" + resW + " v" + resHt + " h-" + resW + " z";
    var resInk = mk("path", { d: resD, pathLength: 1, "stroke-dasharray": 1, "stroke-dashoffset": 1, "class": "ink" }, cap);
    mk("path", { d: resD, "class": "water-edge" }, gWater);
    var resLabel = mk("text", { x: resX + 8, y: resY + resHt + 15 }, cap); resLabel.textContent = "water supply";
    var surface = mk("path", { d: "M0 0", "class": "surface" }, cap);

    var rx0 = padL + gridW + 14;
    mk("path", { d: "M" + rx0 + " " + (gridTop + gridH * 0.25) + " h26", "class": "lead" }, cap);
    var t1 = mk("text", { x: rx0, y: gridTop + gridH * 0.25 - 6 }, cap); t1.textContent = "w = 0.48 mm";
    var t2 = mk("text", { x: rx0, y: gridTop + gridH * 0.25 + 15 }, cap); t2.textContent = "(0.020 in)";
    mk("path", { d: "M" + rx0 + " " + (gridTop + gridH * 0.72) + " h26", "class": "lead" }, cap);
    var t3 = mk("text", { x: rx0, y: gridTop + gridH * 0.72 - 6 }, cap); t3.textContent = "10.12 mL";
    var t4 = mk("text", { x: rx0, y: gridTop + gridH * 0.72 + 15 }, cap); t4.textContent = "saturated";
    var tag = mk("text", { x: padL - 20, y: 0, "text-anchor": "end", "class": "big" }, cap); tag.textContent = "water front";
    var tagLine = mk("path", { d: "M0 0", "class": "lead" }, cap);

    var capNotes = qsa(".cap-notes li");
    var roDraw = qs("#ro-draw"), roWater = qs("#ro-water"), capTrack = qs("#cap-track");
    var renderCap = function (prog) {
      items.forEach(function (it) {
        var ep = clamp((prog * 1.6 - it.order * 0.55) / 0.45, 0, 1);
        it.el.setAttribute("stroke-dashoffset", (1 - ep).toFixed(3));
      });
      resInk.setAttribute("stroke-dashoffset", (1 - clamp(prog * 6, 0, 1)).toFixed(3));
      var w = clamp((prog - 0.2) / 0.78, 0, 1);
      var supplyTop = resY + 6;
      var yTop = supplyTop - w * (supplyTop - (gridTop - 3));
      var amp = 5.2 * (1 - 0.25 * w);
      clipPath.setAttribute("d", wavePath(padL - 8, padL - 8 + resW, yTop, Wd, amp, prog * 14, vbH, true));
      var showWater = prog > 0.12;
      gWater.style.opacity = showWater ? clamp((prog - 0.12) / 0.06, 0, 1) : 0;
      surface.setAttribute("d", wavePath(padL - 8, padL - 8 + resW, yTop, Wd, amp, prog * 14, vbH, false));
      surface.style.opacity = (showWater && w < 1) ? 1 : 0;
      var tagOn = w > 0.02 && w < 0.98;
      tag.setAttribute("y", (yTop + 8).toFixed(1));
      tag.style.opacity = tagOn ? 1 : 0;
      tagLine.setAttribute("d", "M" + (padL - 16) + " " + (yTop + 2).toFixed(1) + " l10 0");
      tagLine.style.opacity = tagOn ? 1 : 0;
      capNotes.forEach(function (li) { li.classList.toggle("on", prog >= parseFloat(li.getAttribute("data-at"))); });
      if (roDraw) roDraw.textContent = Math.round(clamp(prog / 0.62, 0, 1) * 100) + "%";
      if (roWater) roWater.textContent = Math.round(w * 100) + "%";
    };
    var capScroll = onFrame(function () { renderCap(trackProgress(capTrack, mastPx())); });
    if (reduce) renderCap(1);
    else { window.addEventListener("scroll", capScroll, { passive: true }); window.addEventListener("resize", capScroll); capScroll(); }
  }
  function mastPx() { return (mast ? mast.offsetHeight : 52) + 12; }

  /* ---------------------------------------------------------------- generic hand-drawn trail (margin line) */
  function Trail(svg, host, markers) {
    var self = { len: 0, L: 1, circles: [], ink: null };
    var X = function (y) { return 16 + 4.5 * Math.sin(y / 61) + 2 * Math.sin(y / 23 + 1); };
    self.build = function () {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var H = host.offsetHeight, d = "";
      for (var y = 0; y <= H; y += 14) d += (y ? "L" : "M") + X(y).toFixed(1) + " " + y + " ";
      svg.setAttribute("viewBox", "0 0 34 " + H);
      mk("path", { d: d, "class": "faint" }, svg);
      self.ink = mk("path", { d: d }, svg);
      self.L = self.ink.getTotalLength();
      self.ink.style.strokeDasharray = self.L + " " + (self.L + 2);
      self.ink.style.strokeDashoffset = self.L;
      self.H = H;
      self.circles = markers.map(function (m) {
        var y = m.offsetTop + 14;
        return { y: y, el: mk("circle", { cx: X(y).toFixed(1), cy: y, r: 6 }, svg) };
      });
    };
    self.update = function (yPos) {
      var k = clamp(yPos / self.H, 0, 1);
      self.ink.style.strokeDashoffset = reduce ? 0 : self.L * (1 - k);
      self.circles.forEach(function (c) { c.el.classList.toggle("is-reached", reduce || yPos >= c.y); });
    };
    self.build();
    return self;
  }

  /* ---------------------------------------------------------------- Journey: chapter story */
  var steps = qsa(".step");
  var imgs = qsa(".stage-img");
  if (steps.length && imgs.length) {
    var stepsHost = qs(".steps");
    var trail = Trail(qs(".trail", stepsHost), stepsHost, steps);
    var cur = -1, offT;
    var countEl = qs("#stage-count"), dateEl = qs("#stage-date");
    var activate = function (i) {
      if (i === cur) return;
      var up = i < cur;
      cur = i;
      imgs.forEach(function (im, k) {
        if (k !== i && im.classList.contains("on")) { im.classList.remove("on"); im.classList.add("under"); }
      });
      var el = imgs[i];
      el.classList.remove("under", "on");
      el.classList.add("snap");
      el.classList.toggle("from-up", up);
      void el.offsetWidth;
      el.classList.remove("snap");
      el.classList.add("on");
      var mkd = qs(".marked[data-marks]", el);
      if (mkd) setTimeout(function () { drawMarks(mkd); }, reduce ? 0 : 500);
      clearTimeout(offT);
      offT = setTimeout(function () { imgs.forEach(function (im, k) { if (k !== cur) im.classList.remove("under"); }); }, 950);
      if (countEl) countEl.textContent = String(i + 1).padStart(2, "0");
      if (dateEl) dateEl.textContent = steps[i].getAttribute("data-date") || "";
    };
    var lineFrac = function () { return window.innerWidth <= 960 ? 0.78 : 0.5; };
    var storyScroll = onFrame(function () {
      var line = window.innerHeight * lineFrac();
      var best = 0;
      steps.forEach(function (s, k) { if (s.getBoundingClientRect().top <= line) best = k; });
      activate(best);
      trail.update(line - stepsHost.getBoundingClientRect().top);
    });
    window.addEventListener("scroll", storyScroll, { passive: true });
    window.addEventListener("resize", function () { trail.build(); storyScroll(); });
    window.addEventListener("load", function () { trail.build(); storyScroll(); });
    storyScroll();
  }

  /* ---------------------------------------------------------------- Drop Testing: ladder rail */
  var ladder = qs(".ladder");
  if (ladder) {
    var lsteps = qsa("li:not(.rail-li)", ladder);
    var lsvg = qs(".rail", ladder);
    var lt = Trail(lsvg, ladder, lsteps);
    var ladderScroll = onFrame(function () { lt.update(window.innerHeight * 0.6 - ladder.getBoundingClientRect().top); });
    window.addEventListener("scroll", ladderScroll, { passive: true });
    window.addEventListener("resize", function () { lt.build(); ladderScroll(); });
    window.addEventListener("load", function () { lt.build(); ladderScroll(); });
    ladderScroll();
  }

  /* ---------------------------------------------------------------- Drop Testing: frame scrub */
  var scrub = qs("#scrub");
  if (scrub) {
    var N = 18, WINDOW_S = 2.2;
    var dirs = { "1": "../assets/drop/", "3": "../assets/drop2/" };
    var runLabel = { "1": "Drop 1 (best)", "3": "Drop 3 (double water)" };
    var runNarr = {
      "1": "First drop produced the best capillary dispersal.",
      "3": "Water was left in the system because the code could not be changed; leaving water in was the only way to get more water into the system for the final drop."
    };
    var run = "1", cache = {}, shown = -1, shownRun = "";
    var frameImg = qs("#frame"), markBox = qs("#frame-marks");
    var beats = qsa(".beat", scrub), runName = qs("#run-name"), runNarrEl = qs("#run-narr");
    var buttons = qsa(".runsel button", scrub);
    var hudRun = qs("#hud-run"), hudFrame = qs("#hud-frame"), hudT = qs("#hud-t");
    var rulerLine = qs("#ruler-line"), head = qs("#playhead");
    var pad2 = function (n) { return (n < 10 ? "0" : "") + n; };
    var src = function (r, i) { return dirs[r] + "f-" + pad2(i + 1) + ".jpg"; };
    var preload = function (r) {
      if (cache[r]) return;
      cache[r] = [];
      for (var i = 0; i < N; i++) { var im = new Image(); im.src = src(r, i); cache[r].push(im); }
    };
    preload("1"); preload("3");

    /* ruler: 0 to 2.2 s, a tick every 0.1 s, one dot per frame (nominal positions) */
    var dots = [];
    for (var ti = 0; ti <= 22; ti++) {
      var tk = document.createElement("i");
      tk.className = "tick" + (ti % 5 === 0 || ti === 22 ? " major" : "");
      tk.style.left = (ti / 22 * 100) + "%";
      rulerLine.appendChild(tk);
      if (ti % 5 === 0 || ti === 22) {
        var lb = document.createElement("span");
        lb.className = "tick-l" + (ti === 0 ? " first" : ti === 22 ? " last" : (ti === 5 || ti === 15 || ti === 20) ? " minor" : ""); lb.textContent = (ti / 10).toFixed(1) + " s";
        lb.style.left = (ti / 22 * 100) + "%";
        rulerLine.appendChild(lb);
      }
    }
    for (var fi = 0; fi < N; fi++) {
      var dt = document.createElement("i");
      dt.className = "fdot"; dt.style.left = (fi / (N - 1) * 100) + "%";
      rulerLine.appendChild(dt); dots.push(dt);
    }
    var fw = qs(".frame-wrap"), viewBox = qs(".scrub-view");
    var fit = function () {
      var cs = getComputedStyle(viewBox), padX = parseFloat(cs.paddingLeft) * 2, padY = parseFloat(cs.paddingTop) * 2;
      var w = viewBox.clientWidth - padX, h = viewBox.clientHeight - padY;
      var bw = Math.max(120, Math.min(w, h * 4 / 3, 960));
      fw.style.width = bw + "px"; fw.style.height = (bw * 3 / 4) + "px";
    };
    window.addEventListener("resize", fit); fit();
    var beatFor = function (i) { return i <= 3 ? 0 : i <= 8 ? 1 : i <= 13 ? 2 : 3; };
    var renderScrub = function () {
      var rect = scrub.getBoundingClientRect();
      var total = scrub.offsetHeight - window.innerHeight;
      var p = clamp(-rect.top / total, 0, 1);
      var i = Math.min(N - 1, Math.floor(p * N));
      if (i !== shown || run !== shownRun) {
        frameImg.src = src(run, i);
        frameImg.alt = runLabel[run] + ", frame " + (i + 1) + " of " + N + ", from the NASA Glenn 2.2-Second Drop Tower footage";
        var t = i / (N - 1) * WINDOW_S;
        hudRun.textContent = runLabel[run];
        hudFrame.textContent = pad2(i + 1) + " / " + N;
        hudT.textContent = t.toFixed(2) + " s";
        head.style.left = (t / WINDOW_S * 100) + "%";
        dots.forEach(function (d, k) { d.classList.toggle("past", k <= i); });
        var b = beatFor(i);
        beats.forEach(function (el, k) { el.classList.toggle("on", k === b); });
        if (i >= 7 && markBox) drawMarks(markBox);
        shown = i; shownRun = run;
      }
    };
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        run = btn.getAttribute("data-run");
        buttons.forEach(function (o) { o.setAttribute("aria-pressed", o === btn ? "true" : "false"); });
        runName.textContent = runLabel[run];
        runNarrEl.textContent = runNarr[run];
        renderScrub();
      });
    });
    var scrubScroll = onFrame(renderScrub);
    window.addEventListener("scroll", scrubScroll, { passive: true });
    window.addEventListener("resize", scrubScroll);
    renderScrub();
  }

  /* ---------------------------------------------------------------- Drop Testing: capillary rise (scroll-synced) */
  var rise = qs("#rise");
  if (rise) {
    var MAXR = 14.7, Y0 = 262, PXMM = 16, TX0 = 96, TX1 = 144;
    var rWater = qs("#rise-water"), rSurf = qs("#rise-surface"), rLab = qs("#rise-label"), rVal = qs("#rise-val");
    var rGrid = qs("#rise-grid");
    var renderRise = function (p) {
      var mmv = p * MAXR, y = Y0 - mmv * PXMM, ph = p * 10;
      var wob = 1.2 * Math.sin(ph);
      var d = "M" + TX0 + " " + (Y0 + 8) + " L" + TX0 + " " + (y - 4).toFixed(1) +
        " Q" + ((TX0 + TX1) / 2 + wob).toFixed(1) + " " + (y + 4).toFixed(1) + " " + TX1 + " " + (y - 4).toFixed(1) + " L" + TX1 + " " + (Y0 + 8) + " Z";
      rWater.setAttribute("d", d);
      rSurf.setAttribute("d", "M" + TX0 + " " + (y - 4).toFixed(1) + " Q" + ((TX0 + TX1) / 2 + wob).toFixed(1) + " " + (y + 4).toFixed(1) + " " + TX1 + " " + (y - 4).toFixed(1));
      rLab.setAttribute("y", (y + 5).toFixed(1));
      rLab.textContent = mmv.toFixed(1) + " mm";
      rVal.textContent = mmv.toFixed(1);
    };
    var riseScroll = onFrame(function () {
      var r = rGrid.getBoundingClientRect();
      var p = clamp((window.innerHeight * 0.7 - r.top) / (r.height * 0.8), 0, 1);
      renderRise(p);
    });
    if (reduce) renderRise(1);
    else { window.addEventListener("scroll", riseScroll, { passive: true }); window.addEventListener("resize", riseScroll); riseScroll(); }
  }
})();
