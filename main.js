(function () {
  "use strict";

  /* ---------------- i18n ---------------- */
  var translations = {
    fr: {
      subtitle: "Compositeur · Producteur · Paris",
      nav_info: "Infos",
      bio: "Bienvenue dans mon portfolio. Je m’appelle Constantin. En tant que compositeur et producteur, je travaille sur divers projets originaux : supervision musicale, compositions et arrangements pour d’autres musiciens. Je travaille essentiellement avec des synthétiseurs, mon violon et le logiciel Ableton, avec une prédilection pour la manipulation de samples. Ma double formation en management et en musicologie me permet de penser les projets musicaux sur leurs deux fronts : l’exigence artistique et les enjeux stratégiques d’une commande. N’hésitez pas à me contacter pour toute question ou envie de collaboration.",
      education_label: "Formation",
      contact_label: "Contact",
      spotify_cta: "Écouter sur Spotify",
      play: "Lecture",
      pause: "Pause",
      coming_soon: "Vidéo à venir",
      back_to_top: "Haut de page"
    },
    en: {
      subtitle: "Composer · Producer · Paris",
      nav_info: "Info",
      bio: "Welcome to my portfolio. My name is Constantin, I’m a French composer and producer. I take on a range of original projects, from sound supervision to composition and arranging for other musicians. I work primarily with synthesizers, violin, and computer music, with a particular love for sample manipulation. With a background in both management and musicology, I understand music projects from both angles: the art itself and the strategy behind the brief. Feel free to reach out if you have any questions or would like to collaborate!",
      education_label: "Education",
      contact_label: "Contact",
      spotify_cta: "Listen on Spotify",
      play: "Play",
      pause: "Pause",
      coming_soon: "Video coming soon",
      back_to_top: "Back to top"
    }
  };

  var STORAGE_KEY = "clov-lang";

  function detectDefaultLang() {
    var saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "fr") return saved;
    return "fr";
  }

  function applyLang(lang) {
    var dict = translations[lang] || translations.fr;
    document.documentElement.setAttribute("lang", lang);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.textContent = dict[key];
    });

    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria");
      if (dict[key] !== undefined) el.setAttribute("aria-label", dict[key]);
    });

    var langToggle = document.getElementById("langToggle");
    if (langToggle) langToggle.classList.toggle("is-en", lang === "en");

    var backToTop = document.getElementById("backToTop");
    if (backToTop) backToTop.setAttribute("aria-label", dict.back_to_top);

    document.querySelectorAll(".player").forEach(function (player) {
      var btn = player.querySelector(".play-btn");
      if (!btn || btn.disabled) return;
      var isPlaying = btn.classList.contains("is-playing");
      btn.setAttribute("aria-label", isPlaying ? dict.pause : dict.play);
    });

    window.localStorage.setItem(STORAGE_KEY, lang);
  }

  function initLangToggle() {
    var toggle = document.getElementById("langToggle");
    if (!toggle) return;
    var current = detectDefaultLang();
    applyLang(current);

    toggle.addEventListener("click", function () {
      current = current === "fr" ? "en" : "fr";
      applyLang(current);
    });
  }

  /* ---------------- Audio players ---------------- */
  function initPlayers() {
    var players = document.querySelectorAll(".player[data-audio]");

    players.forEach(function (player) {
      var audioUrl = player.getAttribute("data-audio");
      var waveformEl = player.querySelector(".waveform");
      var btn = player.querySelector(".play-btn");
      var playIcon = player.querySelector(".icon--play");
      var pauseIcon = player.querySelector(".icon--pause");

      if (!waveformEl || !btn || typeof window.WaveSurfer === "undefined") return;

      var wavesurfer = window.WaveSurfer.create({
        container: waveformEl,
        waveColor: "#c9c9c9",
        progressColor: "#1e1e1e",
        cursorColor: "transparent",
        barWidth: 2,
        barGap: 2,
        barRadius: 1,
        height: 40,
        normalize: true,
        url: audioUrl
      });

      function setPlayingState(isPlaying) {
        btn.classList.toggle("is-playing", isPlaying);
        if (playIcon) playIcon.hidden = isPlaying;
        if (pauseIcon) pauseIcon.hidden = !isPlaying;
        var lang = document.documentElement.getAttribute("lang") || "fr";
        var dict = translations[lang] || translations.fr;
        btn.setAttribute("aria-label", isPlaying ? dict.pause : dict.play);
      }

      btn.addEventListener("click", function () {
        wavesurfer.playPause();
      });

      wavesurfer.on("play", function () { setPlayingState(true); });
      wavesurfer.on("pause", function () { setPlayingState(false); });
      wavesurfer.on("finish", function () { setPlayingState(false); });
    });
  }

  /* ---------------- Back to top ---------------- */
  function initBackToTop() {
    var btn = document.getElementById("backToTop");
    if (!btn) return;

    function onScroll() {
      btn.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.6);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLangToggle();
    initPlayers();
    initBackToTop();
  });
})();
