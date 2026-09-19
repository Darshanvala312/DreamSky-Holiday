/* ============================================================
   DREAMSKY HOLIDAY — main.js
   Modular vanilla JS. No frameworks, no build step.
   ============================================================ */
(function () {
  "use strict";

  const WHATSAPP_NUMBER = "919023141079"; // +91 90231 41079, digits only for wa.me

  /* ---------------- Preloader ---------------- */
  function initPreloader() {
    const pre = document.getElementById("preloader");
    if (!pre) return;
    window.addEventListener("load", () => {
      setTimeout(() => pre.classList.add("hidden"), 500);
    });
    // Fallback in case 'load' already fired
    setTimeout(() => pre.classList.add("hidden"), 2500);
  }

  /* ---------------- Navigation ---------------- */
  function initNavigation() {
    const navbar = document.getElementById("navbar");
    const hamburger = document.getElementById("hamburger");
    const mobileNav = document.getElementById("mobileNav");
    const mobileClose = document.getElementById("mobileNavClose");
    const navLinks = document.querySelectorAll(".nav-links a, .mobile-nav a[data-nav]");
    const sections = document.querySelectorAll("main section[id]");

    function onScroll() {
      if (window.scrollY > 40) navbar.classList.add("scrolled");
      else navbar.classList.remove("scrolled");
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    function openMobile() {
      mobileNav.classList.add("open");
      document.body.classList.add("nav-open");
      hamburger.setAttribute("aria-expanded", "true");
    }
    function closeMobile() {
      mobileNav.classList.remove("open");
      document.body.classList.remove("nav-open");
      hamburger.setAttribute("aria-expanded", "false");
    }
    if (hamburger) {
      hamburger.addEventListener("click", () => {
        mobileNav.classList.contains("open") ? closeMobile() : openMobile();
      });
    }
    if (mobileClose) mobileClose.addEventListener("click", closeMobile);
    mobileNav?.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMobile));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMobile();
    });

    // Active link on scroll (IntersectionObserver)
    if (sections.length && navLinks.length) {
      const map = new Map();
      navLinks.forEach((a) => {
        const href = a.getAttribute("href");
        if (!href || !href.startsWith("#")) return;
        const id = href.slice(1);
        if (!map.has(id)) map.set(id, []);
        map.get(id).push(a);
      });
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const links = map.get(entry.target.id);
            if (!links) return;
            if (entry.isIntersecting) {
              navLinks.forEach((l) => l.classList.remove("active"));
              links.forEach((l) => l.classList.add("active"));
            }
          });
        },
        { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
      );
      sections.forEach((s) => obs.observe(s));
    }
  }

  /* ---------------- Scroll reveal animations ---------------- */
  function initScrollAnimations() {
    const targets = document.querySelectorAll(
      ".reveal, .reveal-up, .reveal-left, .reveal-right, .scale-in"
    );
    if (!("IntersectionObserver" in window) || !targets.length) {
      targets.forEach((t) => t.classList.add("in"));
      return;
    }
    const obs = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    targets.forEach((t) => obs.observe(t));

    // Stagger children index
    document.querySelectorAll(".stagger").forEach((group) => {
      Array.from(group.children).forEach((child, i) => {
        child.style.setProperty("--i", i);
      });
    });
  }

  /* ---------------- Animated counters ---------------- */
  function initCounters() {
    const counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;
    const animate = (el) => {
      const target = parseInt(el.getAttribute("data-count"), 10) || 0;
      const duration = 1600;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
    };
    const obs = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((c) => obs.observe(c));
  }

  /* ---------------- Destination interactions (modal) ---------------- */
  const DESTINATION_DATA = {
    dubai: {
      name: "Dubai",
      loc: "United Arab Emirates",
      img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop",
      desc: "A city of record-breaking skylines and desert calm within the same afternoon — where souks, sea views and skyscrapers sit a short taxi ride apart.",
      best: "November – March",
      duration: "4–6 days",
      exp: "Desert safari, Burj Khalifa, dhow cruise",
    },
    maldives: {
      name: "Maldives",
      loc: "Indian Ocean",
      img: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=1200&auto=format&fit=crop",
      desc: "Overwater villas, house-reef snorkelling and water so clear it makes the horizon hard to find. Built for slow mornings and quiet evenings.",
      best: "November – April",
      duration: "4–7 days",
      exp: "Overwater stays, snorkelling, sunset cruise",
    },
    bali: {
      name: "Bali",
      loc: "Indonesia",
      img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200&auto=format&fit=crop",
      desc: "Rice terraces, cliffside temples and a coastline that shifts character from Uluwatu to Ubud. Easy to slow down in, easy to keep exploring.",
      best: "April – October",
      duration: "5–7 days",
      exp: "Ubud rice terraces, temple visits, surf towns",
    },
    switzerland: {
      name: "Switzerland",
      loc: "Central Europe",
      img: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=1200&auto=format&fit=crop",
      desc: "Alpine railways, glacier viewpoints and lakeside towns that look staged but aren't. A trip that runs like the trains do — on time and scenic.",
      best: "June – September",
      duration: "6–9 days",
      exp: "Scenic rail routes, Jungfraujoch, lake towns",
    },
    thailand: {
      name: "Thailand",
      loc: "Southeast Asia",
      img: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1200&auto=format&fit=crop",
      desc: "Bangkok's street-food energy, the limestone islands of the south and temple towns further north — three very different trips in one country.",
      best: "November – February",
      duration: "6–8 days",
      exp: "Island hopping, street food tours, temples",
    },
    europe: {
      name: "Europe",
      loc: "Multi-country",
      img: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1200&auto=format&fit=crop",
      desc: "A classic multi-city route through the continent's old capitals — museums, piazzas and train journeys between them, planned so nothing feels rushed.",
      best: "May – September",
      duration: "10–14 days",
      exp: "Multi-city rail route, museums, old towns",
    },
    kashmir: {
      name: "Kashmir",
      loc: "India",
      img: "https://images.unsplash.com/photo-1566837945700-30057527ade0?q=80&w=1200&auto=format&fit=crop",
      desc: "Houseboats on Dal Lake, pine-covered valleys and mountain passes that open up without warning. India's Himalaya at its most cinematic.",
      best: "March – October",
      duration: "5–7 days",
      exp: "Dal Lake houseboat, Gulmarg, Betaab valley",
    },
    rajasthan: {
      name: "Rajasthan",
      loc: "India",
      img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1200&auto=format&fit=crop",
      desc: "Desert forts, painted havelis and lake palaces across Jodhpur, Udaipur and Jaisalmer. Heritage travel that still feels lived-in, not staged.",
      best: "October – March",
      duration: "6–9 days",
      exp: "Fort cities, desert camps, lake palaces",
    },
    singapore: {
      name: "Singapore",
      loc: "Southeast Asia",
      img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1200&auto=format&fit=crop",
      desc: "A compact, easy-to-navigate city break — hawker centres, garden domes and a skyline that photographs well from almost anywhere.",
      best: "Year-round",
      duration: "3–5 days",
      exp: "Gardens by the Bay, hawker food, Sentosa",
    },
    turkey: {
      name: "Turkey",
      loc: "Europe/Asia",
      img: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1200&auto=format&fit=crop",
      desc: "Istanbul's bazaars and bosphorus views, then Cappadocia's balloon-lit mornings. A short flight between two very different Turkeys.",
      best: "April – June, Sept – Nov",
      duration: "6–8 days",
      exp: "Hot air balloons, Istanbul old city, cave hotels",
    },
  };

  function initDestinationInteractions() {
    const cards = document.querySelectorAll("[data-destination]");
    const overlay = document.getElementById("destModalOverlay");
    if (!overlay) return;
    const media = overlay.querySelector(".dest-modal-media img");
    const loc = overlay.querySelector(".dest-modal-body .loc");
    const title = overlay.querySelector(".dest-modal-body h3");
    const desc = overlay.querySelector(".dest-modal-body .dest-desc");
    const best = overlay.querySelector("[data-fact='best']");
    const duration = overlay.querySelector("[data-fact='duration']");
    const exp = overlay.querySelector("[data-fact='exp']");
    const planBtn = overlay.querySelector("[data-plan-this]");

    function open(key) {
      const d = DESTINATION_DATA[key];
      if (!d) return;
      media.src = d.img;
      media.alt = d.name + " — " + d.loc;
      loc.textContent = d.loc;
      title.textContent = d.name;
      desc.textContent = d.desc;
      best.textContent = d.best;
      duration.textContent = d.duration;
      exp.textContent = d.exp;
      planBtn.setAttribute("data-destination-name", d.name);
      openOverlay(overlay);
    }
    cards.forEach((card) => {
      makeCardActivatable(card, () => open(card.getAttribute("data-destination")));
    });
    wireOverlay(overlay);
    planBtn?.addEventListener("click", () => {
      const name = planBtn.getAttribute("data-destination-name");
      closeOverlay(overlay);
      prefillPlanner(name);
    });
  }

  /* ---------------- Package filter + rail ---------------- */
  function initPackageSlider() {
    const filters = document.querySelectorAll(".pkg-filter");
    const cards = document.querySelectorAll(".pkg-card");
    if (!filters.length) return;
    filters.forEach((btn) => {
      btn.addEventListener("click", () => {
        filters.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const type = btn.getAttribute("data-filter");
        cards.forEach((card) => {
          const match = type === "all" || card.getAttribute("data-type") === type;
          card.style.display = match ? "" : "none";
        });
      });
    });
  }

  /* ---------------- Testimonials carousel ---------------- */
  function initTestimonials() {
    const track = document.querySelector(".testi-slides");
    const slides = document.querySelectorAll(".testi-slide");
    const dotsWrap = document.querySelector(".testi-dots");
    const prevBtn = document.querySelector("[data-testi-prev]");
    const nextBtn = document.querySelector("[data-testi-next]");
    if (!track || !slides.length) return;
    let index = 0;
    let timer;

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "testi-dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", "Show testimonial " + (i + 1));
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = dotsWrap.querySelectorAll(".testi-dot");

    function render() {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle("active", i === index));
    }
    function goTo(i) {
      index = (i + slides.length) % slides.length;
      render();
      restart();
    }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }
    function restart() {
      clearInterval(timer);
      timer = setInterval(next, 6000);
    }
    nextBtn?.addEventListener("click", next);
    prevBtn?.addEventListener("click", prev);

    const wrap = document.querySelector(".testi-wrap");
    wrap?.addEventListener("mouseenter", () => clearInterval(timer));
    wrap?.addEventListener("mouseleave", restart);

    // Swipe
    let startX = 0;
    track.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX), { passive: true });
    track.addEventListener(
      "touchend",
      (e) => {
        const diff = e.changedTouches[0].clientX - startX;
        if (diff > 40) prev();
        else if (diff < -40) next();
      },
      { passive: true }
    );

    render();
    restart();
  }

  /* ---------------- FAQ accordion ---------------- */
  function initFAQ() {
    const items = document.querySelectorAll(".faq-item");
    items.forEach((item) => {
      const btn = item.querySelector(".faq-q");
      const answer = item.querySelector(".faq-a");
      btn.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        items.forEach((other) => {
          other.classList.remove("open");
          other.querySelector(".faq-a").style.maxHeight = null;
          other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          item.classList.add("open");
          answer.style.maxHeight = answer.scrollHeight + "px";
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  /* ---------------- Validation helpers ---------------- */
  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }
  function isValidPhone(v) {
    return /^[0-9+\-\s()]{7,16}$/.test(v.trim());
  }

  /* ---------------- Hero trip planner (mini form) ---------------- */
  function initHeroPlanner() {
    const form = document.getElementById("heroPlannerForm");
    if (!form) return;
    const msg = document.getElementById("plannerMsg");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const dest = document.getElementById("plannerDestination").value.trim();
      if (!dest) {
        showMsg("Please enter a destination to continue.", "error");
        return;
      }
      const formDestInput = document.getElementById("fullDestination");
      if (formDestInput) formDestInput.value = dest;
      showMsg("Great — scroll down to complete your travel request below.", "success");
      setTimeout(() => {
        document.getElementById("tripPlanner")?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    });
    function showMsg(text, type) {
      msg.textContent = text;
      msg.className = "planner-msg show " + type;
    }
  }

  /* ---------------- Full trip planner form ---------------- */
  function initTripPlanner() {
    const form = document.getElementById("tripPlannerForm");
    if (!form) return;
    const modalOverlay = document.getElementById("successModalOverlay");
    const submitBtn = form.querySelector("[type='submit']");

    const fields = {
      fullName: { validate: (v) => v.trim().length >= 2, error: "Please enter your full name." },
      phone: { validate: isValidPhone, error: "Please enter a valid phone number." },
      email: { validate: isValidEmail, error: "Please enter a valid email address." },
      fullDestination: { validate: (v) => v.trim().length >= 2, error: "Please tell us where you'd like to go." },
      travelDate: { validate: (v) => v.trim().length > 0, error: "Please select a travel date." },
      travelers: { validate: (v) => Number(v) > 0, error: "Please enter number of travelers." },
    };

    function fieldWrap(name) {
      return document.querySelector(`[data-field-wrap='${name}']`);
    }
    function showError(name, message) {
      const wrap = fieldWrap(name);
      const err = wrap?.querySelector(".form-error");
      if (err) err.textContent = message || "";
    }
    Object.keys(fields).forEach((name) => {
      const el = form.elements[name];
      el?.addEventListener("input", () => showError(name, ""));
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      Object.entries(fields).forEach(([name, rule]) => {
        const el = form.elements[name];
        if (!el) return;
        const ok = rule.validate(el.value);
        showError(name, ok ? "" : rule.error);
        if (!ok) valid = false;
      });
      if (!valid) return;

      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";

      // No backend configured — simulate a brief processing delay, then confirm.
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = "Create My Trip Plan";
        openOverlay(modalOverlay);
        form.reset();
      }, 900);
    });

    wireOverlay(modalOverlay);
  }

  /* ---------------- Newsletter ---------------- */
  function initNewsletter() {
    const form = document.getElementById("newsletterForm");
    if (!form) return;
    const msg = document.getElementById("newsletterMsg");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input[type='email']");
      if (!isValidEmail(input.value)) {
        msg.textContent = "Please enter a valid email address.";
        msg.style.color = "#f0a58e";
        return;
      }
      msg.textContent = "You're subscribed — thank you!";
      msg.style.color = "var(--teal)";
      form.reset();
    });
  }

  /* ---------------- WhatsApp guided assistant ---------------- */
  function initWhatsAppAssistant() {
    const fab = document.getElementById("waFab");
    const win = document.getElementById("waWindow");
    const closeBtn = document.getElementById("waClose");
    const minimizeBtn = document.getElementById("waMinimize");
    const resetBtn = document.getElementById("waReset");
    const body = document.getElementById("waBody");
    const inputRow = document.getElementById("waInputRow");
    const textInput = document.getElementById("waTextInput");
    if (!fab || !win) return;

    const STEPS = [
      { key: "type", prompt: "What kind of journey are you planning?", options: ["International", "Domestic", "Honeymoon", "Family", "Luxury", "Adventure"] },
      { key: "destination", prompt: "Where would you like to go?", freeText: true, placeholder: "e.g. Maldives, Europe…" },
      { key: "date", prompt: "When are you planning to travel?", freeText: true, placeholder: "e.g. December 2026" },
      { key: "travelers", prompt: "How many travelers?", freeText: true, placeholder: "e.g. 2 adults" },
      { key: "budget", prompt: "Would you like to share your approximate budget?", options: ["Under ₹50,000", "₹50,000 – ₹1,50,000", "Above ₹1,50,000", "Prefer not to say"] },
      { key: "notes", prompt: "Anything else you'd like us to know?", freeText: true, placeholder: "Optional — type or skip", optional: true },
    ];

    let stepIndex = 0;
    const answers = {};
    let started = false;

    function timeNow() {
      return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    function addMessage(text, from) {
      const div = document.createElement("div");
      div.className = "wa-msg " + from;
      div.innerHTML = `<span></span><time></time>`;
      div.querySelector("span").textContent = text;
      div.querySelector("time").textContent = timeNow();
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
    }
    function addQuickReplies(options) {
      const wrap = document.createElement("div");
      wrap.className = "wa-quick";
      options.forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = opt;
        btn.addEventListener("click", () => handleAnswer(opt));
        wrap.appendChild(btn);
      });
      body.appendChild(wrap);
      body.scrollTop = body.scrollHeight;
    }
    function showTyping(cb) {
      const t = document.createElement("div");
      t.className = "wa-typing";
      t.innerHTML = "<span></span><span></span><span></span>";
      body.appendChild(t);
      body.scrollTop = body.scrollHeight;
      setTimeout(() => {
        t.remove();
        cb();
      }, 700);
    }
    function askStep() {
      const step = STEPS[stepIndex];
      if (!step) return finish();
      showTyping(() => {
        addMessage(step.prompt, "bot");
        if (step.options) addQuickReplies(step.optional ? [...step.options, "Skip"] : step.options);
        if (step.freeText) {
          textInput.placeholder = step.placeholder || "Type your answer…";
          textInput.style.display = "";
        } else {
          textInput.style.display = "none";
        }
        textInput.focus();
      });
    }
    function handleAnswer(value) {
      const step = STEPS[stepIndex];
      if (!step) return;
      if (value !== "Skip") {
        addMessage(value, "user");
        answers[step.key] = value;
      } else {
        addMessage("Skip", "user");
      }
      stepIndex += 1;
      askStep();
    }
    function finish() {
      textInput.style.display = "none";
      showTyping(() => {
        addMessage(
          "Perfect! I have the basic details for your trip. Would you like to continue with our travel team on WhatsApp?",
          "bot"
        );
        const wrap = document.createElement("div");
        wrap.className = "wa-quick";
        const btn = document.createElement("a");
        btn.className = "btn btn-primary btn-sm";
        btn.target = "_blank";
        btn.rel = "noopener";
        btn.href = buildWhatsAppLink();
        btn.innerHTML = "Continue on WhatsApp →";
        wrap.appendChild(btn);
        body.appendChild(wrap);
        body.scrollTop = body.scrollHeight;
      });
    }
    function buildWhatsAppLink() {
      const lines = [
        "Hi DreamSky Holiday! I'd like to plan a trip.",
        answers.type ? `Journey type: ${answers.type}` : null,
        answers.destination ? `Destination: ${answers.destination}` : null,
        answers.date ? `Travel date: ${answers.date}` : null,
        answers.travelers ? `Travelers: ${answers.travelers}` : null,
        answers.budget ? `Budget: ${answers.budget}` : null,
        answers.notes ? `Notes: ${answers.notes}` : null,
      ].filter(Boolean);
      const text = encodeURIComponent(lines.join("\n"));
      return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
    }

    function openWindow() {
      win.classList.add("open");
      fab.setAttribute("aria-expanded", "true");
      if (!started) {
        started = true;
        showTyping(() => {
          addMessage("Hi! Welcome to DreamSky Holiday. I can help you start planning your next trip.", "bot");
          askStep();
        });
      }
    }
    function closeWindow() {
      win.classList.remove("open");
      fab.setAttribute("aria-expanded", "false");
    }
    function resetChat() {
      body.innerHTML = "";
      stepIndex = 0;
      Object.keys(answers).forEach((k) => delete answers[k]);
      started = false;
      openWindow();
    }

    fab.addEventListener("click", () => (win.classList.contains("open") ? closeWindow() : openWindow()));
    closeBtn?.addEventListener("click", closeWindow);
    minimizeBtn?.addEventListener("click", closeWindow);
    resetBtn?.addEventListener("click", resetChat);

    inputRow?.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = textInput.value.trim();
      if (!val) return;
      textInput.value = "";
      handleAnswer(val);
    });
  }

  /* ---------------- Back to top ---------------- */
  function initBackToTop() {
    const btn = document.getElementById("backTop");
    if (!btn) return;
    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > 500) btn.classList.add("show");
        else btn.classList.remove("show");
      },
      { passive: true }
    );
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---------------- Hero flight path (draw dynamically) ---------------- */
  function initHeroPath() {
    const svg = document.getElementById("heroPathSvg");
    if (!svg) return;
    const path = svg.querySelector("path");
    if (path && path.getTotalLength) {
      const len = path.getTotalLength();
      path.style.strokeDasharray = "6 8";
    }
  }

  /* ---------------- Init all ---------------- */

  /* ============================================================
     Shared modal helpers (scroll lock, ESC, focus return)
     ============================================================ */
  let modalStack = [];
  let lastFocused = null;

  function lockScroll() {
    if (modalStack.length > 1) return;
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (sbw > 0) document.body.style.paddingRight = sbw + "px";
  }
  function unlockScroll() {
    if (modalStack.length) return;
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  }
  function openOverlay(overlay) {
    if (!overlay || overlay.classList.contains("open")) return;
    lastFocused = document.activeElement;
    modalStack.push(overlay);
    overlay.classList.add("open");
    lockScroll();
    const focusable = overlay.querySelector("[data-close-modal], button, a[href]");
    setTimeout(() => focusable && focusable.focus({ preventScroll: true }), 60);
  }
  function closeOverlay(overlay) {
    if (!overlay) return;
    overlay.classList.remove("open");
    overlay.scrollTop = 0;
    modalStack = modalStack.filter((o) => o !== overlay);
    unlockScroll();
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus({ preventScroll: true });
      lastFocused = null;
    }
  }
  function wireOverlay(overlay) {
    if (!overlay) return;
    overlay.querySelectorAll("[data-close-modal]").forEach((el) =>
      el.addEventListener("click", () => closeOverlay(overlay))
    );
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeOverlay(overlay);
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalStack.length) {
      closeOverlay(modalStack[modalStack.length - 1]);
    }
  });

  function makeCardActivatable(el, handler) {
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "button");
    el.addEventListener("click", handler);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handler(e);
      }
    });
  }

  function prefillPlanner(value) {
    const destInput = document.getElementById("plannerDestination");
    const formDestInput = document.getElementById("fullDestination");
    if (destInput) destInput.value = value;
    if (formDestInput) formDestInput.value = value;
    const target = document.getElementById("trip-planner") || document.getElementById("tripPlanner");
    setTimeout(() => target && target.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
  }

  /* ============================================================
     Package detail popup
     ============================================================ */
  function initPackageModal() {
    const overlay = document.getElementById("pkgModalOverlay");
    const DATA = window.PACKAGE_DATA || {};
    if (!overlay) return;

    const el = (k) => overlay.querySelector('[data-pkg="' + k + '"]');
    const tabs = overlay.querySelectorAll("[data-pkgtab]");
    const panels = overlay.querySelectorAll("[data-pkgpanel]");
    const planBtn = overlay.querySelector("[data-pkg-plan]");
    const waBtn = overlay.querySelector("[data-pkg-whatsapp]");
    const bodyScroll = overlay.querySelector(".pkg-modal-body");
    let current = null;

    function showTab(name) {
      tabs.forEach((t) => {
        const on = t.getAttribute("data-pkgtab") === name;
        t.classList.toggle("active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
      panels.forEach((pn) => {
        pn.hidden = pn.getAttribute("data-pkgpanel") !== name;
      });
      if (bodyScroll) bodyScroll.scrollTop = 0;
    }
    tabs.forEach((t) =>
      t.addEventListener("click", () => showTab(t.getAttribute("data-pkgtab")))
    );

    function open(key) {
      const d = DATA[key];
      if (!d) return;
      current = d;

      const img = el("img");
      img.src = d.img;
      img.alt = d.name + " — " + d.loc;
      el("tag").textContent = d.tag;
      el("name").textContent = d.name;
      el("loc").textContent = d.loc;
      el("duration").textContent = d.duration;
      el("duration2").textContent = d.duration;
      el("nights").textContent = d.nights;
      el("best").textContent = d.best;
      el("idealFor").textContent = d.idealFor;
      el("summary").textContent = d.summary;
      el("price").textContent = d.price;
      el("priceNote").textContent = d.priceNote;

      el("highlights").innerHTML = d.highlights
        .map((h) => "<li>" + esc(h) + "</li>")
        .join("");
      el("inclusions").innerHTML = d.inclusions
        .map((h) => "<li>" + esc(h) + "</li>")
        .join("");
      el("exclusions").innerHTML = d.exclusions
        .map((h) => "<li>" + esc(h) + "</li>")
        .join("");
      el("itinerary").innerHTML = d.itinerary
        .map(
          (it) =>
            '<li class="itin-step"><span class="itin-dot"></span>' +
            '<span class="itin-day">' + esc(it.day) + "</span>" +
            "<h6>" + esc(it.title) + "</h6>" +
            "<p>" + esc(it.text) + "</p></li>"
        )
        .join("");

      if (waBtn) {
        const msg =
          "Hello DreamSky Holiday, I'd like details for the " +
          d.name + " package (" + d.duration + ").";
        waBtn.href =
          "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg);
      }

      showTab("overview");
      openOverlay(overlay);
    }

    planBtn &&
      planBtn.addEventListener("click", () => {
        const name = current ? current.name : "";
        closeOverlay(overlay);
        prefillPlanner(name);
      });

    document.querySelectorAll("[data-package]").forEach((card) => {
      makeCardActivatable(card, () => open(card.getAttribute("data-package")));
    });

    wireOverlay(overlay);
  }

  /* ============================================================
     Blog article popup
     ============================================================ */
  function initBlogModal() {
    const overlay = document.getElementById("blogModalOverlay");
    const DATA = window.BLOG_DATA || {};
    if (!overlay) return;

    const el = (k) => overlay.querySelector('[data-blog="' + k + '"]');
    const scroller = overlay.querySelector(".blog-modal-body");

    function render(body) {
      return body
        .map((b) => {
          if (b.type === "h") return "<h4>" + esc(b.text) + "</h4>";
          if (b.type === "list")
            return "<ul>" + b.items.map((i) => "<li>" + esc(i) + "</li>").join("") + "</ul>";
          return "<p>" + esc(b.text) + "</p>";
        })
        .join("");
    }

    function open(key) {
      const d = DATA[key];
      if (!d) return;
      const img = el("img");
      img.src = d.img;
      img.alt = d.title;
      el("category").textContent = d.category;
      el("date").textContent = d.date;
      el("read").textContent = d.read;
      el("title").textContent = d.title;
      el("body").innerHTML = render(d.body);
      if (scroller) scroller.scrollTop = 0;
      openOverlay(overlay);
    }

    document.querySelectorAll("[data-post]").forEach((card) => {
      makeCardActivatable(card, () => open(card.getAttribute("data-post")));
    });

    wireOverlay(overlay);
  }

  /* ============================================================
     Policy tabs (Booking / Cancellation / Terms section)
     ============================================================ */
  function initPolicyTabs() {
    const tabs = document.querySelectorAll(".policy-tab");
    const panels = document.querySelectorAll(".policy-panel");
    if (!tabs.length) return;

    function show(name) {
      tabs.forEach((t) => {
        const on = t.getAttribute("data-policy") === name;
        t.classList.toggle("active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
      panels.forEach((p) => {
        p.hidden = p.getAttribute("data-panel") !== name;
      });
    }

    tabs.forEach((t, i) => {
      t.addEventListener("click", () => show(t.getAttribute("data-policy")));
      t.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault();
        const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
        next.focus();
        show(next.getAttribute("data-policy"));
      });
    });

    // Deep links from the footer open the right tab
    document.querySelectorAll("[data-policy-tab]").forEach((link) => {
      link.addEventListener("click", () => {
        const name = link.getAttribute("data-policy-tab");
        show(name);
        const active = document.querySelector('.policy-tab[data-policy="' + name + '"]');
        if (active && active.scrollIntoView) {
          active.scrollIntoView({ block: "nearest", inline: "center" });
        }
      });
    });

    // Support #policies-booking style hashes too
    const hash = (location.hash || "").replace("#", "");
    if (hash.indexOf("policies-") === 0) show(hash.replace("policies-", ""));
  }

  function esc(str) {
    return String(str).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }

  document.addEventListener("DOMContentLoaded", function () {
    initPreloader();
    initNavigation();
    initScrollAnimations();
    initCounters();
    initDestinationInteractions();
    initPackageSlider();
    initPackageModal();
    initBlogModal();
    initPolicyTabs();
    initTestimonials();
    initFAQ();
    initHeroPlanner();
    initTripPlanner();
    initNewsletter();
    initWhatsAppAssistant();
    initBackToTop();
    initHeroPath();

    // Set current year in footer
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });
})();
