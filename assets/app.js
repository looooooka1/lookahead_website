/* LOOKAHEAD - Interactions partagees.
   Extrait des 17 pages qui dupliquaient ce meme bloc inline (12 333 caracteres chacune).
   Un seul fichier = un seul endroit a modifier, et mise en cache par le CDN. */
/* =========================================================================
   LOOKAHEAD — Interactions
   Objectif : fluidité maximale, aucune animation qui décale la page.
   ========================================================================= */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- NAVIGATION ---------------- */
  var nav = document.querySelector(".nav");
  if (nav) {
    var onScroll = function () { nav.classList.toggle("is-scrolled", window.scrollY > 30); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    var burger = nav.querySelector(".nav__burger");
    var mobile = document.querySelector(".nav__mobile");
    if (burger && mobile) {
      burger.addEventListener("click", function () { mobile.classList.toggle("is-open"); });
      mobile.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () { mobile.classList.remove("is-open"); });
      });
    }
  }

  /* ---------------- REVEAL (apparition, une fois) ---------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if (reduced) {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var ro = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            var el = e.target;
            var d = parseFloat(el.getAttribute("data-delay") || "0");
            setTimeout(function () { el.classList.add("is-visible"); }, d * 1000);
            ro.unobserve(el);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -10% 0px" });
      revealEls.forEach(function (el) { ro.observe(el); });
    }
  }

  /* ---------------- FADE (apparait en descendant, s'estompe en remontant) ---------------- */
  var fadeEls = document.querySelectorAll(".fade");
  if (fadeEls.length) {
    if (reduced) {
      fadeEls.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      var fo = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { e.target.classList.toggle("is-in", e.isIntersecting); });
      }, { threshold: 0.15, rootMargin: "-12% 0px -12% 0px" });
      fadeEls.forEach(function (el) { fo.observe(el); });
    }
  }

  /* ---------------- TIMELINE : remplissage au scroll ---------------- */
  var timeline = document.querySelector(".timeline");
  if (timeline) {
    var fill = timeline.querySelector(".timeline__fill");
    var updateFill = function () {
      var r = timeline.getBoundingClientRect();
      var vh = window.innerHeight;
      var start = vh * 0.7, end = vh * 0.7;
      var total = r.height;
      var scrolled = Math.min(Math.max(start - r.top, 0), total + (start - end));
      var ratio = Math.min(Math.max(scrolled / total, 0), 1);
      if (fill) fill.style.transform = "scaleY(" + ratio + ")";
    };
    window.addEventListener("scroll", updateFill, { passive: true });
    window.addEventListener("resize", updateFill);
    updateFill();
  }

  /* Petit utilitaire : observer de visibilité pour piloter une animation */
  function whenVisible(el, onShow, onHide) {
    if (!el) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.isIntersecting ? onShow() : onHide(); });
    }, { threshold: 0.25 });
    io.observe(el);
  }

  /* ---------------- DÉMO VOICEBOT ---------------- */
  var voice = document.querySelector("[data-voice]");
  if (voice) {
    var SCRIPTS = {
      service: {
        caller: "Appel entrant · 21h47",
        turns: [
          { s: "ia", t: "Agence Lefèvre Immobilier, bonjour. Je suis l'assistante de l'agence, comment puis-je vous aider ?" },
          { s: "client", t: "Bonsoir, je vous appelle pour le trois pièces rue des Capucins, il est toujours disponible ?" },
          { s: "ia", t: "Oui, il est encore au catalogue. Souhaitez-vous que je vous bloque un créneau de visite cette semaine ?" },
          { s: "client", t: "Jeudi en fin de journée si c'est possible." },
          { s: "ia", t: "Jeudi 18h30 est libre. Je vous envoie la confirmation par SMS et je préviens le conseiller. C'est noté." }
        ]
      },
      prospection: {
        caller: "Appel sortant · relance lead",
        turns: [
          { s: "ia", t: "Bonjour Madame Rolland, LOOKAHEAD pour l'agence Lefèvre. Vous aviez estimé votre maison il y a deux mois, vous avez deux minutes ?" },
          { s: "client", t: "Oui, mais je ne suis pas encore sûre de vouloir vendre." },
          { s: "ia", t: "C'est tout à fait normal. Les prix de votre quartier ont bougé depuis. Voulez-vous une réévaluation gratuite, sans engagement ?" },
          { s: "client", t: "Pourquoi pas, ça m'aiderait à décider." },
          { s: "ia", t: "Parfait. Je cale un rendez-vous avec un conseiller mardi 14h et je vous envoie le récapitulatif. Bonne journée à vous." }
        ]
      }
    };

    var vConvo = voice.querySelector(".voice__convo");
    var vCaller = voice.querySelector("[data-voice-caller]");
    var vSpeaking = voice.querySelector(".voice__speaking");
    var vWave = voice.querySelector(".wave");
    var vTabs = voice.querySelectorAll(".voice__tab");

    var mode = "service", turnIdx = 0, wordIdx = 0;
    var vTimer = null, waveTimer = null, visible = false;

    // build wave bars
    if (vWave) { for (var i = 0; i < 28; i++) { var b = document.createElement("span"); vWave.appendChild(b); } }
    var waveBars = vWave ? vWave.querySelectorAll("span") : [];

    function renderVoice() {
      var turns = SCRIPTS[mode].turns;
      vConvo.innerHTML = "";
      for (var ti = 0; ti <= turnIdx && ti < turns.length; ti++) {
        var turn = turns[ti];
        var words = turn.t.split(" ");
        var visibleCount = ti === turnIdx ? wordIdx : words.length;
        var wrap = document.createElement("div");
        wrap.className = "turn " + turn.s;
        var inner = '<div class="turn__wrap"><div class="turn__who">' + (turn.s === "ia" ? "Agent IA" : "Client") + '</div><div class="bubble">';
        for (var w = 0; w < words.length; w++) {
          var cls = "word";
          if (w < visibleCount) cls += " spoken";
          if (ti === turnIdx && w === visibleCount - 1) cls += " speaking";
          inner += '<span class="' + cls + '">' + words[w] + (w < words.length - 1 ? " " : "") + "</span>";
        }
        inner += "</div></div>";
        wrap.innerHTML = inner;
        vConvo.appendChild(wrap);
      }
      vConvo.scrollTop = vConvo.scrollHeight; // ancre en bas, jamais de décalage de page
      var sp = turns[turnIdx] ? turns[turnIdx].s : "ia";
      if (vSpeaking) vSpeaking.textContent = sp === "ia" ? "L'agent parle" : "Le client parle";
    }

    function stepVoice() {
      if (!visible || reduced) return;
      var turns = SCRIPTS[mode].turns;
      var words = turns[turnIdx].t.split(" ");
      if (wordIdx < words.length) {
        var word = words[wordIdx];
        var dur = 130 + Math.min(word.length * 24, 220) + (/[.,!?]$/.test(word) ? 260 : 0);
        wordIdx++;
        renderVoice();
        vTimer = setTimeout(stepVoice, dur);
      } else {
        vTimer = setTimeout(function () {
          if (turnIdx < turns.length - 1) { turnIdx++; wordIdx = 0; renderVoice(); vTimer = setTimeout(stepVoice, 120); }
          else { vTimer = setTimeout(function () { turnIdx = 0; wordIdx = 0; renderVoice(); vTimer = setTimeout(stepVoice, 200); }, 2200); }
        }, 650);
      }
    }

    function animateWave() {
      if (!visible) return;
      for (var k = 0; k < waveBars.length; k++) {
        var h = 20 + Math.abs(Math.sin((k + turnIdx + wordIdx + Date.now() / 220) * 0.9)) * 80;
        waveBars[k].style.height = Math.round(h) + "%";
      }
      waveTimer = setTimeout(animateWave, 180);
    }

    function startVoice() {
      visible = true;
      if (!reduced) { stepVoice(); animateWave(); }
      else { var t = SCRIPTS[mode].turns; turnIdx = t.length - 1; wordIdx = t[turnIdx].t.split(" ").length; renderVoice(); }
    }
    function stopVoice() {
      visible = false;
      clearTimeout(vTimer); clearTimeout(waveTimer);
    }

    vTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        vTabs.forEach(function (t) { t.classList.remove("is-active"); });
        tab.classList.add("is-active");
        mode = tab.getAttribute("data-mode");
        if (vCaller) vCaller.textContent = SCRIPTS[mode].caller;
        clearTimeout(vTimer);
        turnIdx = 0; wordIdx = 0; renderVoice();
        if (visible && !reduced) vTimer = setTimeout(stepVoice, 400);
      });
    });

    if (vCaller) vCaller.textContent = SCRIPTS[mode].caller;
    renderVoice();
    whenVisible(voice, startVoice, stopVoice);
  }

  /* ---------------- DÉMO CHATBOT ---------------- */
  var chat = document.querySelector("[data-chat]");
  if (chat) {
    var CHAT = [
      { f: "bot", t: "Bonjour 👋 Vous cherchez à louer, acheter, ou faire estimer un bien ?" },
      { f: "user", t: "Acheter, un T3 vers le centre." },
      { f: "bot", t: "Parfait. Quel est votre budget maximum, frais inclus ?" },
      { f: "user", t: "Autour de 280 000 €." },
      { f: "bot", t: "Top. J'ai 4 biens qui correspondent. Je vous envoie la sélection par email et je réserve un créneau de visite ?" },
      { f: "user", t: "Oui, samedi matin si possible." },
      { f: "bot", t: "C'est noté pour samedi 10h. Un conseiller vous confirme dans la foulée. À samedi !" }
    ];
    var cBody = chat.querySelector(".chat__body");
    var cCount = 1, cTimer = null, cVisible = false, cTyping = false;

    function renderChat() {
      cBody.innerHTML = "";
      for (var i = 0; i < cCount && i < CHAT.length; i++) {
        var m = CHAT[i];
        var d = document.createElement("div");
        d.className = "cmsg show " + m.f;
        d.innerHTML = '<div class="b">' + m.t + "</div>";
        cBody.appendChild(d);
      }
      if (cTyping) {
        var tp = document.createElement("div");
        tp.className = "cmsg bot show";
        tp.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
        cBody.appendChild(tp);
      }
      cBody.scrollTop = cBody.scrollHeight; // page jamais décalée
    }

    function stepChat() {
      if (!cVisible || reduced) return;
      if (cCount >= CHAT.length) {
        cTimer = setTimeout(function () { cCount = 1; renderChat(); cTimer = setTimeout(stepChat, 900); }, 2600);
        return;
      }
      var next = CHAT[cCount];
      if (next.f === "bot") {
        cTyping = true; renderChat();
        cTimer = setTimeout(function () {
          cTyping = false; cCount++; renderChat();
          cTimer = setTimeout(stepChat, 900);
        }, 1100);
      } else {
        cTimer = setTimeout(function () { cCount++; renderChat(); cTimer = setTimeout(stepChat, 700); }, 600);
      }
    }

    renderChat();
    whenVisible(chat,
      function () { cVisible = true; if (reduced) { cCount = CHAT.length; renderChat(); } else { cTimer = setTimeout(stepChat, 1000); } },
      function () { cVisible = false; clearTimeout(cTimer); }
    );
  }

  /* ---------------- DÉMO AUTOMATISATION ---------------- */
  var auto = document.querySelector("[data-auto]");
  if (auto) {
    var rows = auto.querySelectorAll(".auto__row");
    var aTimer = null, aVisible = false, aI = -1;
    function setActive(n) { rows.forEach(function (r, idx) { r.classList.toggle("on", idx <= n); }); }
    function stepAuto() {
      if (!aVisible || reduced) return;
      aI++;
      if (aI >= rows.length) {
        aTimer = setTimeout(function () { aI = -1; setActive(-1); aTimer = setTimeout(stepAuto, 800); }, 2200);
        return;
      }
      setActive(aI);
      aTimer = setTimeout(stepAuto, 950);
    }
    whenVisible(auto,
      function () { aVisible = true; if (reduced) { setActive(rows.length - 1); } else { aI = -1; setActive(-1); aTimer = setTimeout(stepAuto, 500); } },
      function () { aVisible = false; clearTimeout(aTimer); }
    );
  }

  /* ---------------- Année footer ---------------- */
  var yr = document.querySelector("[data-year]");
  if (yr) yr.textContent = new Date().getFullYear();
})();

