/* HexaFlow, direction C. Two scroll moments only:
   1. Home: sticky image crossfades as each journey chapter passes.
   2. Drop Testing: sticky scrub through 18 real drop-tower frames. */
(function () {
  "use strict";

  var mast = document.querySelector(".mast");
  var solid = function () { mast.classList.toggle("is-solid", window.scrollY > 40); };
  window.addEventListener("scroll", solid, { passive: true });
  solid();

  /* ---------- Home: chapter sequence ---------- */
  var steps = Array.prototype.slice.call(document.querySelectorAll(".step"));
  var imgs = Array.prototype.slice.call(document.querySelectorAll(".stage-img"));
  if (steps.length && imgs.length) {
    var count = document.getElementById("story-count");
    var meter = document.getElementById("story-meter");
    var current = -1;

    var setActive = function (i) {
      if (i === current) return;
      current = i;
      steps.forEach(function (s, k) { s.classList.toggle("is-active", k === i); });
      imgs.forEach(function (im, k) { im.classList.toggle("is-active", k === i); });
      if (count) count.textContent = String(i + 1).padStart(2, "0");
      if (meter) meter.style.width = ((i + 1) / steps.length) * 100 + "%";
    };

    // Pick the step whose box contains the line 45% down the viewport.
    var onScroll = function () {
      var line = window.innerHeight * (window.innerWidth <= 900 ? 0.72 : 0.5);
      var best = 0;
      for (var i = 0; i < steps.length; i++) {
        var r = steps[i].getBoundingClientRect();
        if (r.top <= line) best = i;
      }
      setActive(best);
    };
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; onScroll(); });
    }, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
  }

  /* ---------- Drop testing: frame scrub ---------- */
  var scrub = document.getElementById("scrub");
  if (scrub) {
    var N = 18;
    var dirs = { "1": "../assets/drop/", "3": "../assets/drop2/" };
    var runLabel = { "1": "Drop 1 (best)", "3": "Drop 3 (double water)" };
    var runNarr = {
      "1": "First drop produced the best capillary dispersal.",
      "3": "Water was left in the system because the code could not be changed; leaving water in was the only way to get more water into the system for the final drop."
    };
    var run = "1";
    var cache = {};
    var frame = document.getElementById("frame");
    var slides = Array.prototype.slice.call(document.querySelectorAll(".cap-slide"));
    var runName = document.getElementById("run-name");
    var runNarrEl = document.getElementById("run-narr");
    var fnum = document.getElementById("fnum");
    var bar = document.getElementById("fbar");
    var buttons = Array.prototype.slice.call(document.querySelectorAll(".runsel button"));
    var shown = -1, shownRun = "";

    var src = function (r, i) { return dirs[r] + "f-" + String(i + 1).padStart(2, "0") + ".jpg"; };
    var preload = function (r) {
      if (cache[r]) return;
      cache[r] = [];
      for (var i = 0; i < N; i++) { var im = new Image(); im.src = src(r, i); cache[r].push(im); }
    };
    preload("1");
    preload("3");

    // Which caption beat shows at which frame (0-based frame index ranges).
    var beatFor = function (i) { return i <= 3 ? 0 : i <= 8 ? 1 : i <= 13 ? 2 : 3; };

    var render = function () {
      var rect = scrub.getBoundingClientRect();
      var total = scrub.offsetHeight - window.innerHeight;
      var p = Math.min(1, Math.max(0, -rect.top / total));
      var i = Math.min(N - 1, Math.floor(p * N));
      if (i !== shown || run !== shownRun) {
        frame.src = src(run, i);
        fnum.textContent = String(i + 1).padStart(2, "0");
        var b = beatFor(i);
        slides.forEach(function (s, k) { s.classList.toggle("is-active", k === b); });
        shown = i; shownRun = run;
      }
      bar.style.width = (p * 100) + "%";
    };

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        run = btn.getAttribute("data-run");
        buttons.forEach(function (o) { o.setAttribute("aria-pressed", o === btn ? "true" : "false"); });
        runName.textContent = runLabel[run];
        runNarrEl.textContent = runNarr[run];
        render();
      });
    });

    var tick = false;
    window.addEventListener("scroll", function () {
      if (tick) return;
      tick = true;
      requestAnimationFrame(function () { tick = false; render(); });
    }, { passive: true });
    window.addEventListener("resize", render);
    render();
  }
})();
