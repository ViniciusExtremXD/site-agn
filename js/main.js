/* ============================================================
   AGN Extintores — REDESIGN MODERN & MOTION DESIGN (main.js)
   - Canvas Ember Physics Engine
   - Animated Counter Engine
   - 3D Tilt Effect
   - Interactive Quote Simulator Widget
   - Product Category Filtering
   - Scroll Progress & Reveal Animations
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

  /* ---------- SCROLL PROGRESS & HEADER SHADOW ---------- */
  var header = document.querySelector('.header');
  var scrollProgress = document.getElementById('scrollProgress');

  window.addEventListener('scroll', function () {
    var scrollY = window.scrollY;
    header.classList.toggle('is-scrolled', scrollY > 10);

    if (scrollProgress) {
      var winScroll = document.documentElement.scrollTop;
      var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var scrolled = (winScroll / height) * 100;
      scrollProgress.style.width = scrolled + '%';
    }
  }, { passive: true });

  /* ---------- MOBILE MENU ---------- */
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

  /* ---------- CANVAS EMBER PHYSICS ENGINE ---------- */
  var canvas = document.getElementById('emberCanvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var embers = [];
    var emberCount = 35;

    function resizeCanvas() {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function Ember() {
      this.reset();
    }

    Ember.prototype.reset = function () {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + Math.random() * 50;
      this.radius = Math.random() * 3 + 1;
      this.speedY = Math.random() * 1.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.alpha = Math.random() * 0.7 + 0.3;
      this.decay = Math.random() * 0.003 + 0.001;
      var colors = ['#D90429', '#FF5964', '#FF8800', '#FFAA00'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    };

    Ember.prototype.update = function () {
      this.y -= this.speedY;
      this.x += Math.sin(this.y * 0.02) * 0.5 + this.speedX;
      this.alpha -= this.decay;

      if (this.alpha <= 0 || this.y < -10) {
        this.reset();
      }
    };

    Ember.prototype.draw = function () {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 12;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    for (var i = 0; i < emberCount; i++) {
      var e = new Ember();
      e.y = Math.random() * canvas.height;
      embers.push(e);
    }

    function animateEmbers() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      embers.forEach(function (ember) {
        ember.update();
        ember.draw();
      });
      requestAnimationFrame(animateEmbers);
    }
    animateEmbers();
  }

  /* ---------- ANIMATED COUNTER ENGINE ---------- */
  function animateCounters() {
    var counters = document.querySelectorAll('.counter:not(.counted)');
    counters.forEach(function (counter) {
      var target = parseInt(counter.getAttribute('data-target'), 10);
      var prefix = counter.getAttribute('data-prefix') || '';
      var suffix = counter.getAttribute('data-suffix') || '';
      var duration = 2000;
      var startTime = null;

      function step(currentTime) {
        if (!startTime) startTime = currentTime;
        var progress = Math.min((currentTime - startTime) / duration, 1);
        var easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        var currentVal = Math.floor(easeProgress * target);
        counter.textContent = prefix + currentVal + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          counter.textContent = prefix + target + suffix;
          counter.classList.add('counted');
        }
      }

      requestAnimationFrame(step);
    });
  }

  /* ---------- INTERSECTION OBSERVER REVEALS ---------- */
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');

          if (entry.target.id === 'metricas' || entry.target.querySelector('.counter')) {
            animateCounters();
          }
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .strip').forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(function (el) {
      el.classList.add('is-visible');
    });
    animateCounters();
  }

  /* ---------- 3D CARD TILT EFFECT ---------- */
  var tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;

      var rotateX = ((y - centerY) / centerY) * -6;
      var rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-6px)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  /* ---------- PRODUCT CATEGORY FILTER ---------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var productCards = document.querySelectorAll('.card--produto');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var category = btn.getAttribute('data-filter');

      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      productCards.forEach(function (card) {
        var cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });

  /* ---------- SIMULADOR RÁPIDO DE ORÇAMENTO WIDGET ---------- */
  var selectedService = 'Recarga de Extintores';
  var selectedEnv = 'Empresa / Indústria';
  var amountInput = document.getElementById('calcAmount');
  var amountVal = document.getElementById('calcAmountVal');
  var summaryText = document.getElementById('calcSummaryText');
  var calcSubmitBtn = document.getElementById('calcSubmitBtn');

  function updateCalcSummary() {
    var amount = amountInput ? amountInput.value : 5;
    if (amountVal) amountVal.textContent = amount + ' extintores / itens';
    if (summaryText) summaryText.textContent = amount + 'x ' + selectedService + ' para ' + selectedEnv;
  }

  document.querySelectorAll('#calcOptions .calc-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      document.querySelectorAll('#calcOptions .calc-chip').forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');
      selectedService = chip.getAttribute('data-val');
      updateCalcSummary();
    });
  });

  document.querySelectorAll('#calcEnv .calc-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      document.querySelectorAll('#calcEnv .calc-chip').forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');
      selectedEnv = chip.getAttribute('data-val');
      updateCalcSummary();
    });
  });

  if (amountInput) {
    amountInput.addEventListener('input', updateCalcSummary);
  }

  if (calcSubmitBtn) {
    calcSubmitBtn.addEventListener('click', function () {
      var amount = amountInput ? amountInput.value : 5;
      var msg = 'Olá! Vim pelo simulador do site da AGN Extintores.\n' +
        'Gostaria de um orçamento para:\n' +
        '• Item: ' + selectedService + '\n' +
        '• Quantidade: ' + amount + '\n' +
        '• Tipo de imóvel: ' + selectedEnv;

      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);
      track('submit_simulador', { service: selectedService, env: selectedEnv, amount: amount });
      window.open(url, '_blank', 'noopener');
    });
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
        'Olá! Vim pelo formulário do site da AGN Extintores.\n' +
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

  /* ---------- WA TOOLTIP CLOSE ---------- */
  var waClose = document.getElementById('waTooltipClose');
  var waTooltip = document.getElementById('waTooltip');
  if (waClose && waTooltip) {
    waClose.addEventListener('click', function () {
      waTooltip.style.display = 'none';
    });
  }

  /* ---------- ANO NO RODAPÉ ---------- */
  var anoEl = document.getElementById('ano');
  if (anoEl) anoEl.textContent = String(new Date().getFullYear());

})();
