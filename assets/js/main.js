// Athenum: efeitos do site. Todas as páginas funcionam sem este arquivo e sem o GSAP.
(function () {
  'use strict';
  var WA = '5521976649091';

  // Portfólio: fonte única da home (3 primeiros) e de /cases.html (todos).
  // Para publicar um case, preencha um item e coloque a imagem em assets/img/cases/ (webp, 4:5, ~900px de largura).
  // Ex.: { cliente: 'Nordelli', servico: 'Site e tráfego pago', img: '/assets/img/cases/nordelli.webp', resultado: 'Pedidos online desde a primeira semana', url: '' }
  var CASES = [];

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var calmo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mouse = window.matchMedia('(pointer: fine)').matches;
  var esc = function (s) { var d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; };

  // remove a abertura do DOM depois da animação de CSS
  setTimeout(function () { var l = $('.loader'); if (l) l.remove(); }, calmo ? 0 : 2300);

  // header sólido fora do topo; WhatsApp flutuante some em cima do contato
  var header = $('.site-header'), fab = $('.whatsapp-float'), contato = $('#contato');
  function onScroll() {
    header.classList.toggle('solid', window.scrollY > 40);
    if (fab && contato) {
      var r = contato.getBoundingClientRect();
      fab.classList.toggle('hide', r.top < window.innerHeight * 0.8 && r.bottom > 0);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // menu mobile
  var toggle = $('.nav-toggle');
  function menu(open) {
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }
  toggle.addEventListener('click', function () { menu(!document.body.classList.contains('menu-open')); });
  $$('.nav-links a').forEach(function (a) { a.addEventListener('click', function () { menu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') menu(false); });

  // formulário: monta a mensagem e abre o WhatsApp
  var form = $('#form-contato');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements;
    var txt = 'Olá! Vim pelo site da Athenum.\n\nNome: ' + f.nome.value.trim();
    if (f.empresa.value.trim()) txt += '\nEmpresa: ' + f.empresa.value.trim();
    txt += '\nInteresse: ' + f.servico.value;
    if (f.mensagem.value.trim()) txt += '\n\n' + f.mensagem.value.trim();
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(txt), '_blank', 'noopener');
  });

  // portfólio: renderiza os cases (sem cases, fica o card "Em breve" do HTML)
  $$('[data-cases]').forEach(function (grid) {
    var lim = +grid.dataset.cases || CASES.length;
    if (!CASES.length) return;
    grid.innerHTML = CASES.slice(0, lim).map(function (c) {
      var tag = c.url ? 'a href="' + esc(c.url) + '"' : 'article';
      return '<' + tag + ' class="case reveal">' +
        '<div class="case__img"><img src="' + esc(c.img) + '" alt="' + esc(c.cliente) + '" loading="lazy" width="900" height="1125"></div>' +
        '<div class="case__body"><span class="eyebrow">' + esc(c.servico) + '</span><h3>' + esc(c.cliente) + '</h3>' +
        (c.resultado ? '<p class="case__res">' + esc(c.resultado) + '</p>' : '') + '</div></' + (c.url ? 'a' : 'article') + '>';
    }).join('');
  });

  // céu de estrelas atrás do conteúdo; pausa com a aba escondida
  (function () {
    var cv = $('#starfield'); if (!cv) return;
    var ctx = cv.getContext('2d'), stars = [], w, h, raf;
    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = [];
      for (var i = 0, n = Math.floor(w * h / (w < 700 ? 12000 : 8000)); i < n; i++)
        stars.push({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.2 + 0.3, a: Math.random() * 0.5 + 0.15, p: Math.random() * 6.28, s: Math.random() * 0.0015 + 0.0004, d: Math.random() * 0.04 + 0.01 });
    }
    function draw(t) {
      ctx.clearRect(0, 0, w, h); ctx.fillStyle = '#efefef';
      stars.forEach(function (s) {
        ctx.globalAlpha = Math.max(0, Math.min(1, calmo ? s.a : s.a + Math.sin(t * s.s + s.p) * 0.25));
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.28); ctx.fill();
        if (!calmo) { s.y -= s.d * 0.06; if (s.y < -5) s.y = h + 5; }
      });
      ctx.globalAlpha = 1;
      if (!calmo && !document.hidden) raf = requestAnimationFrame(draw);
    }
    size(); draw(0);
    window.addEventListener('resize', size);
    document.addEventListener('visibilitychange', function () { cancelAnimationFrame(raf); if (!document.hidden) draw(performance.now()); });
  })();

  // cursor: ponto colado no mouse e anel que segue; o loop para quando o anel alcança o ponto
  if (mouse && !calmo) (function () {
    var dot = document.createElement('div'), ring = document.createElement('div');
    dot.className = 'cursor-dot'; ring.className = 'cursor-ring';
    document.body.append(dot, ring);
    var mx = 0, my = 0, rx = 0, ry = 0, raf = 0;
    function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
      raf = Math.abs(mx - rx) + Math.abs(my - ry) > 0.5 ? requestAnimationFrame(loop) : 0;
    }
    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
      dot.style.opacity = ring.style.opacity = '1';
      if (!raf) raf = requestAnimationFrame(loop);
    });
    document.addEventListener('mouseleave', function () { dot.style.opacity = ring.style.opacity = '0'; });
    document.addEventListener('mouseover', function (e) {
      ring.classList.toggle('cursor-ring--active', !!e.target.closest('a, button, input, textarea, select, .card, .servico, .case'));
    });
  })();

  // reveal com IntersectionObserver (vale com ou sem GSAP)
  var io = 'IntersectionObserver' in window && !calmo ? new IntersectionObserver(function (en) {
    en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }) : null;
  $$('.reveal').forEach(function (el) { if (io) io.observe(el); else el.classList.add('in-view'); });

  // daqui para baixo, só movimento: precisa do GSAP e de quem não pediu menos movimento
  window.addEventListener('load', function () {
    if (calmo || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    var desktop = window.matchMedia('(min-width:900px)').matches;

    // rolagem suave (Lenis) sincronizada com o ScrollTrigger, só no desktop
    var lenis = null;
    if (window.Lenis && desktop) {
      lenis = new Lenis({ lerp: 0.1 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    // serviços: rolagem horizontal presa no desktop
    var hz = null, track = $('.servicos__track');
    if (desktop && track) {
      document.documentElement.classList.add('hz-on');
      hz = gsap.to(track, { x: function () { return -(track.scrollWidth - window.innerWidth); }, ease: 'none',
        scrollTrigger: { trigger: '.servicos', start: 'top top', end: function () { return '+=' + (track.scrollWidth - window.innerWidth); }, scrub: 0.8, pin: true, invalidateOnRefresh: true } }).scrollTrigger;
    }

    // âncoras da mesma página: painéis da rolagem horizontal precisam do ponto certo
    $$('a[href^="/#"], a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (location.pathname !== '/' && location.pathname !== '/index.html') return;
        var t = $(a.getAttribute('href').replace(/^\//, '')); if (!t) return;
        e.preventDefault();
        var y = t.getBoundingClientRect().top + window.scrollY - (t.id === 'servicos' ? 0 : 70);
        var paineis = $$('.servico');
        if (hz && paineis.indexOf(t) > -1) y = hz.start + (hz.end - hz.start) * paineis.indexOf(t) / (paineis.length - 1);
        if (hz && t.id === 'servicos') y = hz.start;
        if (lenis) lenis.scrollTo(y); else window.scrollTo({ top: y, behavior: 'smooth' });
      });
    });

    // topo: título sobe letra por letra e a coruja entra
    var h1 = $('.hero h1');
    if (h1) {
      h1.setAttribute('aria-label', h1.textContent);
      h1.innerHTML = h1.textContent.split(' ').map(function (w) {
        return '<span class="w" aria-hidden="true">' + w.split('').map(function (c) { return '<span class="ch">' + c + '</span>'; }).join('') + '</span>';
      }).join(' ');
      var t0 = $('.loader') ? 1.6 : 0.1;
      gsap.from('.hero h1 .ch', { yPercent: 110, duration: 1, ease: 'power4.out', stagger: 0.012, delay: t0 });
      gsap.from('.hero .eyebrow, .hero .lead, .hero-actions', { y: 24, opacity: 0, duration: 1, stagger: 0.12, delay: t0 + 0.4 });
      gsap.from('.hero__owl', { scale: 0.85, opacity: 0, duration: 1.6, ease: 'power3.out', delay: t0 });
    }

    // parallax
    if (desktop) $$('[data-speed]').forEach(function (el) {
      gsap.to(el, { yPercent: +el.dataset.speed * 2, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // frase que se acende palavra por palavra ao rolar
    $$('.fill').forEach(function (el) {
      el.setAttribute('aria-label', el.textContent);
      el.innerHTML = el.textContent.split(' ').map(function (w) { return '<span class="w" aria-hidden="true">' + w + '</span>'; }).join(' ');
      gsap.fromTo($$('.w', el), { opacity: 0.18 }, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 40%', scrub: true } });
    });

    // ícones se desenham pelo traço
    $$('.ico path, .ico circle').forEach(function (p) {
      var len = p.getTotalLength();
      gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.out',
        scrollTrigger: { trigger: p.closest('.servico'), containerAnimation: desktop && hz ? hz.animation : undefined, start: desktop ? 'left 85%' : 'top 80%' } });
    });
  });
})();
