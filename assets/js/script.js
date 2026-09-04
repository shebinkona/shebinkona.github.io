(function ($) {
  "use strict";

  /* Add future LinkedIn post IDs here. The posts section stays hidden while empty. */
  const linkedInProfile = "https://www.linkedin.com/in/shebin-koonathethil-kunhimohammed-375a4b2b/";
  const linkedInPostIds = [];

  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const shareTitle = "Shebin Koonathethil — Business Analyst & BI Professional";
  let qrInstance = null;

  function portfolioUrl() {
    return window.location.href.split("#")[0];
  }

  function initSeoUrl() {
    const url = portfolioUrl();
    $("#canonicalUrl").attr("href", url);
    $("meta[property='og:url']").attr("content", url);
  }

  function initTheme() {
    const savedTheme = localStorage.getItem("shebin-theme");
    setTheme(savedTheme === "dark" ? "dark" : "light");

    $(".theme-toggle").on("click", function () {
      const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
      setTheme(nextTheme);
      localStorage.setItem("shebin-theme", nextTheme);
    });
  }

  function setTheme(theme) {
    root.dataset.theme = theme;
    const isDark = theme === "dark";
    $("meta[name='theme-color']").attr("content", isDark ? "#1d181e" : "#5b3e5c");
    $(".theme-toggle")
      .attr("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme")
      .find("i")
      .attr("class", isDark ? "bi bi-sun" : "bi bi-moon-stars");
  }

  function initProfileImage() {
    const image = document.getElementById("profileImage");
    if (!image) return;
    const frame = image.closest(".portrait-frame");
    const showImage = () => frame.classList.add("has-image");
    const keepFallback = () => frame.classList.remove("has-image");
    image.addEventListener("load", showImage);
    image.addEventListener("error", keepFallback);
    if (image.complete) image.naturalWidth ? showImage() : keepFallback();
  }

  function initNavigation() {
    const $header = $("#siteHeader");
    const $backToTop = $("#backToTop");
    const updateScrollState = () => {
      $header.toggleClass("is-scrolled", window.scrollY > 16);
      $backToTop.toggleClass("show", window.scrollY > 600);
    };
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    $("a[href^='#']").on("click", function (event) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const $target = $(targetId);
      if (!$target.length) return;
      event.preventDefault();
      const headerHeight = Number.parseFloat(getComputedStyle(root).getPropertyValue("--header-height")) || 0;
      const top = Math.max(0, $target.offset().top - headerHeight + 1);
      if (reducedMotion.matches) window.scrollTo(0, top);
      else $("html, body").stop().animate({ scrollTop: top }, 520);

      const menu = document.getElementById("mainNav");
      if (menu && menu.classList.contains("show") && window.bootstrap) {
        bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    });

    $backToTop.on("click", function () {
      if (reducedMotion.matches) window.scrollTo(0, 0);
      else $("html, body").stop().animate({ scrollTop: 0 }, 550);
    });

    const sections = document.querySelectorAll("main section[id]");
    if ("IntersectionObserver" in window) {
      const navObserver = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const id = visible.target.id;
        $(".nav-link").removeClass("active").removeAttr("aria-current");
        $(".nav-link[href='#" + id + "']").addClass("active").attr("aria-current", "page");
      }, { rootMargin: "-25% 0px -60%", threshold: [0.05, 0.2, 0.4] });
      sections.forEach((section) => navObserver.observe(section));
    }
  }

  function initReveal() {
    const elements = document.querySelectorAll(".reveal:not(.is-visible)");
    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -35px" });
    elements.forEach((element) => observer.observe(element));
  }

  function initTyping() {
    if (reducedMotion.matches) return;
    const text = document.getElementById("typingText");
    if (!text) return;
    const phrases = [
      "Turning business requirements into practical solutions.",
      "Transforming data into management-ready insight.",
      "Connecting people, processes, data and technology.",
      "Automating workflows. Improving decisions."
    ];
    let phraseIndex = 0;
    window.setInterval(() => {
      phraseIndex = (phraseIndex + 1) % phrases.length;
      text.animate([{ opacity: 1 }, { opacity: 0 }, { opacity: 1 }], { duration: 650, easing: "ease" });
      window.setTimeout(() => { text.textContent = phrases[phraseIndex]; }, 320);
    }, 4200);
  }

  function initWorkControls() {
    const $cards = $(".work-card");
    const $empty = $("#workEmpty");

    $("#workSearch").on("input", function () {
      const term = $.trim($(this).val().toLowerCase());
      let matches = 0;
      $cards.each(function () {
        const haystack = (($(this).data("search") || "") + " " + $(this).text()).toLowerCase();
        const isMatch = !term || haystack.includes(term);
        this.hidden = !isMatch;
        if (isMatch) matches += 1;
      });
      $empty.prop("hidden", matches !== 0);
    });

    $("#expandAll").on("click", function () {
      $cards.filter(":not([hidden])").prop("open", true);
    });
    $("#collapseAll").on("click", function () {
      $cards.prop("open", false);
    });
  }

  function showToast(message) {
    const toast = document.getElementById("shareToast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand("copy");
    field.remove();
    if (!copied) throw new Error("Copy unavailable");
  }

  function prepareShareLinks() {
    const url = encodeURIComponent(portfolioUrl());
    const message = encodeURIComponent(shareTitle);
    $("#shareLinkedIn").attr("href", "https://www.linkedin.com/sharing/share-offsite/?url=" + url);
    $("#shareWhatsApp").attr("href", "https://wa.me/?text=" + message + "%20" + url);
    $("#shareEmail").attr("href", "mailto:?subject=" + message + "&body=" + message + "%0A%0A" + url);
  }

  function openShareFallback() {
    prepareShareLinks();
    if (window.bootstrap) bootstrap.Modal.getOrCreateInstance(document.getElementById("shareModal")).show();
  }

  async function sharePortfolio() {
    const data = { title: document.title, text: shareTitle, url: portfolioUrl() };
    if (navigator.share) {
      try { await navigator.share(data); return; }
      catch (error) { if (error.name === "AbortError") return; }
    }
    openShareFallback();
  }

  function initShare() {
    prepareShareLinks();
    $(".share-portfolio").on("click", sharePortfolio);
    $("#copyLink").on("click", async function () {
      try {
        await copyText(portfolioUrl());
        showToast("Portfolio link copied");
        if (window.bootstrap) bootstrap.Modal.getInstance(document.getElementById("shareModal"))?.hide();
      } catch (error) {
        showToast("Copy the address from your browser to share");
      }
    });
  }

  function ensureQrCode() {
    const container = document.getElementById("qrCode");
    if (!container || qrInstance || typeof QRCode === "undefined") return;
    qrInstance = new QRCode(container, {
      text: portfolioUrl(),
      width: 220,
      height: 220,
      colorDark: "#3f2a43",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
  }

  function qrDataUrl() {
    ensureQrCode();
    const canvas = document.querySelector("#qrCode canvas");
    const image = document.querySelector("#qrCode img");
    if (canvas) return canvas.toDataURL("image/png");
    return image ? image.src : "";
  }

  function downloadQr() {
    const dataUrl = qrDataUrl();
    if (!dataUrl) { showToast("QR code is still loading"); return; }
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "shebin-koonathethil-portfolio-qr.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async function shareQr() {
    const dataUrl = qrDataUrl();
    if (dataUrl && navigator.share && navigator.canShare) {
      try {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], "shebin-koonathethil-portfolio-qr.png", { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ title: shareTitle, text: "Scan to view Shebin Koonathethil’s portfolio.", files: [file] });
          return;
        }
      } catch (error) {
        if (error.name === "AbortError") return;
      }
    }
    await sharePortfolio();
  }

  function initQr() {
    const modal = document.getElementById("qrModal");
    modal?.addEventListener("show.bs.modal", ensureQrCode);
    $(".download-qr").on("click", function () { ensureQrCode(); window.setTimeout(downloadQr, 80); });
    $(".share-qr").on("click", function () { ensureQrCode(); window.setTimeout(shareQr, 80); });
  }

  function initLinkedIn() {
    $(".linkedin-cta").toggle(Boolean(linkedInProfile)).attr("href", linkedInProfile || "#");
    const $section = $("#linkedinPosts");
    if (!linkedInPostIds.length) {
      $section.prop("hidden", true).hide();
      return;
    }
    const posts = linkedInPostIds.map((id) => {
      const safeId = String(id).replace(/[^a-zA-Z0-9_-]/g, "");
      return '<iframe src="https://www.linkedin.com/embed/feed/update/urn:li:share:' + safeId + '" title="LinkedIn post by Shebin Koonathethil" loading="lazy" allowfullscreen></iframe>';
    }).join("");
    $("#linkedinPostGrid").html(posts);
    $section.prop("hidden", false).show();
  }

  $(function () {
    initSeoUrl();
    initTheme();
    initProfileImage();
    initNavigation();
    initReveal();
    initTyping();
    initWorkControls();
    initShare();
    initQr();
    initLinkedIn();
    $("#currentYear").text(new Date().getFullYear());
  });
})(jQuery);
