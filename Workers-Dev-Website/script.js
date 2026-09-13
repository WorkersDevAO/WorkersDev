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
      'nav.about': 'Sobre',
      'nav.plans': 'Planos',
      'nav.how': 'Como funciona',
      'nav.contact': 'Contacto',
      'hero.eyebrow': 'Sites profissionais · Angola',
      'hero.title': 'Presença online clara, rápida e sem dor de cabeça técnica',
      'hero.subtitle': 'Construímos e alojamos sites profissionais para salões, lojas, freelancers, imobiliárias e serviços em Angola. Do simples ao sistema completo.',
      'hero.ctaPrimary': 'Ver planos',
      'hero.ctaSecondary': 'Falar connosco',
      'about.eyebrow': 'Sobre nós',
      'about.title': 'Simples, profissional e focado no cliente',
      'about.p1': 'A Workers Dev cria e gere sites profissionais para serviços e negócios em Angola. Sem jargão técnico, sem complicações — apenas uma presença online limpa, rápida e móvel que o seu cliente consegue usar e partilhar.',
      'about.p2': 'Trabalhamos com salões, lojas, freelancers, imobiliárias, ofícios e outros negócios que precisam de estar online de forma organizada e profissional.',
      'about.point1': 'Sites rápidos e pensados para telemóvel',
      'about.point2': 'Contacto directo via WhatsApp',
      'about.point3': 'Actualizações e manutenção incluídas nos planos',
      'plans.eyebrow': 'Planos',
      'plans.title': 'Escolha o plano certo para o seu negócio',
      'plans.desc': 'Todos os planos incluem site alojado, design profissional e suporte básico. O preço é em Kwanzas (Kz).',
      'plans.perMonth': '/mês',
      'plans.perYear': '/ano',
      'plans.cta': 'Quero este plano',
      'plans.bro.ideal': 'Ideal para pequenos negócios e serviços que precisam de presença online clara e organizada',
      'plans.bro.f1': 'Site alojado na Workers Dev',
      'plans.bro.f2': 'Actualizações básicas de texto e imagens',
      'plans.bro.f3': 'Botão / link WhatsApp',
      'plans.bro.f4': 'Manutenção técnica básica',
      'plans.family.badge': 'Poupa 5.000 Kz',
      'plans.family.ideal': 'O mesmo que o Bro, mas com pagamento anual — ideal se preferir pagar uma vez por ano',
      'plans.family.f1': 'Tudo o que está no Bro',
      'plans.family.f2': 'Pagamento único anual',
      'plans.family.f3': 'Poupa 5.000 Kz vs. 12 meses',
      'plans.family.f4': 'Sem renovações mensais',
      'plans.pro.ideal': 'Para negócios em crescimento que precisam de sistemas reais (login, reservas, pedidos)',
      'plans.pro.f1': 'Tudo o que está no Bro',
      'plans.pro.f2': 'Registo e login de utilizadores',
      'plans.pro.f3': 'Área de cliente (dashboard)',
      'plans.pro.f4': 'Pedidos, formulários e reservas',
      'plans.pro.f5': 'Base de dados e actualizações prioritárias',
      'plans.empresa.ideal': 'Para negócios maiores que precisam de funcionalidades personalizadas e suporte prioritário',
      'plans.empresa.f1': 'Tudo o que está no Pro',
      'plans.empresa.f2': 'Funcionalidades à medida',
      'plans.empresa.f3': 'Mais utilizadores e capacidade',
      'plans.empresa.f4': 'Admin avançado e relatórios',
      'plans.empresa.f5': 'Integrações e suporte dedicado',
      'how.eyebrow': 'Processo',
      'how.title': 'Como funciona',
      'how.s1.title': 'Partilha a informação',
      'how.s1.desc': 'Envia-nos os dados do negócio, fotos, preços e como prefere ser contactado.',
      'how.s2.title': 'Nós construímos',
      'how.s2.desc': 'Personalizamos o site com a sua marca, conteúdo e botões de contacto (WhatsApp).',
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
      'nav.about': 'About',
      'nav.plans': 'Plans',
      'nav.how': 'How it works',
      'nav.contact': 'Contact',
      'hero.eyebrow': 'Professional websites · Angola',
      'hero.title': 'Clear, fast online presence — no technical headache',
      'hero.subtitle': 'We build and host professional websites for salons, shops, freelancers, real estate and services in Angola. From a simple presence to full systems.',
      'hero.ctaPrimary': 'View plans',
      'hero.ctaSecondary': 'Get in touch',
      'about.eyebrow': 'About us',
      'about.title': 'Simple, professional and client-focused',
      'about.p1': 'Workers Dev builds and manages professional websites for services and businesses in Angola. No technical jargon, no complications — just a clean, fast, mobile-ready online presence your clients can use and share.',
      'about.p2': 'We work with salons, shops, freelancers, real estate, trades and other businesses that need to be online in an organised, professional way.',
      'about.point1': 'Fast, mobile-first websites',
      'about.point2': 'Direct WhatsApp contact',
      'about.point3': 'Updates and maintenance included in plans',
      'plans.eyebrow': 'Plans',
      'plans.title': 'Choose the right plan for your business',
      'plans.desc': 'All plans include hosted website, professional design and basic support. Prices in Angolan Kwanza (Kz).',
      'plans.perMonth': '/month',
      'plans.perYear': '/year',
      'plans.cta': 'I want this plan',
      'plans.bro.ideal': 'Ideal for small businesses and services that need a clear, organised online presence',
      'plans.bro.f1': 'Hosted on Workers Dev',
      'plans.bro.f2': 'Basic text and image updates',
      'plans.bro.f3': 'WhatsApp button / link',
      'plans.bro.f4': 'Basic technical maintenance',
      'plans.family.badge': 'Save 5,000 Kz',
      'plans.family.ideal': 'Same as Bro, but with yearly payment — ideal if you prefer to pay once a year',
      'plans.family.f1': 'Everything in Bro',
      'plans.family.f2': 'One yearly payment',
      'plans.family.f3': 'Save 5,000 Kz vs 12 months',
      'plans.family.f4': 'No monthly renewals',
      'plans.pro.ideal': 'For growing businesses that need real systems (login, bookings, orders)',
      'plans.pro.f1': 'Everything in Bro',
      'plans.pro.f2': 'User registration and login',
      'plans.pro.f3': 'Client area (dashboard)',
      'plans.pro.f4': 'Orders, forms and bookings',
      'plans.pro.f5': 'Database and priority updates',
      'plans.empresa.ideal': 'For larger businesses that need custom features and priority support',
      'plans.empresa.f1': 'Everything in Pro',
      'plans.empresa.f2': 'Custom features',
      'plans.empresa.f3': 'More users and capacity',
      'plans.empresa.f4': 'Advanced admin and reports',
      'plans.empresa.f5': 'Integrations and dedicated support',
      'how.eyebrow': 'Process',
      'how.title': 'How it works',
      'how.s1.title': 'Share your info',
      'how.s1.desc': 'Send us your business details, photos, prices and preferred contact method.',
      'how.s2.title': 'We build it',
      'how.s2.desc': 'We customise the site with your brand, content and contact buttons (WhatsApp).',
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

  /* ---------- Menu ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      menuToggle.classList.toggle('active');
      nav.classList.toggle('open');
    });

    nav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        menuToggle.classList.remove('active');
        nav.classList.remove('open');
      });
    });
  }

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

  /* ---------- Contact form → WhatsApp ---------- */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const business = document.getElementById('business').value.trim();
      const location = document.getElementById('location').value.trim();
      const plan = document.getElementById('plan').value;
      const message = document.getElementById('message').value.trim();

      const text = [
        'Olá Workers Dev,',
        '',
        'Gostaria de saber mais sobre os vossos serviços.',
        '',
        'Nome: ' + name,
        'E-mail: ' + email,
        'Telefone: ' + phone,
        'Negócio/Serviço: ' + business,
        'Localização: ' + location,
        'Plano: ' + plan,
        '',
        'Mensagem:',
        message
      ].join('\n');

      const url = 'https://wa.me/244943278361?text=' + encodeURIComponent(text);
      window.open(url, '_blank', 'noopener');
    });
  }

  /* ---------- Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Init */
  setLanguage('pt');
})();
