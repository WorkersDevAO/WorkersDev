/* Workers Dev — minimal interactions */

(function () {
  'use strict';

  /* ---------- Scroll: always start at top on reload ---------- */
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.addEventListener('load', function () {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  });

  /* ---------- i18n ---------- */
  const translations = {
    pt: {
      'nav.home': 'Início',
      'nav.clients': 'Clientes',
      'nav.about': 'Sobre',
      'nav.plans': 'Planos',
      'nav.how': 'Como funciona',
      'nav.contact': 'Contacto',
      'brand.tag': 'Sites profissionais',
      'announce.before': 'Planos a partir de',
      'announce.after': '· Construção + manutenção',
      'clients.eyebrow': 'Clientes',
      'clients.title': 'Sites que construímos',
      'clients.desc': 'Alguns dos projectos online — clique para visitar.',
      'clients.wakanda.type': 'Ginásio',
      'clients.decifer.type': 'Resort desportivo',
      'clients.semente.type': 'Escola de inglês',
      'clients.lapidar.type': 'Colégio',
      'clients.artfit.type': 'Suplementos fitness',
      'clients.bello.type': 'Estúdio de tatuagem',
      'clients.brisa.type': 'Iates e jet skis',
      'clients.eldo.type': 'Barbearia',
      'clients.mari.type': 'Salão de beleza',
      'clients.bakana.type': 'Imobiliária',
      'clients.ango.type': 'Desinfestação',
      'about.eyebrow': 'Sobre nós',
      'about.title': 'Simples, profissional e focado no cliente',
      'about.p1': 'A Workers Dev cria e gere sites profissionais para serviços e negócios em Angola. Sem jargão técnico, sem complicações — apenas uma presença online limpa, rápida e móvel que o seu cliente consegue usar e partilhar.',
      'about.p2': 'Trabalhamos com salões, lojas, freelancers, imobiliárias, ofícios e outros negócios que precisam de estar online de forma organizada e profissional.',
      'about.point1': 'Sites rápidos e pensados para telemóvel',
      'about.point2': 'Contacto por WhatsApp e/ou e-mail em todos os planos',
      'about.point3': 'Construção + manutenção mensal incluída',
      'plans.eyebrow': 'Planos',
      'plans.title': 'Escolha o plano certo para o seu negócio',
      'plans.desc': 'Construção (pagamento único) + manutenção mensal. Preços em Kwanzas (Kz). WhatsApp e/ou e-mail em todos os planos.',
      'plans.build': 'Construção',
      'plans.maint': 'Manutenção',
      'plans.perMonth': '/mês',
      'plans.cta': 'Quero este plano',
      'plans.ctaQuote': 'Pedir orçamento',
      'plans.basico.ideal': 'Presença online clara com formulário de inscrição ou pedidos — sem login, sem base de dados',
      'plans.basico.f1': 'Site profissional e mobile',
      'plans.basico.f2': 'Formulário de inscrição / pedidos',
      'plans.basico.f3': 'Contacto por WhatsApp e/ou e-mail',
      'plans.basico.f4': 'Alojamento + actualizações básicas de conteúdo',
      'plans.pro.badge': 'Sistemas',
      'plans.pro.ideal': 'Registo, base de dados, reservas ou pedidos e área de cliente',
      'plans.pro.f1': 'Tudo o que está no Básico',
      'plans.pro.f2': 'Registo e login de utilizadores',
      'plans.pro.f3': 'Área de cliente (dashboard)',
      'plans.pro.f4': 'Reservas / pedidos + base de dados',
      'plans.pro.f5': 'Actualizações e suporte prioritários',
      'plans.empresa.ideal': 'Sistemas multi-utilizador (ex.: colégios, equipas) — perfis, capacidade, à medida e suporte prioritário',
      'plans.empresa.f1': 'Tudo o que está no Profissional',
      'plans.empresa.f2': 'Vários tipos de utilizador (ex.: alunos, funcionários)',
      'plans.empresa.f3': 'Maior capacidade e funcionalidades à medida',
      'plans.empresa.f4': 'Admin avançado, relatórios e integrações',
      'plans.empresa.f5': 'Alojamento, backups e suporte prioritário',
      'how.eyebrow': 'Processo',
      'how.title': 'Como funciona',
      'how.s1.title': 'Partilha a informação',
      'how.s1.desc': 'Envia-nos os dados do negócio, fotos, preços e como prefere ser contactado.',
      'how.s2.title': 'Nós construímos',
      'how.s2.desc': 'Personalizamos o site com a sua marca, conteúdo e contacto por WhatsApp e/ou e-mail.',
      'how.s3.title': 'Site no ar',
      'how.s3.desc': 'O site fica online, rápido e pronto para telemóvel. Partilha o link nas redes sociais.',
      'contact.eyebrow': 'Contacto',
      'contact.title': 'Fale connosco',
      'contact.desc': 'Resposta rápida. Preencha o formulário ou contacte-nos directamente por WhatsApp ou e-mail.',
      'contact.whatsapp': 'WhatsApp',
      'contact.email': 'E-mail',
      'form.name': 'Nome',
      'form.email': 'E-mail',
      'form.phone': 'Telefone',
      'form.business': 'Tipo de negócio / serviço',
      'form.location': 'Localização',
      'form.plan': 'Plano desejado',
      'form.planPlaceholder': 'Seleccione…',
      'form.notSure': 'Ainda não sei',
      'form.message': 'Mensagem',
      'form.submit': 'Enviar mensagem',
      'footer.tagline': 'Sites profissionais para serviços e negócios em Angola.'
    },
    en: {
      'nav.home': 'Home',
      'nav.clients': 'Clients',
      'nav.about': 'About',
      'nav.plans': 'Plans',
      'nav.how': 'How it works',
      'nav.contact': 'Contact',
      'brand.tag': 'Professional sites',
      'announce.before': 'Plans from',
      'announce.after': '· Build + maintenance',
      'clients.eyebrow': 'Clients',
      'clients.title': 'Sites we built',
      'clients.desc': 'A selection of live projects — click to visit.',
      'clients.wakanda.type': 'Gym',
      'clients.decifer.type': 'Sports resort',
      'clients.semente.type': 'English school',
      'clients.lapidar.type': 'School',
      'clients.artfit.type': 'Fitness supplements',
      'clients.bello.type': 'Tattoo studio',
      'clients.brisa.type': 'Yachts & jet skis',
      'clients.eldo.type': 'Barbershop',
      'clients.mari.type': 'Beauty salon',
      'clients.bakana.type': 'Real estate',
      'clients.ango.type': 'Pest control',
      'about.eyebrow': 'About us',
      'about.title': 'Simple, professional and client-focused',
      'about.p1': 'Workers Dev builds and manages professional websites for services and businesses in Angola. No technical jargon, no complications — just a clean, fast, mobile-ready online presence your clients can use and share.',
      'about.p2': 'We work with salons, shops, freelancers, real estate, trades and other businesses that need to be online in an organised, professional way.',
      'about.point1': 'Fast, mobile-first websites',
      'about.point2': 'WhatsApp and/or email contact on every plan',
      'about.point3': 'One-time build + monthly maintenance',
      'plans.eyebrow': 'Plans',
      'plans.title': 'Choose the right plan for your business',
      'plans.desc': 'One-time build + monthly maintenance. Prices in Angolan Kwanza (Kz). WhatsApp and/or email on every plan.',
      'plans.build': 'Build',
      'plans.maint': 'Maintenance',
      'plans.perMonth': '/mo',
      'plans.cta': 'I want this plan',
      'plans.ctaQuote': 'Request a quote',
      'plans.basico.ideal': 'Clear online presence with an enrolment or order form — no login, no database',
      'plans.basico.f1': 'Professional mobile-friendly site',
      'plans.basico.f2': 'Enrolment / order form',
      'plans.basico.f3': 'WhatsApp and/or email contact',
      'plans.basico.f4': 'Hosting + basic content updates',
      'plans.pro.badge': 'Systems',
      'plans.pro.ideal': 'Registration, database, booking or orders, and a client area',
      'plans.pro.f1': 'Everything in Básico',
      'plans.pro.f2': 'User registration & login',
      'plans.pro.f3': 'Client area (dashboard)',
      'plans.pro.f4': 'Booking / orders + database',
      'plans.pro.f5': 'Priority updates & support',
      'plans.empresa.ideal': 'Multi-user systems (e.g. schools, teams) — roles, capacity, custom features, priority support',
      'plans.empresa.f1': 'Everything in Profissional',
      'plans.empresa.f2': 'Multiple user roles (e.g. students, staff)',
      'plans.empresa.f3': 'Higher capacity & custom features',
      'plans.empresa.f4': 'Advanced admin, reports, integrations',
      'plans.empresa.f5': 'Hosting, backups & priority support',
      'how.eyebrow': 'Process',
      'how.title': 'How it works',
      'how.s1.title': 'Share your info',
      'how.s1.desc': 'Send us your business details, photos, prices and preferred contact method.',
      'how.s2.title': 'We build it',
      'how.s2.desc': 'We customise the site with your brand, content, and WhatsApp and/or email contact.',
      'how.s3.title': 'Site goes live',
      'how.s3.desc': 'Your site is online, fast and mobile-ready. Share the link on social media.',
      'contact.eyebrow': 'Contact',
      'contact.title': 'Get in touch',
      'contact.desc': 'Quick reply. Fill in the form or contact us directly via WhatsApp or email.',
      'contact.whatsapp': 'WhatsApp',
      'contact.email': 'Email',
      'form.name': 'Name',
      'form.email': 'Email',
      'form.phone': 'Phone',
      'form.business': 'Business / service type',
      'form.location': 'Location',
      'form.plan': 'Desired plan',
      'form.planPlaceholder': 'Select…',
      'form.notSure': 'Not sure yet',
      'form.message': 'Message',
      'form.submit': 'Send message',
      'footer.tagline': 'Professional websites for services and businesses in Angola.'
    }
  };

  let currentLang = 'pt';

  function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang === 'pt' ? 'pt-AO' : 'en';
    document.documentElement.setAttribute('translate', 'no');
    document.documentElement.classList.add('notranslate');
    const dict = translations[lang];

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = dict[key];
        } else if (el.tagName === 'OPTION') {
          el.textContent = dict[key];
        } else {
          el.textContent = dict[key];
        }
      }
    });

    const label = document.getElementById('langLabel');
    if (label) label.textContent = lang === 'pt' ? 'EN' : 'PT';
  }

  /* ---------- Header scroll: announce hide + solid header ---------- */
  const header = document.getElementById('siteHeader');
  const announceBar = document.getElementById('announceBar');
  let lastScrollY = 0;
  let ticking = false;

  function updateHeader() {
    const y = window.scrollY || window.pageYOffset;
    if (!header) return;

    if (y > 12) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }

    if (announceBar) {
      if (y > 48 && y > lastScrollY) {
        announceBar.classList.add('is-hidden');
        header.classList.add('announce-hidden');
      } else if (y < 24) {
        announceBar.classList.remove('is-hidden');
        header.classList.remove('announce-hidden');
      } else if (y < lastScrollY) {
        /* keep hidden while scrolling up mid-page; only return near top */
      }
    }

    lastScrollY = y;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });

  updateHeader();

  /* ---------- Mobile drawer ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const navDrawer = document.getElementById('navDrawer');
  const navOverlay = document.getElementById('navOverlay');
  const drawerClose = document.getElementById('drawerClose');

  function openDrawer() {
    if (menuToggle) {
      menuToggle.classList.add('active');
      menuToggle.setAttribute('aria-expanded', 'true');
    }
    if (navDrawer) {
      navDrawer.classList.add('is-open');
      navDrawer.setAttribute('aria-hidden', 'false');
    }
    if (navOverlay) {
      navOverlay.hidden = false;
      navOverlay.classList.add('is-open');
    }
    document.body.classList.add('drawer-open');
  }

  function closeDrawer() {
    if (menuToggle) {
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
    if (navDrawer) {
      navDrawer.classList.remove('is-open');
      navDrawer.setAttribute('aria-hidden', 'true');
    }
    if (navOverlay) {
      navOverlay.classList.remove('is-open');
      window.setTimeout(function () {
        if (navOverlay && !navOverlay.classList.contains('is-open')) {
          navOverlay.hidden = true;
        }
      }, 300);
    }
    document.body.classList.remove('drawer-open');
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      if (navDrawer && navDrawer.classList.contains('is-open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (navOverlay) navOverlay.addEventListener('click', closeDrawer);

  document.querySelectorAll('.drawer-link, .brand--drawer').forEach(function (link) {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  /* ---------- Language toggle ---------- */
  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', function () {
      setLanguage(currentLang === 'pt' ? 'en' : 'pt');
    });
  }

  /* ---------- Plan CTA → preselect form ---------- */
  document.querySelectorAll('.plan-cta').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const plan = btn.getAttribute('data-plan');
      const select = document.getElementById('plan');
      if (select && plan) {
        select.value = plan;
      }
    });
  });

  /* ---------- Contact form → Cloudflare Worker (Resend → Gmail) ---------- */
  const CONTACT_API = 'https://old-lab-e4bacontact-form.workersdevao.workers.dev/';
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const submitBtn = form.querySelector('[type="submit"]');
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const business = document.getElementById('business').value.trim();
      const location = document.getElementById('location').value.trim();
      const plan = document.getElementById('plan').value;
      const message = document.getElementById('message').value.trim();
      const subject = plan
        ? 'Workers Dev — contacto (' + plan + ')'
        : 'Workers Dev — contacto do site';

      const payload = {
        name: name,
        email: email,
        phone: phone,
        business: business,
        location: location,
        plan: plan,
        subject: subject,
        message: message
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.setAttribute('data-label', submitBtn.textContent);
        submitBtn.textContent = currentLang === 'en' ? 'Sending…' : 'A enviar…';
      }

      fetch(CONTACT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json().catch(function () { return {}; });
        })
        .then(function () {
          form.reset();
          alert(currentLang === 'en'
            ? 'Message sent. We will reply soon.'
            : 'Mensagem enviada. Responderemos em breve.');
        })
        .catch(function () {
          alert(currentLang === 'en'
            ? 'Could not send. Please try WhatsApp or email.'
            : 'Não foi possível enviar. Tente WhatsApp ou e-mail.');
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.getAttribute('data-label') || submitBtn.textContent;
          }
        });
    });
  }

  /* ---------- Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Clients carousel ---------- */
  (function initClientsCarousel() {
    const track = document.getElementById('clientsTrack');
    const prev = document.getElementById('clientsPrev');
    const next = document.getElementById('clientsNext');
    const dotsWrap = document.getElementById('clientsDots');
    if (!track) return;

    const cards = Array.prototype.slice.call(track.querySelectorAll('.client-card'));
    if (!cards.length) return;

    let index = 0;

    function perView() {
      const w = window.innerWidth;
      if (w >= 960) return 3;
      if (w >= 640) return 2;
      return 1;
    }

    function maxIndex() {
      return Math.max(0, cards.length - perView());
    }

    function goTo(i) {
      index = Math.max(0, Math.min(i, maxIndex()));
      const card = cards[0];
      const gap = 20;
      const step = card.getBoundingClientRect().width + gap;
      track.style.transform = 'translateX(' + (-index * step) + 'px)';
      if (dotsWrap) {
        const dots = dotsWrap.querySelectorAll('.carousel-dot');
        dots.forEach(function (d, di) {
          d.classList.toggle('is-active', di === index);
        });
      }
    }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      const count = maxIndex() + 1;
      for (var i = 0; i < count; i++) {
        (function (di) {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'carousel-dot' + (di === index ? ' is-active' : '');
          b.setAttribute('aria-label', 'Slide ' + (di + 1));
          b.addEventListener('click', function () { goTo(di); });
          dotsWrap.appendChild(b);
        })(i);
      }
    }

    if (prev) prev.addEventListener('click', function () { goTo(index - 1); });
    if (next) next.addEventListener('click', function () { goTo(index + 1); });

    let resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        buildDots();
        goTo(Math.min(index, maxIndex()));
      }, 120);
    });

    /* touch swipe */
    let startX = 0;
    let deltaX = 0;
    track.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      deltaX = 0;
    }, { passive: true });
    track.addEventListener('touchmove', function (e) {
      deltaX = e.touches[0].clientX - startX;
    }, { passive: true });
    track.addEventListener('touchend', function () {
      if (Math.abs(deltaX) > 50) {
        if (deltaX < 0) goTo(index + 1);
        else goTo(index - 1);
      }
    });

    buildDots();
    goTo(0);
  })();

  /* Init */
  setLanguage('pt');
})();
