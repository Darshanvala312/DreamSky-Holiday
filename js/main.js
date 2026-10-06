/* ==========================================================
   AFTER DARK — script.js
   Vanilla JS. Works straight from file://. No dependencies.
   ========================================================== */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var rand = function (a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; };
  var pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var body = document.body;

  var entered = false;
  var deep = false;

  /* ---------------------------------------------------------
     CONTENT POOLS
     --------------------------------------------------------- */
  var JOKES = [
    "I don't have commitment issues. I just believe in keeping my options emotionally available.",
    "My dating life has more red flags than a Formula 1 race.",
    "I like my relationships like my Wi-Fi — strong connection, no unnecessary interruptions.",
    "Romance is temporary. Screenshots are forever.",
    "I flirt with confidence. Then overthink the conversation for three business days.",
    "That's not a red flag. That's a whole emergency broadcast.",
    "Bhai, situation thodi zyada complicated ho gayi. Relationship status: Loading… forever.",
    "Su scene chhe? Full confusion chhe boss.",
    "આ તો અલગ જ લેવલની ગડબડ છે. 😂",
    "भाई, ये मामला हाथ से निकल चुका है।",
    "My emotional availability is currently experiencing technical difficulties.",
    "I'm not toxic. I'm just premium difficulty.",
    "Being an adult is just Googling things with confidence.",
    "My love language is replying to your text at 2 AM and acting like it's normal.",
    "Nightlife is just overpriced fresh air with a questionable playlist and worse decisions.",
    "I don't ghost people. I just fade out with plausible deniability."
  ];

  var DECISIONS = [
    "Text the person you said you were over.",
    "Say yes before thinking.",
    "Order something you absolutely don't need.",
    "Trust your instincts. Unfortunately, your instincts are questionable.",
    "Open that old chat. You know exactly which one.",
    "Send the message. Regret is tomorrow's problem.",
    "Bhai, bas ek last episode. (Sunrise ho chuka hai.)",
    "Reply “haha” to something that was not funny. Commit to the bit.",
    "Stay up till 4 AM for a conversation that could've been a meme.",
    "Su vichare chhe? Jaa, message kari de. Pachhi joi laishu.",
    "Add it to the cart. Pay later. Cry later. Same energy.",
    "Say “I'm fine” confidently. Then overthink it for six hours.",
    "भाई, छोड़ ना… बस एक और बुरा फैसला."
  ];

  var LEVELS = [
    { at: 0,   label: "Too Innocent",               emoji: "😇", desc: "You say “oops” when you stub your toe. Wholesome. Suspicious. Slightly boring." },
    { at: 25,  label: "Mildly Chaotic",             emoji: "😏", desc: "You laugh at the joke first, then check whether anyone noticed." },
    { at: 50,  label: "Sarcasm Activated",          emoji: "😎", desc: "Every sentence has a second layer. Half the room is confused. You're thriving." },
    { at: 75,  label: "Dark Mode Human",            emoji: "😈", desc: "Your humour has a dress code: black. Your brain runs on 2 AM energy." },
    { at: 100, label: "Absolutely Unsupervised 💀", emoji: "💀", desc: "No filter, no brakes, no supervision. Society has been notified." }
  ];

  var POPUPS = [
    { icon: "⚠️", title: "⚠️ EMOTIONAL DAMAGE DETECTED", text: "Please restart your personality.", btn: "RESTART", restart: true },
    { icon: "🛑", title: "SYSTEM WARNING", text: "Your decision-making process has stopped responding.", btn: "IGNORE LIKE AN ADULT" },
    { icon: "🌑", title: "DARK MODE LEVEL: 99%", text: "Congratulations. You are officially overthinking again.", btn: "ACCEPT FATE" }
  ];

  /* ---------------------------------------------------------
     PARTICLES
     --------------------------------------------------------- */
  var canvas = $('#particles');
  var ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
  var W = 0, H = 0, parts = [], targetParts = 45, running = true;

  function resizeCanvas() {
    if (!ctx) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makeParticle(initial) {
    return {
      x: Math.random() * W,
      y: initial ? Math.random() * H : H + 12,
      r: Math.random() * 2 + 0.4,
      vy: Math.random() * 0.5 + 0.15,
      vx: (Math.random() - 0.5) * 0.3,
      a: Math.random() * 0.6 + 0.2,
      c: Math.random() < 0.6 ? '255,23,68' : '124,58,237',
      t: Math.random() * Math.PI * 2
    };
  }

  function particleLoop() {
    if (!ctx) return;
    if (running) {
      ctx.clearRect(0, 0, W, H);
      var speed = deep ? 1.7 : 1;
      while (parts.length < targetParts) parts.push(makeParticle(parts.length < 8 ? true : Math.random() < 0.3));
      if (parts.length > targetParts) parts.pop();
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.t += 0.02;
        p.x += p.vx * speed + Math.sin(p.t) * 0.2;
        p.y -= p.vy * speed;
        if (p.y < -12 || p.x < -12 || p.x > W + 12) { parts[i] = makeParticle(false); continue; }
        var tw = 0.6 + Math.sin(p.t * 2) * 0.4;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(' + p.c + ',' + (p.a * tw).toFixed(3) + ')';
        ctx.shadowColor = 'rgba(' + p.c + ',0.9)';
        ctx.shadowBlur = deep ? 14 : 8;
        ctx.arc(p.x, p.y, p.r * (deep ? 1.3 : 1), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }
    requestAnimationFrame(particleLoop);
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  document.addEventListener('visibilitychange', function () { running = !document.hidden; });
  if (!reduceMotion) { particleLoop(); }

  /* ---------------------------------------------------------
     CUSTOM CURSOR
     --------------------------------------------------------- */
  var dot = $('#cursorDot'), ring = $('#cursorRing');
  var fine = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
  if (fine && dot && ring) {
    body.classList.add('has-cursor');
    var mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
    }, { passive: true });
    (function ringLoop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
      requestAnimationFrame(ringLoop);
    })();
    document.addEventListener('mouseover', function (e) {
      var t = e.target.closest && e.target.closest('a,button,input,.flip,[data-tilt]');
      ring.classList.toggle('hover', !!t);
    });
  }

  /* ---------------------------------------------------------
     MAGNETIC BUTTONS + 3D TILT
     --------------------------------------------------------- */
  function bindMagnetic(el) {
    el.addEventListener('mousemove', function (e) {
      var r = el.getBoundingClientRect();
      var x = (e.clientX - (r.left + r.width / 2)) * 0.3;
      var y = (e.clientY - (r.top + r.height / 2)) * 0.4;
      el.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    });
    el.addEventListener('mouseleave', function () { el.style.transform = ''; });
  }
  $$('.magnetic').forEach(bindMagnetic);

  function bindTilt(el) {
    el.addEventListener('mousemove', function (e) {
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = 'perspective(800px) rotateX(' + (-py * 9).toFixed(2) + 'deg) rotateY(' + (px * 11).toFixed(2) + 'deg) translateZ(6px)';
    });
    el.addEventListener('mouseleave', function () { el.style.transform = ''; });
  }
  if (fine) $$('[data-tilt]').forEach(bindTilt);

  /* ---------------------------------------------------------
     POPUP / MODAL SYSTEM
     --------------------------------------------------------- */
  var popup = $('#popup'), popIcon = $('#popIcon'), popTitle = $('#popTitle'),
      popText = $('#popText'), popBtn = $('#popBtn'), popBtn2 = $('#popBtn2');
  var popOpen = false, popAction = null, lastFocus = null;

  function showPopup(o) {
    if (!popup) return;
    popIcon.textContent = o.icon || '⚠️';
    popTitle.textContent = o.title || '';
    popText.textContent = o.text || '';
    popBtn.textContent = o.btn || 'OK';
    popAction = o.onBtn || null;
    if (o.btn2) { popBtn2.textContent = o.btn2; popBtn2.hidden = false; } else { popBtn2.hidden = true; }
    lastFocus = document.activeElement;
    popup.hidden = false;
    popOpen = true;
    popBtn.focus({ preventScroll: true });
  }

  function closePopup() {
    if (!popup) return;
    popup.hidden = true;
    popOpen = false;
    popAction = null;
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus({ preventScroll: true }); } catch (e) { /* noop */ } }
  }

  if (popBtn) popBtn.addEventListener('click', function () {
    var act = popAction;
    var keep = act ? act() === 'keep' : false;
    if (!keep) closePopup();
  });
  if (popBtn2) popBtn2.addEventListener('click', closePopup);
  if (popup) popup.addEventListener('click', function (e) { if (e.target === popup) closePopup(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && popOpen) closePopup(); });

  function distortScreen() {
    body.classList.add('distort');
    setTimeout(function () { body.classList.remove('distort'); }, 650);
  }

  var popTimer = null, lastPopIdx = -1;
  function schedulePopup(first) {
    clearTimeout(popTimer);
    popTimer = setTimeout(function () {
      if (popOpen || document.hidden || !entered) { schedulePopup(false); return; }
      var i;
      do { i = rand(0, POPUPS.length - 1); } while (i === lastPopIdx && POPUPS.length > 1);
      lastPopIdx = i;
      var p = POPUPS[i];
      showPopup({
        icon: p.icon, title: p.title, text: p.text, btn: p.btn,
        onBtn: p.restart ? function () { distortScreen(); } : null
      });
      schedulePopup(false);
    }, first ? rand(18000, 28000) : rand(40000, 75000));
  }

  /* ---------------------------------------------------------
     AGE GATE
     --------------------------------------------------------- */
  var gate = $('#gate'), flash = $('#flash');

  function enterSite() {
    if (entered) return;
    entered = true;
    gate.classList.add('glitching');
    setTimeout(function () { flash.classList.add('go'); }, 330);
    setTimeout(function () {
      gate.classList.add('gone');
      body.classList.remove('locked');
      body.classList.add('entered');
      window.scrollTo(0, 0);
      schedulePopup(true);
    }, 900);
    setTimeout(function () {
      gate.hidden = true;
      flash.classList.remove('go');
    }, 1800);
  }

  var enterBtn = $('#enterBtn'), leaveBtn = $('#leaveBtn');
  if (enterBtn) enterBtn.addEventListener('click', enterSite);
  if (leaveBtn) leaveBtn.addEventListener('click', function () {
    try { window.close(); } catch (e) { /* noop */ }
    setTimeout(function () { window.location.href = 'about:blank'; }, 120);
  });

  /* ---------------------------------------------------------
     NAV
     --------------------------------------------------------- */
  var navToggle = $('#navToggle'), navLinks = $('#navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    $$('a', navLinks).forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------------------------------------------------
     SCROLL REVEAL
     --------------------------------------------------------- */
  var reveals = $$('.reveal');
  reveals.forEach(function (el) {
    var siblings = $$('.reveal', el.parentElement);
    var idx = siblings.indexOf(el);
    el.style.setProperty('--d', (Math.min(idx, 6) * 0.07).toFixed(2) + 's');
  });

  var metricsPlayed = false;
  function playMetrics() {
    if (metricsPlayed) return;
    metricsPlayed = true;
    $$('.metric[data-v]').forEach(function (m, i) {
      var v = parseInt(m.getAttribute('data-v'), 10);
      var bar = $('.bar i', m), val = $('.val', m);
      setTimeout(function () {
        bar.style.width = v + '%';
        var start = null;
        (function step(ts) {
          if (!start) start = ts;
          var t = Math.min((ts - start) / 1600, 1);
          var eased = 1 - Math.pow(1 - t, 3);
          val.textContent = Math.round(v * eased) + '%';
          if (t < 1) requestAnimationFrame(step);
        })(performance.now());
      }, i * 140);
    });
    var off = $('.metric.offline .bar i');
    if (off) off.style.width = '2%';
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          if (en.target.classList.contains('dash')) {
            if (entered) playMetrics(); else waitForEntry(playMetrics);
          }
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
    playMetrics();
  }

  function waitForEntry(fn) {
    var t = setInterval(function () { if (entered) { clearInterval(t); setTimeout(fn, 900); } }, 300);
  }

  /* ---------------------------------------------------------
     FLIP CARDS (tap support)
     --------------------------------------------------------- */
  $$('.flip').forEach(function (f) {
    f.addEventListener('click', function () {
      var open = f.classList.toggle('open');
      f.setAttribute('aria-pressed', String(open));
    });
  });

  /* ---------------------------------------------------------
     HERO JOKE GENERATOR
     --------------------------------------------------------- */
  var lastJoke = -1;
  function nextJoke() {
    var i;
    do { i = rand(0, JOKES.length - 1); } while (i === lastJoke && JOKES.length > 1);
    lastJoke = i;
    return JOKES[i];
  }
  function showJoke() {
    showPopup({
      icon: pick(['😈', '🖤', '🔥', '🥀', '🌚']),
      title: 'FRESH CHAOS',
      text: nextJoke(),
      btn: 'ANOTHER ONE',
      btn2: 'CLOSE',
      onBtn: function () {
        popIcon.textContent = pick(['😈', '🖤', '🔥', '🥀', '🌚']);
        popText.textContent = nextJoke();
        popText.style.animation = 'none';
        void popText.offsetWidth;
        popText.style.animation = 'land .6s cubic-bezier(.2,.8,.2,1)';
        return 'keep';
      }
    });
  }
  var heroJoke = $('#heroJoke');
  if (heroJoke) heroJoke.addEventListener('click', showJoke);

  /* ---------------------------------------------------------
     BAD DECISION GENERATOR
     --------------------------------------------------------- */
  var decisionBtn = $('#decisionBtn'), decisionOut = $('#decisionOut');
  var lastDecision = -1, deciding = false;
  if (decisionBtn && decisionOut) decisionBtn.addEventListener('click', function () {
    if (deciding) return;
    deciding = true;
    decisionBtn.disabled = true;
    decisionOut.classList.remove('land');
    decisionOut.classList.add('spin');
    var ticks = 0;
    var iv = setInterval(function () {
      decisionOut.textContent = pick(DECISIONS);
      ticks++;
      if (ticks > 11) {
        clearInterval(iv);
        var i;
        do { i = rand(0, DECISIONS.length - 1); } while (i === lastDecision && DECISIONS.length > 1);
        lastDecision = i;
        decisionOut.classList.remove('spin');
        void decisionOut.offsetWidth;
        decisionOut.textContent = DECISIONS[i];
        decisionOut.classList.add('land');
        decisionBtn.disabled = false;
        decisionBtn.textContent = 'GENERATE AGAIN 🔥';
        deciding = false;
      }
    }, 90);
  });

  /* ---------------------------------------------------------
     DARK HUMOUR METER
     --------------------------------------------------------- */
  var range = $('#meterRange'), fill = $('#meterFill'), mPct = $('#meterPct'),
      mLabel = $('#meterLabel'), mDesc = $('#meterDesc'), mEmoji = $('#meterEmoji'),
      ticks = $$('#meterTicks li');

  function updateMeter() {
    if (!range) return;
    var v = parseInt(range.value, 10);
    var idx = v < 13 ? 0 : v < 38 ? 1 : v < 63 ? 2 : v < 88 ? 3 : 4;
    var lv = LEVELS[idx];
    fill.style.width = v + '%';
    mPct.textContent = v + '%';
    mPct.style.setProperty('--lvl', v);
    if (mLabel.textContent !== lv.label) {
      mLabel.textContent = lv.label;
      mEmoji.textContent = lv.emoji;
      mEmoji.style.transform = 'scale(1.35) rotate(' + rand(-12, 12) + 'deg)';
      setTimeout(function () { mEmoji.style.transform = ''; }, 260);
    }
    mDesc.textContent = lv.desc;
    ticks.forEach(function (t, i) { t.classList.toggle('active', i === idx); });
  }
  if (range) {
    range.addEventListener('input', updateMeter);
    updateMeter();
  }

  /* ---------------------------------------------------------
     RED FLAG DETECTOR
     --------------------------------------------------------- */
  var scanBtn = $('#scanBtn'), scanner = $('#scanner'), scanStatus = $('#scanStatus'),
      scanResult = $('#scanResult'), scanning = false;
  var SCAN_LINES = [
    'Scanning vibes…',
    'Cross-checking bad decisions…',
    'Reading 2 AM messages…',
    'Measuring overthinking levels…',
    'Detecting suspicious optimism…',
    'Calculating drama potential…'
  ];
  var R = {
    sarcasm: ['HIGH', 'EXTREME', 'DANGEROUSLY HIGH', 'CRITICAL'],
    commit: ['Loading…', 'Buffering…', 'Error 404', 'Pending approval'],
    sense: ['Missing', 'Offline', 'Last seen in 2019', 'Not found'],
    drama: ['MAXIMUM', 'MAXIMUM+', 'Cinematic', 'Over 9000'],
    sleep: ['Destroyed', 'Fictional', 'Legally dead', 'Rumour only']
  };

  if (scanBtn) scanBtn.addEventListener('click', function () {
    if (scanning) return;
    scanning = true;
    scanBtn.disabled = true;
    scanResult.hidden = true;
    scanner.classList.add('scanning');
    var li = 0;
    scanStatus.textContent = SCAN_LINES[0];
    var lineTimer = setInterval(function () {
      li = (li + 1) % SCAN_LINES.length;
      scanStatus.textContent = SCAN_LINES[li];
    }, 500);

    setTimeout(function () {
      clearInterval(lineTimer);
      scanner.classList.remove('scanning');
      var flags = rand(9, 29);
      if (Math.random() < 0.25) flags = 17;
      $('#rSarcasm').textContent = pick(R.sarcasm);
      $('#rCommit').textContent = pick(R.commit);
      $('#rSense').textContent = pick(R.sense);
      $('#rDrama').textContent = pick(R.drama);
      $('#rSleep').textContent = pick(R.sleep);
      var fc = $('#flagCount');
      fc.textContent = '0';
      scanResult.hidden = false;
      scanStatus.textContent = 'Scan complete.';
      var t0 = performance.now();
      (function count(ts) {
        var t = Math.min((ts - t0) / 900, 1);
        fc.textContent = String(Math.round(flags * t));
        if (t < 1) requestAnimationFrame(count);
      })(t0);
      scanBtn.textContent = 'SCAN AGAIN 🚩';
      scanBtn.disabled = false;
      scanning = false;
    }, 3000);
  });

  /* ---------------------------------------------------------
     DEEP DARK MODE
     --------------------------------------------------------- */
  var darkToggle = $('#darkToggle');
  if (darkToggle) darkToggle.addEventListener('click', function () {
    deep = !deep;
    body.classList.toggle('deep', deep);
    darkToggle.setAttribute('aria-pressed', String(deep));
    darkToggle.textContent = deep ? '☀️ RETURN TO CHAOS' : '🌙 DEEP DARK MODE';
    targetParts = deep ? 120 : 45;
    distortScreen();
    if (flash) {
      flash.classList.remove('go');
      void flash.offsetWidth;
      flash.classList.add('go');
      setTimeout(function () { flash.classList.remove('go'); }, 850);
    }
  });

})();
