(function () {
  "use strict";

  // Coordonnées de l'agence
  var TEL = "+33565305763";
  var TEL_AFFICHE = "05 65 30 57 63";
  var PLAN = "https://www.google.com/maps/search/?api=1&query=Dubernet+Immobilier+78+rue+Henry+Puget+46000+Cahors";

  var biens = window.DUBERNET_BIENS || [];
  var fmt = new Intl.NumberFormat("fr-FR");

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function prix(b) { return b.prix == null ? "Prix sur demande" : fmt.format(b.prix) + " €"; }
  function lieu(b) { return b.commune + (b.secteur ? " · " + b.secteur : ""); }
  function resume(b) {
    var parts = [];
    if (b.pieces) parts.push(b.pieces + " pièces");
    if (b.surface) parts.push(b.surface);
    if (b.terrain) parts.push("terrain " + b.terrain);
    return parts.join(" · ");
  }

  function card(b, i) {
    return (
      '<button class="listing" type="button" style="--i:' + (i || 0) + '" data-id="' + esc(b.id) + '">' +
        '<div class="listing__media">' +
          '<img src="' + esc(b.image) + '" alt="' + esc(b.titre) + '" loading="lazy">' +
          '<span class="tag">' + esc(b.type) + "</span>" +
        "</div>" +
        '<div class="listing__body">' +
          '<div class="listing__type">' + esc(resume(b)) + "</div>" +
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
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) { links.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); }
    });
  }

  // ---------- Fiche bien ----------
  var modal = document.getElementById("bien-modal");
  function openBien(id) {
    var b = biens.find(function (x) { return x.id === id; });
    if (!b || !modal) return;
    var rows = [["Type", b.type], ["Localisation", lieu(b)]];
    if (b.surface) rows.push(["Surface habitable", b.surface]);
    if (b.terrain) rows.push(["Terrain", b.terrain]);
    if (b.pieces) rows.push(["Pièces", String(b.pieces)]);
    (b.details || []).forEach(function (d) { rows.push(d); });
    rows.push(["Prix", prix(b)]);
    var specs = rows.map(function (r) { return "<div><dt>" + esc(r[0]) + "</dt><dd>" + esc(r[1]) + "</dd></div>"; }).join("");
    if (b.dpe) specs += '<div><dt>DPE</dt><dd><span class="dpe dpe--' + esc(b.dpe) + '">' + esc(b.dpe) + "</span></dd></div>";
    modal.querySelector(".modal__content").innerHTML =
      '<div class="modal__grid">' +
        '<div class="modal__media"><img src="' + esc(b.image) + '" alt="' + esc(b.titre) + '"></div>' +
        '<div class="modal__body">' +
          '<span class="eyebrow" style="margin-bottom:20px">À vendre · ' + esc(b.type) + "</span>" +
          '<h2 class="display-md">' + esc(b.titre) + "</h2>" +
          "<p>" + esc(b.description) + "</p>" +
          '<dl class="specs">' + specs + "</dl>" +
          '<div class="modal__actions">' +
            '<a class="btn btn--solid" href="tel:' + TEL + '">Demander une visite — ' + TEL_AFFICHE + "</a>" +
            '<a class="btn" target="_blank" rel="noopener" href="' + PLAN + '">Passer à l\'agence</a>' +
          "</div>" +
          '<p class="modal__ref">Référence ' + esc(b.id) + " · Prix honoraires inclus</p>" +
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
    var n = biens.length;
    el.textContent = n + (n > 1 ? " biens" : " bien");
  });
  var featured = document.getElementById("featured");
  if (featured) featured.innerHTML = biens.slice(0, 3).map(card).join("");

  // ---------- Page « Biens à vendre » ----------
  var list = document.getElementById("biens-list");
  if (list) {
    var params = new URLSearchParams(location.search);
    var state = { type: params.get("type") || "all", commune: "all", budget: "all", q: "" };
    var comSel = document.getElementById("f-commune");
    var budSel = document.getElementById("f-budget");
    var qInput = document.getElementById("f-q");
    var count = document.getElementById("biens-count");
    var tabs = document.querySelectorAll(".tabs button");

    Array.from(new Set(biens.map(function (b) { return b.commune; }))).sort(function (a, b) { return a.localeCompare(b, "fr"); }).forEach(function (v) {
      var o = document.createElement("option"); o.value = v; o.textContent = v; comSel.appendChild(o);
    });

    function render() {
      var q = state.q.trim().toLowerCase();
      var max = state.budget === "all" ? Infinity : Number(state.budget);
      var res = biens.filter(function (b) {
        if (state.type !== "all" && b.type !== state.type) return false;
        if (state.commune !== "all" && b.commune !== state.commune) return false;
        if (max !== Infinity && (b.prix == null || b.prix > max)) return false;
        if (q && [b.titre, b.commune, b.secteur, b.type, b.id].join(" ").toLowerCase().indexOf(q) === -1) return false;
        return true;
      });
      count.textContent = res.length + (res.length > 1 ? " biens à vendre" : " bien à vendre");
      list.innerHTML = res.length ? res.map(card).join("") :
        '<div class="empty"><h3 class="display-md">Aucun bien ne correspond pour le moment</h3>' +
        '<p class="muted">De nouveaux biens nous sont confiés chaque semaine, et certains ne sont jamais publiés. Dites-nous ce que vous cherchez.</p>' +
        '<a class="btn btn--solid" href="tel:' + TEL + '">Appeler l\'agence — ' + TEL_AFFICHE + "</a></div>";
      tabs.forEach(function (t) { t.setAttribute("aria-selected", t.dataset.value === state.type); });
      var url = new URL(location.href);
      if (state.type === "all") url.searchParams.delete("type"); else url.searchParams.set("type", state.type);
      history.replaceState(null, "", url);
    }
    tabs.forEach(function (t) { t.addEventListener("click", function () { state.type = t.dataset.value; render(); }); });
    comSel.addEventListener("change", function () { state.commune = comSel.value; render(); });
    budSel.addEventListener("change", function () { state.budget = budSel.value; render(); });
    qInput.addEventListener("input", function () { state.q = qInput.value; render(); });
    render();
  }

  // ---------- Animations : parallaxe & apparitions ----------
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "IntersectionObserver" in window) {
    // Calque de fond détaché pour un bloc plein cadre (hero, bandeau)
    function layer(section, cls, zoom) {
      if (!section) return null;
      var bg = document.createElement("div");
      bg.className = cls;
      bg.setAttribute("aria-hidden", "true");
      bg.style.backgroundImage = getComputedStyle(section).backgroundImage;
      bg.style.backgroundSize = "cover";
      bg.style.backgroundPosition = "center";
      if (zoom) {
        var z = document.createElement("div");
        z.className = "hero__zoom";
        bg.appendChild(z);
      }
      section.insertBefore(bg, section.firstChild);
      return bg;
    }
    var hero = document.querySelector(".hero");
    var heroBg = layer(hero, "hero__bg", true);
    var heroInner = hero && hero.querySelector(".hero__inner");
    var band = document.querySelector(".band");
    var bandBg = layer(band, "band__bg", false);
    var bandInner = band && band.querySelector(".band__inner");
    var towns = document.querySelector(".towns__track");
    // Ajouté après la lecture des images : le CSS retire alors le fond d'origine
    document.documentElement.classList.add("js-anim");

    // Éléments qui apparaissent au défilement, en cascade dans un même bloc
    var targets = document.querySelectorAll(
      ".path, .stat, .section .eyebrow, .section .heading, .section .display-md, .section .section__head .btn," +
      ".section p, .features li, .split .btn, .service, .split__media, .contact-list, .map, .toolbar, .footer__grid > div," +
      ".band .eyebrow, .band .display, .band p, .band .btn"
    );
    var groups = new Map();
    targets.forEach(function (el) {
      if (el.closest(".listing") || el.closest(".modal")) return;
      var parent = el.closest(".container") || el.closest(".band") || document.body;
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
    function inView(el, vh) { var r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < vh ? r : null; }
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
      var r;
      if (band && (r = inView(band, vh))) {
        var p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2); // -1 → 1
        bandBg.style.transform = "translate3d(0," + (p * -18).toFixed(2) + "%,0)";
        if (bandInner) bandInner.style.transform = "translate3d(0," + (p * 40).toFixed(1) + "px,0)";
      }
      if (towns && (r = inView(towns, vh))) {
        towns.style.transform = "translate3d(" + (-(vh - r.top) * 0.35).toFixed(1) + "px,0,0)";
      }
      medias.forEach(function (m) {
        var mr = inView(m, vh);
        if (!mr) return;
        var progress = (mr.top + mr.height / 2 - vh / 2) / (vh / 2 + mr.height / 2);
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
