(function () {
  "use strict";

  // Coordonnées de l'agence
  var WHATSAPP = "33641478339";

  var biens = window.MONIMO_BIENS || [];
  var fmt = new Intl.NumberFormat("fr-FR");

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function prix(b) {
    if (b.prix == null) return "Prix sur demande";
    return fmt.format(b.prix) + " KMF" + (b.transaction === "location" ? " / mois" : "");
  }
  function label(b) { return b.transaction === "vente" ? "À vendre" : "À louer"; }
  function lieu(b) {
    return (b.quartier && b.quartier !== b.ville ? b.quartier + ", " : "") + b.ville + " · " + b.ile;
  }
  function wa(text) { return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(text); }

  function card(b, i) {
    return (
      '<button class="listing" type="button" style="--i:' + (i || 0) + '" data-id="' + esc(b.id) + '">' +
        '<div class="listing__media">' +
          '<img src="' + esc(b.image) + '" alt="' + esc(b.titre) + '" loading="lazy">' +
          '<span class="tag' + (b.transaction === "vente" ? " tag--vente" : "") + '">' + label(b) + "</span>" +
        "</div>" +
        '<div class="listing__body">' +
          '<div class="listing__type">' + esc(b.type) + (b.surface ? " · " + esc(b.surface) : "") + "</div>" +
          '<h3 class="listing__title">' + esc(b.titre) + "</h3>" +
          '<div class="listing__place">' + esc(lieu(b)) + "</div>" +
          '<div class="listing__foot"><span class="listing__price">' + prix(b) + '</span><span class="listing__more">Voir la fiche →</span></div>' +
        "</div>" +
      "</button>"
    );
  }

  // ---------- Menu mobile ----------
  var burger = document.querySelector(".burger");
  var links = document.querySelector(".nav__links");
  if (burger && links) {
    burger.addEventListener("click", function () {
      burger.setAttribute("aria-expanded", links.classList.toggle("is-open"));
    });
  }

  // ---------- Fiche bien ----------
  var modal = document.getElementById("bien-modal");
  function openBien(id) {
    var b = biens.find(function (x) { return x.id === id; });
    if (!b || !modal) return;
    var msg = "Bonjour Monimo, je suis intéressé(e) par « " + b.titre + " » (réf. " + b.id + "). Pouvez-vous me donner plus d'informations ?";
    var rows = [["Transaction", label(b)], ["Type", b.type], ["Localisation", lieu(b)]];
    if (b.surface) rows.push(["Surface", b.surface]);
    (b.details || []).forEach(function (d) { rows.push(d); });
    rows.push(["Prix", prix(b)]);
    modal.querySelector(".modal__content").innerHTML =
      '<div class="modal__grid">' +
        '<div class="modal__media"><img src="' + esc(b.image) + '" alt="' + esc(b.titre) + '"></div>' +
        '<div class="modal__body">' +
          '<span class="eyebrow" style="margin-bottom:20px">' + label(b) + " · " + esc(b.type) + "</span>" +
          '<h2 class="display-md">' + esc(b.titre) + "</h2>" +
          "<p>" + esc(b.description) + "</p>" +
          '<dl class="specs">' + rows.map(function (r) { return "<div><dt>" + esc(r[0]) + "</dt><dd>" + esc(r[1]) + "</dd></div>"; }).join("") + "</dl>" +
          '<div class="modal__actions">' +
            '<a class="btn btn--solid" target="_blank" rel="noopener" href="' + wa(msg) + '">Je suis intéressé(e) — WhatsApp</a>' +
            '<a class="btn" href="tel:+' + WHATSAPP + '">Appeler l\'agence</a>' +
          "</div>" +
          '<p class="modal__ref">Référence ' + esc(b.id) + "</p>" +
        "</div>" +
      "</div>";
    modal.showModal();
  }
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest(".modal__close")) modal.close();
    });
  }
  document.addEventListener("click", function (e) {
    var c = e.target.closest(".listing[data-id]");
    if (c) openBien(c.getAttribute("data-id"));
  });

  // ---------- Compteurs + sélection en accueil ----------
  document.querySelectorAll("[data-count]").forEach(function (el) {
    var t = el.getAttribute("data-count");
    var n = biens.filter(function (b) { return t === "all" || b.transaction === t; }).length;
    el.textContent = n + (n > 1 ? " biens" : " bien");
  });
  var featured = document.getElementById("featured");
  if (featured) featured.innerHTML = biens.slice(0, 3).map(card).join("");

  // ---------- Page « Biens disponibles » ----------
  var list = document.getElementById("biens-list");
  if (list) {
    var params = new URLSearchParams(location.search);
    var t0 = params.get("type");
    var state = { transaction: t0 === "location" || t0 === "vente" ? t0 : "all", q: "", type: "all", ile: "all" };
    var tabs = document.querySelectorAll(".tabs button");
    var typeSel = document.getElementById("f-type");
    var ileSel = document.getElementById("f-ile");
    var qInput = document.getElementById("f-q");
    var count = document.getElementById("biens-count");

    function fill(sel, key) {
      Array.from(new Set(biens.map(function (b) { return b[key]; }))).sort().forEach(function (v) {
        var o = document.createElement("option"); o.value = v; o.textContent = v; sel.appendChild(o);
      });
    }
    fill(typeSel, "type");
    fill(ileSel, "ile");

    function render() {
      var q = state.q.trim().toLowerCase();
      var res = biens.filter(function (b) {
        if (state.transaction !== "all" && b.transaction !== state.transaction) return false;
        if (state.type !== "all" && b.type !== state.type) return false;
        if (state.ile !== "all" && b.ile !== state.ile) return false;
        if (q && [b.titre, b.ville, b.quartier, b.type, b.id].join(" ").toLowerCase().indexOf(q) === -1) return false;
        return true;
      });
      count.textContent = res.length + (res.length > 1 ? " biens disponibles" : " bien disponible");
      var quoi = state.transaction === "location" ? "à louer" : state.transaction === "vente" ? "à acheter" : "";
      list.innerHTML = res.length ? res.map(card).join("") :
        '<div class="empty"><h3 class="display-md">Aucun bien ' + (quoi ? quoi + " " : "") + "publié pour le moment</h3>" +
        '<p class="muted">De nouveaux biens nous sont confiés régulièrement. Dites-nous ce que vous cherchez, nous vous recontactons.</p>' +
        '<a class="btn btn--solid" target="_blank" rel="noopener" href="' + wa("Bonjour Monimo, je cherche un bien " + quoi + " : ") + '">Nous écrire sur WhatsApp</a></div>';
      tabs.forEach(function (t) { t.setAttribute("aria-selected", t.dataset.value === state.transaction); });
      var url = new URL(location.href);
      if (state.transaction === "all") url.searchParams.delete("type"); else url.searchParams.set("type", state.transaction);
      history.replaceState(null, "", url);
    }
    tabs.forEach(function (t) { t.addEventListener("click", function () { state.transaction = t.dataset.value; render(); }); });
    typeSel.addEventListener("change", function () { state.type = typeSel.value; render(); });
    ileSel.addEventListener("change", function () { state.ile = ileSel.value; render(); });
    qInput.addEventListener("input", function () { state.q = qInput.value; render(); });
    render();
  }

  // ---------- Formulaire -> WhatsApp ----------
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var txt = "Bonjour Monimo,\nJe m'appelle " + d.get("nom") + ".\nProjet : " + d.get("projet") + "\n" +
        (d.get("tel") ? "Téléphone : " + d.get("tel") + "\n" : "") + "\n" + d.get("message");
      window.open(wa(txt), "_blank", "noopener");
    });
  }

  // ---------- Animations : parallaxe & apparitions ----------
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "IntersectionObserver" in window) {
    // Calque de fond du hero (déplacé plus lentement que la page)
    var hero = document.querySelector(".hero");
    var heroBg = null, heroInner = null;
    var heroImage = hero ? getComputedStyle(hero).backgroundImage : "none";
    document.documentElement.classList.add("js-anim");
    if (hero) {
      heroBg = document.createElement("div");
      heroBg.className = "hero__bg";
      heroBg.setAttribute("aria-hidden", "true");
      heroBg.style.backgroundImage = heroImage;
      heroBg.style.backgroundSize = "cover";
      heroBg.style.backgroundPosition = "center";
      var zoom = document.createElement("div");
      zoom.className = "hero__zoom";
      heroBg.appendChild(zoom);
      hero.insertBefore(heroBg, hero.firstChild);
      heroInner = hero.querySelector(".hero__inner");
    }

    // Éléments qui apparaissent au défilement, en cascade dans un même bloc
    var targets = document.querySelectorAll(
      ".path, .section .eyebrow, .section .heading, .section .display-md, .section .section__head .btn," +
      ".section p, .features li, .split .btn, .service, .split__media, .contact-list, .form, .toolbar, .footer__grid > div"
    );
    var groups = new Map();
    targets.forEach(function (el) {
      if (el.closest(".listing") || el.closest(".modal") || el.closest(".form")) return;
      var parent = el.closest(".container") || document.body;
      var n = groups.get(parent) || 0;
      groups.set(parent, n + 1);
      el.setAttribute("data-reveal", "");
      el.style.setProperty("--d", Math.min(n, 6) * 90 + "ms");
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    document.querySelectorAll("[data-reveal]").forEach(function (el) { io.observe(el); });

    // Parallaxe au défilement
    var medias = Array.prototype.slice.call(document.querySelectorAll(".split__media"));
    var ticking = false;
    function parallax() {
      ticking = false;
      var vh = window.innerHeight;
      var sy = window.scrollY;
      if (hero && sy < hero.offsetHeight + 100) {
        heroBg.style.transform = "translate3d(0," + (sy * 0.35).toFixed(1) + "px,0)";
        if (heroInner) {
          heroInner.style.transform = "translate3d(0," + (sy * 0.18).toFixed(1) + "px,0)";
          heroInner.style.opacity = Math.max(0, 1 - sy / (hero.offsetHeight * 0.85)).toFixed(3);
        }
      }
      medias.forEach(function (m) {
        var r = m.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var progress = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2); // -1 → 1
        m.style.setProperty("--py", (progress * -6).toFixed(2) + "%");
      });
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(parallax); } }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    parallax();
  }

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
