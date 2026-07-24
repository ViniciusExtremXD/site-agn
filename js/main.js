/* ============================================================
   AGN Extintores — main.js (Cross-fade & Text Animations)
   ============================================================ */

(function () {
  'use strict';

  var WHATSAPP_NUMBER = '5519993043187';

  /* ---------- GA4 TRACKING ---------- */
  function track(eventName, params) {
    if (typeof gtag === 'function') gtag('event', eventName, params || {});
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (href.indexOf('wa.me') !== -1) {
      track('click_whatsapp', { link_area: link.closest('[id]') ? link.closest('[id]').id : 'geral' });
    } else if (href.indexOf('tel:') === 0) {
      track('click_telefone', { link_area: link.closest('[id]') ? link.closest('[id]').id : 'geral' });
    }
  });

  /* ---------- SCROLL TEXT REVEAL ANIMATIONS ---------- */
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.text-reveal').forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll('.text-reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ---------- BARRA DE PROGRESSO DE SCROLL & HEADER SHADOW ---------- */
  var header = document.getElementById('header');
  var scrollProgress = document.getElementById('scrollProgress');

  window.addEventListener('scroll', function () {
    var scrollY = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', scrollY > 10);

    if (scrollProgress) {
      var winScroll = document.documentElement.scrollTop;
      var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var scrolled = (winScroll / height) * 100;
      scrollProgress.style.width = scrolled + '%';
    }
  }, { passive: true });

  /* ---------- ACTIVE LINK NA ROLAGEM ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var sections = navLinks
    .map(function (link) {
      var hash = link.getAttribute('href');
      return hash && hash.charAt(0) === '#' ? document.querySelector(hash) : null;
    })
    .filter(Boolean);

  function syncNavLinks() {
    var pos = window.scrollY + 120;
    var currentSec = sections[0];
    sections.forEach(function (sec) {
      if (sec.offsetTop <= pos) currentSec = sec;
    });
    navLinks.forEach(function (l) {
      l.classList.toggle('is-active', currentSec && l.getAttribute('href') === '#' + currentSec.id);
    });
  }
  window.addEventListener('scroll', syncNavLinks, { passive: true });

  /* ---------- MENU MOBILE ---------- */
  var burger = document.getElementById('navToggle');
  var nav = document.getElementById('nav');

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('is-open');
        burger.classList.remove('is-open');
      }
    });
  }

  /* ---------- HERO SLIDER COM DISSOLVÊNCIA SUAVE (CROSS-FADE) ---------- */
  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero .slide'));
  var heroPrev = document.getElementById('heroPrev');
  var heroNext = document.getElementById('heroNext');
  var heroDotsContainer = document.getElementById('heroDots');
  var currentHero = 0;
  var HERO_AUTO_MS = 6000;
  var heroTimer = null;

  function renderHeroDots() {
    if (!heroDotsContainer || !slides.length) return;
    heroDotsContainer.innerHTML = '';
    slides.forEach(function (_, i) {
      var dot = document.createElement('span');
      dot.className = 'hero-dot-item' + (i === currentHero ? ' is-active' : '');
      dot.addEventListener('click', function () {
        goToHero(i);
        startHeroAuto();
      });
      heroDotsContainer.appendChild(dot);
    });
  }

  function goToHero(idx) {
    if (!slides.length) return;
    currentHero = (idx + slides.length) % slides.length;
    slides.forEach(function (s, i) {
      var active = i === currentHero;
      s.classList.toggle('is-active', active);
      if (active) {
        s.querySelectorAll('.text-reveal').forEach(function (el) {
          el.classList.remove('is-visible');
          void el.offsetWidth; // Force reflow
          el.classList.add('is-visible');
        });
      }
    });
    renderHeroDots();
  }

  function startHeroAuto() {
    stopHeroAuto();
    heroTimer = setInterval(function () { goToHero(currentHero + 1); }, HERO_AUTO_MS);
  }

  function stopHeroAuto() {
    if (heroTimer) { clearInterval(heroTimer); heroTimer = null; }
  }

  if (heroPrev) {
    heroPrev.addEventListener('click', function () {
      goToHero(currentHero - 1);
      startHeroAuto();
    });
  }

  if (heroNext) {
    heroNext.addEventListener('click', function () {
      goToHero(currentHero + 1);
      startHeroAuto();
    });
  }

  var heroSection = document.getElementById('home');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopHeroAuto);
    heroSection.addEventListener('mouseleave', startHeroAuto);
    renderHeroDots();
    startHeroAuto();
  }

  /* ---------- CARROSSEL EXECUTIVO DE PRODUTOS ---------- */
  var trackEl = document.getElementById('prodTrack');
  var prevBtn = document.getElementById('prodPrev');
  var nextBtn = document.getElementById('prodNext');
  var dotsContainer = document.getElementById('prodDots');

  if (trackEl && prevBtn && nextBtn) {
    var cards = Array.prototype.slice.call(trackEl.querySelectorAll('.card-product'));
    var prodIndex = 0;

    function getCardsPerView() {
      var w = window.innerWidth;
      if (w <= 640) return 1;
      if (w <= 992) return 2;
      return 3;
    }

    function getMaxIndex() {
      var perView = getCardsPerView();
      return Math.max(0, cards.length - perView);
    }

    function updateDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      var maxIdx = getMaxIndex();
      for (var i = 0; i <= maxIdx; i++) {
        (function (index) {
          var dot = document.createElement('span');
          dot.className = 'dot-indicator' + (index === prodIndex ? ' is-active' : '');
          dot.addEventListener('click', function () {
            prodIndex = index;
            renderCarousel();
          });
          dotsContainer.appendChild(dot);
        })(i);
      }
    }

    function renderCarousel() {
      var maxIdx = getMaxIndex();
      if (prodIndex > maxIdx) prodIndex = maxIdx;
      if (prodIndex < 0) prodIndex = 0;

      var cardWidth = cards[0].offsetWidth + 24; // Largura + gap
      trackEl.style.transform = 'translateX(-' + (prodIndex * cardWidth) + 'px)';
      updateDots();
    }

    prevBtn.addEventListener('click', function () {
      prodIndex = Math.max(0, prodIndex - 1);
      renderCarousel();
    });

    nextBtn.addEventListener('click', function () {
      prodIndex = Math.min(getMaxIndex(), prodIndex + 1);
      renderCarousel();
    });

    window.addEventListener('resize', renderCarousel, { passive: true });
    renderCarousel();

    /* Touch Swipe */
    var touchStartX = 0;
    trackEl.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    trackEl.addEventListener('touchend', function (e) {
      var diffX = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(diffX) > 40) {
        if (diffX < 0) {
          prodIndex = Math.min(getMaxIndex(), prodIndex + 1);
        } else {
          prodIndex = Math.max(0, prodIndex - 1);
        }
        renderCarousel();
      }
    }, { passive: true });
  }

  /* ---------- FORM -> WHATSAPP ---------- */
  var form = document.getElementById('form-orcamento');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nome = form.elements.nome.value.trim();
      var telefone = form.elements.telefone.value.trim();
      var mensagem = form.elements.mensagem.value.trim();

      var valid = true;
      [form.elements.nome, form.elements.telefone, form.elements.mensagem].forEach(function (field) {
        var ok = field.value.trim().length > 0;
        field.classList.toggle('is-invalid', !ok);
        if (!ok) valid = false;
      });
      if (!valid) return;

      var texto =
        'Olá! Vim pelo site da AGN Extintores.\n' +
        '• Nome: ' + nome + '\n' +
        '• Telefone: ' + telefone + '\n' +
        '• Solicitação: ' + mensagem;

      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(texto);
      track('submit_orcamento', { form_id: 'form-orcamento' });
      window.open(url, '_blank', 'noopener');
    });

    form.addEventListener('input', function (e) {
      if (e.target.classList.contains('is-invalid') && e.target.value.trim()) {
        e.target.classList.remove('is-invalid');
      }
    });
  }

  /* ---------- ANO NO RODAPÉ ---------- */
  var anoEl = document.getElementById('ano');
  if (anoEl) anoEl.textContent = String(new Date().getFullYear());

})();
