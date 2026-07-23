/* ============================================================
   AGN Extintores — main.js (Limpo, Executivo e Sem Exageros)
   ============================================================ */

(function () {
  'use strict';

  var WHATSAPP_NUMBER = '5519993043187';

  /* ---------- TRACKING (GA4) ---------- */
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

  /* ---------- HEADER SCROLL SHADOW ---------- */
  var header = document.querySelector('.header');
  window.addEventListener('scroll', function () {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  }, { passive: true });

  /* ---------- MENU MOBILE ---------- */
  var burger = document.getElementById('burger');
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

  /* ---------- HERO SLIDER ---------- */
  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero__slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero__dot'));
  var current = 0;
  var AUTO_MS = 6000;
  var timer = null;

  function goTo(idx) {
    if (!slides.length) return;
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
      startAuto();
    });
  });

  var hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('mouseenter', stopAuto);
    hero.addEventListener('mouseleave', startAuto);
    startAuto();
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