/* =========================================================================
   LOOKAHEAD — Composants interactifs v2
   Chaque composant est autonome : s'il n'y a rien à initialiser sur la page,
   il ne fait rien. Aucune dépendance externe.
   ========================================================================= */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- TABSET : le visiteur choisit son cas ---------------- */
  document.querySelectorAll("[data-tabset]").forEach(function (root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll("[role='tab']"));
    if (!tabs.length) return;

    function select(tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.setAttribute("tabindex", on ? "0" : "-1");
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) {
          panel.hidden = !on;
          if (on) animateSurfaces(panel);
        }
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () { select(tab); });
      tab.addEventListener("keydown", function (e) {
        var i = tabs.indexOf(tab);
        var next = null;
        if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
        if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === "Home") next = tabs[0];
        if (e.key === "End") next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); select(next); next.focus(); }
      });
    });
  });

  /* ---------------- SURFACE : les lignes apparaissent en cascade ---------------- */
  function animateSurfaces(scope) {
    (scope || document).querySelectorAll(".surface").forEach(function (surface) {
      var rows = surface.querySelectorAll(".surface__row");
      rows.forEach(function (row) { row.classList.remove("is-in"); });
      if (reduced) {
        rows.forEach(function (row) { row.classList.add("is-in"); });
        return;
      }
      rows.forEach(function (row, i) {
        setTimeout(function () { row.classList.add("is-in"); }, 70 * i);
      });
    });
  }

  var surfaceObserved = document.querySelectorAll(".surface");
  if (surfaceObserved.length) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        animateSurfaces(e.target.parentElement || document);
        so.unobserve(e.target);
      });
    }, { threshold: 0.25 });
    surfaceObserved.forEach(function (s) { so.observe(s); });
  }

  /* ---------------- CALC : le visiteur règle ses propres chiffres ---------------- */
  document.querySelectorAll("[data-calc]").forEach(function (root) {
    var ranges = root.querySelectorAll("input[type='range']");
    if (!ranges.length) return;

    function euros(n) {
      return Math.round(n).toLocaleString("fr-FR");
    }

    function update() {
      var heures = parseFloat(root.querySelector("[data-calc-heures]").value);
      var taux = parseFloat(root.querySelector("[data-calc-taux]").value);
      var personnes = parseFloat(root.querySelector("[data-calc-personnes]").value);

      // Coût annuel du temps passé sur la tâche répétitive.
      // 45 semaines travaillées pour tenir compte des congés et jours fériés.
      var heuresAn = heures * 45 * personnes;
      var coutAn = heuresAn * taux;
      var joursAn = heuresAn / 7;

      root.querySelector("[data-out-heures]").textContent = heures + " h";
      root.querySelector("[data-out-taux]").textContent = taux + " €";
      root.querySelector("[data-out-personnes]").textContent =
        personnes + (personnes > 1 ? " personnes" : " personne");

      root.querySelector("[data-out-cout]").textContent = euros(coutAn);
      root.querySelector("[data-out-heuresan]").textContent = euros(heuresAn) + " h";
      root.querySelector("[data-out-jours]").textContent = euros(joursAn) + " jours";
    }

    ranges.forEach(function (r) { r.addEventListener("input", update); });
    update();
  });

  /* ---------------- SWITCHER : bascule avant / après ---------------- */
  document.querySelectorAll("[data-switcher]").forEach(function (root) {
    var btns = Array.prototype.slice.call(root.querySelectorAll("[role='tab']"));
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        btns.forEach(function (b) {
          var on = b === btn;
          b.setAttribute("aria-selected", on ? "true" : "false");
          var view = document.getElementById(b.getAttribute("aria-controls"));
          if (view) view.hidden = !on;
        });
      });
    });
  });

  /* ---------------- RAIL : sommaire latéral qui suit la lecture ---------------- */
  var rail = document.querySelector("[data-rail]");
  if (rail) {
    var links = Array.prototype.slice.call(rail.querySelectorAll(".rail__link"));
    var sections = links
      .map(function (l) { return document.querySelector(l.getAttribute("href")); })
      .filter(Boolean);

    if (sections.length) {
      var ro = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          links.forEach(function (l) {
            l.classList.toggle("is-current", l.getAttribute("href") === "#" + e.target.id);
          });
        });
      }, { rootMargin: "-20% 0px -70% 0px" });
      sections.forEach(function (s) { ro.observe(s); });
    }
  }

  /* ---------------- ROTATOR : le texte change pendant la lecture ---------------- */
  document.querySelectorAll("[data-rotator]").forEach(function (root) {
    var items = root.querySelectorAll(".rotator__item");
    if (items.length < 2) return;

    var i = 0;
    items[0].classList.add("is-on");

    // Largeur figée sur le mot le plus long : évite que la ligne se réajuste
    // à chaque changement, ce qui ferait sauter le texte autour.
    var widest = 0;
    items.forEach(function (el) { widest = Math.max(widest, el.offsetWidth); });
    if (widest) root.style.minWidth = widest + "px";

    var running = true;
    var delay = parseInt(root.getAttribute("data-rotator"), 10) || 2600;

    function tick() {
      if (!running) return;
      items[i].classList.remove("is-on");
      i = (i + 1) % items.length;
      items[i].classList.add("is-on");
    }
    var timer = setInterval(tick, delay);

    // On arrête quand la page n'est pas visible : rien ne tourne dans le vide.
    document.addEventListener("visibilitychange", function () {
      running = !document.hidden;
    });

    var vo = new IntersectionObserver(function (entries) {
      running = entries[0].isIntersecting && !document.hidden;
    }, { threshold: 0 });
    vo.observe(root);
  });
})();
