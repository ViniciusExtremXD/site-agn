/* ============================================================
   AGN Extintores — main.js
   Menu mobile, slider hero, reveal on scroll, form -> WhatsApp
   ============================================================ */
(function () {
  'use strict';

  var WHATSAPP_NUMBER = '5519993043187';

  /* ---------- Tracking (GA4) ---------- */
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

  /* ---------- Header sticky shadow ---------- */
  var header = document.querySelector('.header');
  window.addEventListener('scroll', function () {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }, { passive: true });

  /* ---------- Menu mobile ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });

  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) {
      nav.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- Link ativo conforme seção visível ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  var sections = links
    .map(function (l) {
      var hash = l.getAttribute('href');
      return hash && hash.charAt(0) === '#' ? document.querySelector(hash) : null;
    })
    .filter(Boolean);

  function syncActiveLink() {
    var pos = window.scrollY + 120;
    var current = sections[0];
    sections.forEach(function (sec) {
      if (sec.offsetTop <= pos) current = sec;
    });
    links.forEach(function (l) {
      l.classList.toggle('is-active', l.getAttribute('href') === '#' + current.id);
    });
  }
  window.addEventListener('scroll', syncActiveLink, { passive: true });

  /* ---------- Hero slider ---------- */
  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero__slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero__dot'));
  var current = 0;
  var AUTO_MS = 6000;
  var timer = null;

  function goTo(idx) {
    current = (idx + slides.length) % slides.length;
    slides.forEach(function (s, i) { s.classList.toggle('is-active', i === current); });
    dots.forEach(function (d, i) { d.classList.toggle('is-active', i === current); });
  }

  function startAuto() {
    stopAuto();
    timer = setInterval(function () { goTo(current + 1); }, AUTO_MS);
  }
  function stopAuto() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  dots.forEach(function (d) {
    d.addEventListener('click', function () {
      goTo(parseInt(d.getAttribute('data-goto'), 10));
      startAuto(); // reinicia contagem após interação
    });
  });

  var hero = document.getElementById('hero');
  hero.addEventListener('mouseenter', stopAuto);
  hero.addEventListener('mouseleave', startAuto);

  /* ---------- Swipe touch (mobile) ---------- */
  var touchStartX = 0;
  var touchStartY = 0;
  hero.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
    stopAuto();
  }, { passive: true });
  hero.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    var dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      goTo(current + (dx < 0 ? 1 : -1));
    }
    startAuto();
  }, { passive: true });

  startAuto();

  /* ---------- Reveal on scroll ---------- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Form -> WhatsApp ---------- */
  var form = document.getElementById('form-orcamento');
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
      'Nome: ' + nome + '\n' +
      'Telefone: ' + telefone + '\n' +
      'Preciso de: ' + mensagem;

    var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(texto);
    track('submit_orcamento', { form_id: 'form-orcamento' });
    window.open(url, '_blank', 'noopener');
  });

  form.addEventListener('input', function (e) {
    if (e.target.classList.contains('is-invalid') && e.target.value.trim()) {
      e.target.classList.remove('is-invalid');
    }
  });

  /* ---------- Ano do rodapé ---------- */
  document.getElementById('ano').textContent = String(new Date().getFullYear());
})();
