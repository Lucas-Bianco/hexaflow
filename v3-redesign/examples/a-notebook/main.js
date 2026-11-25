/* HexaFlow, Direction A. Vanilla JS. Three jobs: contents list, capillary line drawing (Home), drop-frame scrubber (Drop Testing). */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  /* ---- pages menu + contents: open on wide screens ---- */
  var wide = window.matchMedia("(min-width: 75rem)");
  var wideNav = window.matchMedia("(min-width: 62rem)");
  function syncDetails() {
    var pages = document.querySelector(".pages");
    var toc = document.getElementById("toc");
    if (pages) pages.open = wideNav.matches;
    if (toc) toc.open = wide.matches;
  }
  syncDetails();
  (wide.addEventListener ? wide.addEventListener.bind(wide) : wide.addListener.bind(wide))("change", syncDetails);
  (wideNav.addEventListener ? wideNav.addEventListener.bind(wideNav) : wideNav.addListener.bind(wideNav))("change", syncDetails);

  /* ---- running contents ---- */
  var toc = document.getElementById("toc");
  if (toc) {
    var list = toc.querySelector("ol");
    var heads = document.querySelectorAll("main h2[id], main h3[id]");
    var links = [];
    heads.forEach(function (h) {
      var num = h.querySelector(".num");
      var li = document.createElement("li");
      if (h.tagName === "H3") li.className = "sub";
      var a = document.createElement("a");
      a.href = "#" + h.id;
      var b = document.createElement("b");
      b.textContent = num ? num.textContent : "";
      var s = document.createElement("span");
      s.textContent = h.textContent.replace(num ? num.textContent : "", "").trim();
      a.appendChild(b); a.appendChild(s); li.appendChild(a); list.appendChild(li);
      links.push({ a: a, h: h });
    });
    var updateToc = function () {
      var cur = links[0];
      var line = window.innerHeight * 0.3;
      links.forEach(function (l) { if (l.h.getBoundingClientRect().top <= line) cur = l; });
      links.forEach(function (l) { l.a.classList.toggle("on", l === cur); });
    };
    window.addEventListener("scroll", updateToc, { passive: true });
    window.addEventListener("resize", updateToc);
    updateToc();
  }

  /* progress of a tall track through the viewport: 0 when its top reaches the sticky line, 1 when its end does */
  function trackProgress(track, offsetPx) {
    var r = track.getBoundingClientRect();
    var total = r.height - (window.innerHeight - offsetPx);
    return clamp((offsetPx - r.top) / total, 0, 1);
  }

  /* ---- capillary channel drawing (Fig. 2) ---- */
  var svg = document.getElementById("cap");
  if (svg) {
    var NS = "http://www.w3.org/2000/svg";
    var R = 26, W = Math.sqrt(3) * R, ROWS = 10, COLS = 7;
    var padX = 24, padTop = 26, reservoirH = 40;
    var gridW = COLS * W + W / 2, gridH = (ROWS - 1) * 1.5 * R + 2 * R;
    var vbW = gridW + padX * 2 + 70, vbH = padTop + gridH + reservoirH + 34;
    svg.setAttribute("viewBox", "0 0 " + vbW.toFixed(0) + " " + vbH.toFixed(0));
    var gridBottom = padTop + gridH, gridTop = padTop;

    var seen = {}, edges = [];
    for (var r = 0; r < ROWS; r++) {
      var n = (r % 2 === 0) ? COLS : COLS - 1;
      for (var c = 0; c < n; c++) {
        var cx = padX + W / 2 + c * W + (r % 2 === 0 ? 0 : W / 2);
        var cy = padTop + R + r * 1.5 * R;
        var pts = [];
        for (var k = 0; k < 6; k++) {
          var ang = (Math.PI / 180) * (30 + 60 * k);
          pts.push([cx + R * Math.cos(ang), cy + R * Math.sin(ang)]);
        }
        for (var k2 = 0; k2 < 6; k2++) {
          var p = pts[k2], q = pts[(k2 + 1) % 6];
          var key = [p, q].map(function (v) { return v[0].toFixed(1) + "," + v[1].toFixed(1); }).sort().join("|");
          if (!seen[key]) { seen[key] = 1; edges.push([p, q]); }
        }
      }
    }

    function mk(tag, attrs, parent) {
      var el = document.createElementNS(NS, tag);
      for (var a in attrs) el.setAttribute(a, attrs[a]);
      if (parent) parent.appendChild(el);
      return el;
    }
    var defs = mk("defs", {}, svg);
    var clip = mk("clipPath", { id: "wclip" }, defs);
    var clipRect = mk("rect", { x: 0, y: vbH, width: vbW, height: 0 }, clip);

    var gInk = mk("g", { "class": "ink" }, svg);
    var gWater = mk("g", { "class": "water", "clip-path": "url(#wclip)" }, svg);

    var items = edges.map(function (e) {
      var mid = (e[0][1] + e[1][1]) / 2;
      var order = clamp((gridBottom - mid) / gridH, 0, 1); // 0 at bottom, 1 at top
      var attrs = { x1: e[0][0], y1: e[0][1], x2: e[1][0], y2: e[1][1], pathLength: 1, "stroke-dasharray": 1, "stroke-dashoffset": 1 };
      var l1 = mk("line", attrs, gInk);
      var l2 = mk("line", { x1: e[0][0], y1: e[0][1], x2: e[1][0], y2: e[1][1] }, gWater);
      return { el: l1, order: order };
    });

    /* reservoir at the base: ink outline + water outline */
    var resY = gridBottom + 14, resX = padX, resW = gridW;
    var resPath = "M" + resX + "," + resY + " h" + resW + " v" + (reservoirH - 14) + " h-" + resW + " z";
    var resInk = mk("path", { d: resPath, pathLength: 1, "stroke-dasharray": 1, "stroke-dashoffset": 1, "class": "ink" }, svg);
    var resWater = mk("path", { d: resPath, "class": "water", "clip-path": "url(#wclip)" }, svg);
    var resLabel = mk("text", { x: resX + 6, y: resY + reservoirH - 22 }, svg);
    resLabel.textContent = "water supply";

    /* dimension callout for channel width, pointing at one edge */
    var ex = edges[Math.floor(edges.length * 0.42)];
    var lx = padX + gridW + 12;
    var ly = gridTop + gridH * 0.28;
    mk("path", { d: "M" + lx + "," + ly + " h30", "class": "lead" }, svg);
    var t1 = mk("text", { x: lx, y: ly - 5 }, svg); t1.textContent = "w = 0.48 mm";
    var t2 = mk("text", { x: lx, y: ly + 12 }, svg); t2.textContent = "(0.020 in)";
    var lx2 = lx, ly2 = gridTop + gridH * 0.7;
    mk("path", { d: "M" + lx2 + "," + ly2 + " h30", "class": "lead" }, svg);
    var t3 = mk("text", { x: lx2, y: ly2 - 5 }, svg); t3.textContent = "10.12 mL";
    var t4 = mk("text", { x: lx2, y: ly2 + 12 }, svg); t4.textContent = "saturated";

    var front = mk("line", { x1: 0, x2: vbW - 70, y1: gridBottom, y2: gridBottom, "class": "front" }, svg);
    front.style.opacity = 0;

    var ro = {
      draw: document.getElementById("ro-draw"),
      water: document.getElementById("ro-water")
    };
    var track = document.getElementById("cap-track");

    var render = function (prog) {
      var drawP = prog;
      items.forEach(function (it) {
        var ep = clamp((drawP * 1.5 - it.order * 0.5) / 0.5, 0, 1);
        it.el.setAttribute("stroke-dashoffset", (1 - ep).toFixed(3));
      });
      resInk.setAttribute("stroke-dashoffset", (1 - clamp(prog * 6, 0, 1)).toFixed(3));
      var w = clamp((prog - 0.2) / 0.8, 0, 1);
      var topY = gridBottom - w * (gridBottom - gridTop + 4);
      var fullY = resY + (reservoirH - 14) + 2;
      var visibleTop = w > 0 ? topY : fullY;
      clipRect.setAttribute("y", visibleTop.toFixed(1));
      clipRect.setAttribute("height", (vbH - visibleTop).toFixed(1));
      var showResWater = prog > 0.12;
      resWater.style.opacity = showResWater ? 1 : 0;
      if (w <= 0 && showResWater) { clipRect.setAttribute("y", resY - 1); clipRect.setAttribute("height", vbH - resY + 1); }
      front.setAttribute("y1", visibleTop.toFixed(1));
      front.setAttribute("y2", visibleTop.toFixed(1));
      front.style.opacity = (w > 0 && w < 1) ? 1 : 0;
      if (ro.draw) ro.draw.textContent = Math.round(clamp(prog / 0.67, 0, 1) * 100) + "%";
      if (ro.water) ro.water.textContent = Math.round(w * 100) + "%";
    };

    var onScroll = function () { render(trackProgress(track, parseFloat(getComputedStyle(document.documentElement).fontSize) * 4)); };
    if (reduce) { render(1); }
    else {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      onScroll();
    }
  }

  /* ---- drop-frame scrubber ---- */
  var dropTrack = document.getElementById("drop-track");
  if (dropTrack) {
    var N = 18, WINDOW_S = 2.2;
    var RUNS = {
      d1: { dir: "../assets/drop/", label: "Drop 1 (best)", narrative: "First drop produced the best capillary dispersal." },
      d3: { dir: "../assets/drop2/", label: "Drop 3 (double water)", narrative: "Water was left in the system because the code could not be changed; leaving water in was the only way to get more water into the system for the final drop." }
    };
    var stages = [
      { upto: 6, tag: "Setup", text: function () { return "Before each drop we add about 5 mL of dyed water to the TDC center and seal the injector hole."; }, src: "dropTests.methodology" },
      { upto: 13, tag: "In free-fall", text: function (run) { return run.narrative; }, src: "dropTests.runs" },
      { upto: 18, tag: "Design target", text: function () { return "No free droplets: water climbs into the channels by capillary action."; }, src: "dropTests.stats.expectedResult" }
    ];
    var runKey = "d1", frame = 0;
    var img = document.getElementById("drop-img");
    var elFrame = document.getElementById("hud-frame");
    var elTime = document.getElementById("hud-time");
    var elRun = document.getElementById("hud-run");
    var cap = document.getElementById("drop-cap");
    var bar = document.getElementById("scrub-fill");
    var tick = document.getElementById("scrub-tick");
    var btns = document.querySelectorAll(".runsel button");
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };

    function src(run, i) { return RUNS[run].dir + "f-" + pad(i + 1) + ".jpg"; }
    var cache = {};
    function preload(run) {
      for (var i = 0; i < N; i++) { var k = run + i; if (!cache[k]) { cache[k] = new Image(); cache[k].src = src(run, i); } }
    }
    preload("d1");

    function show() {
      var run = RUNS[runKey];
      img.src = src(runKey, frame);
      img.alt = run.label + ", frame " + (frame + 1) + " of " + N + " from the NASA Glenn 2.2-Second Drop Tower footage";
      elFrame.textContent = "frame " + pad(frame + 1) + " / " + N;
      var t = (frame / (N - 1)) * WINDOW_S;
      elTime.textContent = "t = " + t.toFixed(2) + " s";
      elRun.textContent = run.label;
      var stage = stages[stages.length - 1];
      for (var s = 0; s < stages.length; s++) { if (frame + 1 <= stages[s].upto) { stage = stages[s]; break; } }
      cap.innerHTML = "";
      var tag = document.createElement("span"); tag.className = "fn"; tag.textContent = "Fig. 1." + (frame + 1) + " " + stage.tag;
      var body = document.createElement("span"); body.textContent = stage.text(run);
      var sc = document.createElement("span"); sc.className = "src"; sc.textContent = "caption: " + stage.src;
      cap.appendChild(tag); cap.appendChild(body); cap.appendChild(sc);
      var pct = (frame / (N - 1)) * 100;
      bar.style.width = pct + "%";
      tick.style.left = pct + "%";
    }

    var onDropScroll = function () {
      var off = parseFloat(getComputedStyle(document.documentElement).fontSize) * 4;
      var p = trackProgress(dropTrack, off);
      var f = clamp(Math.round(p * (N - 1)), 0, N - 1);
      if (f !== frame) { frame = f; show(); }
    };
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        runKey = b.getAttribute("data-run");
        btns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        preload(runKey);
        show();
      });
    });
    window.addEventListener("scroll", onDropScroll, { passive: true });
    window.addEventListener("resize", onDropScroll);
    onDropScroll();
    show();
  }
})();
