/* Workers Dev: minimal interactions */

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
      'nav.own': 'Site próprio',
      'nav.contact': 'Contacto',
      'brand.tag': 'Sites profissionais',
      'brand.phrase': 'True Greatness Is Serving Others',
      'announce.before': 'Planos a partir de',
      'announce.after': '· Construção + manutenção',

      'about.eyebrow': 'Sobre nós',
      'about.title': 'Simples, profissional e focado no cliente',
      'about.p1': 'A Workers Dev cria e gere sites profissionais para serviços e negócios em Angola. Sem jargão técnico, sem complicações, apenas uma presença online limpa, rápida e móvel que o seu cliente consegue usar e partilhar.',
      'about.p2': 'Trabalhamos com salões, lojas, freelancers, imobiliárias, ofícios e outros negócios que precisam de estar online de forma organizada e profissional.',
      'about.point1': 'Sites rápidos e pensados para telemóvel',
      'about.point2': 'Contacto por WhatsApp e/ou e-mail em todos os planos',
      'about.point3': 'Construção + manutenção mensal incluída',
      'plans.eyebrow': 'Planos',
      'plans.title': 'Escolha o plano certo para o seu negócio',
      'plans.desc': 'Construção (pagamento único) + manutenção mensal. Preços em Kwanzas (Kz). WhatsApp e/ou e-mail em todos os planos.',
      'plans.x.title': 'O caminho mais rápido para o seu negócio online',
      'plans.x.sub': 'Desbloqueie um conjunto de ferramentas que o ajudarão a impulsionar as vendas, construir credibilidade e obter informações de mercado em tempo real.',
      'plans.x.start': 'Começar agora',
      'plans.x.trust': 'Confiado por dezenas de empresas',
      'plans.x.featTitle': 'Ferramentas desenvolvidas para ajudar você a progredir',
      'plans.x.feat1.title': 'Aumente a credibilidade e a visibilidade',
      'plans.x.feat1.desc': 'Destaque-se com um site excepcional e SEO para expandir sua presença online.',
      'plans.x.feat2.title': 'Obtenha informações em tempo real',
      'plans.x.feat2.desc': 'Monitore os dados do seu site.',
      'plans.x.feat3.title': 'Acesse um domínio gratuito',
      'plans.x.feat3.desc': 'Adquira um domínio gratuito sem custo adicional.',
      'testimonial.quote': 'Antes de mais, quero agradecer-te pelo website que desenvolveste. Está <em>muito bonito, elegante</em> e <em>superou as minhas expectativas</em>! Há apenas alguns aspectos que precisaremos de melhorar, mas, no geral, está mesmo muito, mas muito lindo. Muito obrigada pelo excelente trabalho!',
      'testimonial.role': 'Cliente · Cosméticos',
      'expand.cred.title': 'Construa credibilidade online',
      'expand.cred.f1.title': 'Site profissional que transmite confiança',
      'expand.cred.f1.desc': 'Um site bem desenhado mostra aos clientes que o seu negócio é sério e fiável, sem parecer amador.',
      'expand.cred.f2.title': 'SEO para ser encontrado',
      'expand.cred.f2.desc': 'Estrutura e conteúdos pensados para o site aparecer nos motores de busca e atrair mais clientes em Angola.',
      'expand.data.title': 'Dados em tempo real',
      'expand.data.f1.title': 'Painel de visitas do site',
      'expand.data.f1.desc': 'Acompanhe quantas pessoas visitam o site, de onde vêm e quais páginas mais interessam, sem complicações.',
      'expand.data.f2.title': 'Métricas do negócio num só lugar',
      'expand.data.f2.desc': 'Veja pedidos, formulários e desempenho do site num painel simples, pensado para o dono do negócio.',
      'expand.domain.title': 'Domínio e identidade online',
      'expand.domain.f1.title': 'Domínio gratuito incluído',
      'expand.domain.f1.desc': 'Receba um domínio profissional sem custo adicional, a base da sua presença online.',
      'expand.domain.f2.title': 'Proteja a sua marca online',
      'expand.domain.f2.desc': 'Um domínio próprio reforça a confiança dos clientes e ajuda a evitar que outros usem o nome do seu negócio.',
      'expand.more': 'E muito mais',
      'expand.more.f1.title': 'Dashboard para clientes',
      'expand.more.f1.desc': 'Área de cliente onde os seus clientes acompanham pedidos, reservas ou progresso, sem telefonemas desnecessários.',
      'expand.more.f2.title': 'Painel de administração',
      'expand.more.f2.desc': 'Gerir produtos, clientes e recursos do site (imagens e textos) num só lugar, pensado para o dono do negócio.',
      'expand.more.f3.title': 'Optimização SEO',
      'expand.more.f3.desc': 'Estrutura e conteúdos preparados para o site aparecer mais facilmente nos motores de busca.',
      'plans.join.title': 'Junte-se às marcas que mais crescem na internet',
      'plans.build': 'Construção',
      'plans.maint': 'Manutenção',
      'plans.perMonth': '/mês',
      'plans.billing.title': 'Construa credibilidade e impulsione o crescimento',
      'plans.billing.annual': 'Anual',
      'plans.billing.monthly': 'Mensal',
      'plans.billing.save': 'POUPA 16%',
      'plans.billing.billed': 'Facturado anualmente',
      'plans.cta': 'Inscreva-se agora',
      'plans.ctaQuote': 'Pedir orçamento',
      'plans.basico.f1': 'Site profissional',
      'plans.basico.f2': 'Domínio gratuito em oseunegocio.pages.dev',
      'plans.basico.f3': 'Painel de administração',
      'plans.basico.f4': 'Alojamento de alta velocidade',
      'plans.basico.f5': 'SEO',
      'plans.basico.f6': '25 GB de armazenamento',
      'plans.basico.f7': 'Segurança',
      'plans.basico.f8': 'Suporte técnico diário',
      'plans.pro.badge': 'Mais popular',
      'plans.pro.f1': 'Tudo o que está no Básico',
      'plans.pro.f2': 'Cadastro e login de utilizadores',
      'plans.pro.f3': 'Área do cliente (portal da conta / página de perfil)',
      'plans.pro.f4': 'Até 1.000 contas de cliente',
      'plans.pro.f5': 'Actualizações e suporte prioritários',
      'plans.empresa.f1': 'Tudo o que está no Profissional',
      'plans.empresa.f2': 'Domínio personalizado .com',
      'plans.empresa.f3': 'Vários tipos de utilizador (ex.: alunos, funcionários)',
      'plans.empresa.f4': 'Até 10.000 contas de cliente',
      'plans.empresa.f5': 'Maior capacidade e funcionalidades à medida',
      'plans.empresa.f6': 'Admin avançado, relatórios e integrações',
      'plans.empresa.f7': 'Suporte prioritário',
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
      'contact.team': 'Dúvidas? Fale com a nossa equipa',
      'interest.title': 'Desbloqueie o crescimento do seu negócio com a Workers Dev',
      'interest.sub': 'O conjunto de ferramentas mais simples para impulsionar vendas, construir credibilidade e ter o seu negócio online, sem complicações técnicas.',
      'interest.lead': 'Preencha o formulário para saber mais.',
      'own.eyebrow': 'Alternativa',
      'own.title': 'Plano gerido ou Site próprio?',
      'own.desc': 'Duas formas de ter o site: nós gerimos por si todos os meses, ou paga uma vez e fica com o site, ficheiros incluídos, sem mensalidade.',
      'own.cmp.managed': 'Plano gerido',
      'own.cmp.managedSub': 'Construção + mensalidade',
      'own.cmp.own': 'Site próprio',
      'own.cmp.ownSub': 'Só construção · sem mensalidade',
      'own.cmp.r1': 'Pagamento',
      'own.cmp.r1m': 'Construção + taxa mensal',
      'own.cmp.r1o': 'Só o valor de construção (uma vez)',
      'own.cmp.r2': 'Quem é dono',
      'own.cmp.r2m': 'Nós alojamos e gerimos o site',
      'own.cmp.r2o': 'Você: recebe todas as pastas e ficheiros',
      'own.cmp.r3': 'Mensalidade',
      'own.cmp.r3m': 'Sim (manutenção + alojamento)',
      'own.cmp.r3o': 'Não',
      'own.cmp.r4': 'Alojamento',
      'own.cmp.r4m': 'Incluído connosco',
      'own.cmp.r4o': 'O seu (domínio e hosting a seu cargo)',
      'own.cmp.r5': 'Actualizações',
      'own.cmp.r5m': 'Incluídas na manutenção mensal',
      'own.cmp.r5o': 'Grátis 14 dias após a compra · depois 3.000 Kz por alteração',
      'own.cmp.r6': 'Ideal para',
      'own.cmp.r6m': 'Quem quer zero preocupação técnica',
      'own.cmp.r6o': 'Quem quer ser dono e não pagar mensal',
      'own.badge': 'Pagamento único',
      'own.headline': 'Compre o site. Fique com tudo.',
      'own.lead': 'Paga só o valor de construção do plano que escolher. Entregamos todas as pastas e ficheiros, o site passa a ser seu.',
      'own.f1': 'Pagamento único = preço de construção (Básico, Profissional ou Empresa)',
      'own.f2': 'Transferência completa: código, pastas, imagens e configurações',
      'own.f3': 'Sem mensalidade de manutenção',
      'own.f4': 'Pode alojar onde quiser (o seu domínio, o seu hosting)',
      'own.changeLabel': 'Alterações depois',
      'own.changeNote': 'por correção, alteração ou nova funcionalidade (após os 14 dias)',
      'own.changeFree': 'Ajustes grátis nos primeiros 14 dias após a compra / transferência',
      'own.cta': 'Quero o Site próprio',
      'own.rulesTitle': 'Regras e condições',
      'own.r1.title': 'Propriedade',
      'own.r1.desc': 'Após o pagamento e a entrega, o site (código e ficheiros entregues) passa a ser seu.',
      'own.r2.title': 'Transferência',
      'own.r2.desc': 'Recebe todas as pastas do projecto e, se necessário, ajuda para colocar o site na sua conta de alojamento.',
      'own.r3.title': 'Sem mensalidade',
      'own.r3.desc': 'Não há taxa mensal. Alojamento e domínio ficam a seu cargo (ou pode contratar hosting à parte).',
      'own.r4.title': 'Alterações após os 14 dias',
      'own.r4.desc': 'Correcção, alteração, nova secção ou funcionalidade: 3.000 Kz por pedido, com âmbito acordado antes do trabalho.',
      'own.r5.title': '14 dias grátis após a compra',
      'own.r5.desc': 'Nos primeiros 14 dias após a transferência: ajustes e correcções sem custo. Depois disso, cada pedido é 3.000 Kz.',
      'own.r6.title': 'Após a entrega',
      'own.r6.desc': 'Não somos responsáveis pelo uptime, backups ou segurança do hosting que escolher. Novos trabalhos só mediante pedido pago.',
      'form.name': 'Nome',
      'form.email': 'E-mail',
      'form.phone': 'Telefone',
      'form.business': 'Tipo de negócio / serviço',
      'form.location': 'Localização',
      'form.plan': 'Plano desejado',
      'form.planPlaceholder': 'Seleccione…',
      'form.notSure': 'Ainda não sei',
      'form.own': 'Site próprio',
      'form.message': 'Mensagem',
      'form.submit': 'Enviar mensagem',
      'form.successTitle': 'Pedido recebido',
      'form.successText': 'Obrigado. A equipa Workers Dev vai responder em breve por e-mail ou WhatsApp.',
      'form.successHome': 'Voltar ao início',
      'footer.tagline': 'Sites profissionais para serviços e negócios em Angola.'
    },
    en: {
      'nav.home': 'Home',
      'nav.clients': 'Clients',
      'nav.about': 'About',
      'nav.plans': 'Plans',
      'nav.how': 'How it works',
      'nav.own': 'Own the site',
      'nav.contact': 'Contact',
      'brand.tag': 'Professional sites',
      'brand.phrase': 'True Greatness Is Serving Others',
      'announce.before': 'Plans from',
      'announce.after': '· Build + maintenance',
      'about.eyebrow': 'About us',
      'about.title': 'Simple, professional and client-focused',
      'about.p1': 'Workers Dev builds and manages professional websites for services and businesses in Angola. No technical jargon, no complications, just a clean, fast, mobile-ready online presence your clients can use and share.',
      'about.p2': 'We work with salons, shops, freelancers, real estate, trades and other businesses that need to be online in an organised, professional way.',
      'about.point1': 'Fast, mobile-first websites',
      'about.point2': 'WhatsApp and/or email contact on every plan',
      'about.point3': 'One-time build + monthly maintenance',
      'plans.eyebrow': 'Plans',
      'plans.title': 'Choose the right plan for your business',
      'plans.desc': 'One-time build + monthly maintenance. Prices in Angolan Kwanza (Kz). WhatsApp and/or email on every plan.',
      'plans.x.title': 'The fastest way to get your business online',
      'plans.x.sub': 'Unlock a set of tools that will help you boost sales, build credibility and get real-time market insights.',
      'plans.x.start': 'Start now',
      'plans.x.trust': 'Trusted by dozens of companies',
      'plans.x.featTitle': 'Tools designed to help you get ahead',
      'plans.x.feat1.title': 'Boost credibility & visibility',
      'plans.x.feat1.desc': 'Stand out with an exceptional site and SEO to expand your online presence.',
      'plans.x.feat2.title': 'Get real-time insights',
      'plans.x.feat2.desc': 'Monitor your site data.',
      'plans.x.feat3.title': 'Access a free domain',
      'plans.x.feat3.desc': 'Get a free domain at no additional cost.',
      'testimonial.quote': 'First of all, I want to thank you for the website you built. It is <em>very beautiful, elegant</em> and <em>exceeded my expectations</em>! There are just a few details we still need to improve, but overall it is truly very, very lovely. Thank you so much for the excellent work!',
      'testimonial.role': 'Client · Cosmetics',
      'expand.cred.title': 'Build online credibility',
      'expand.cred.f1.title': 'A professional site that builds trust',
      'expand.cred.f1.desc': 'A well-designed website shows customers that your business is serious and reliable, not amateur.',
      'expand.cred.f2.title': 'SEO so you can be found',
      'expand.cred.f2.desc': 'Structure and content built so the site shows up in search engines and attracts more customers in Angola.',
      'expand.data.title': 'Real-time data',
      'expand.data.f1.title': 'Site visits dashboard',
      'expand.data.f1.desc': 'Track how many people visit the site, where they come from and which pages matter most, without the complexity.',
      'expand.data.f2.title': 'Business metrics in one place',
      'expand.data.f2.desc': 'See orders, form submissions and site performance in a simple panel built for the business owner.',
      'expand.domain.title': 'Domain and online identity',
      'expand.domain.f1.title': 'Free domain included',
      'expand.domain.f1.desc': 'Get a professional domain at no extra cost, the foundation of your online presence.',
      'expand.domain.f2.title': 'Protect your brand online',
      'expand.domain.f2.desc': 'Your own domain builds customer trust and helps stop others from using your business name.',
      'expand.more': 'And so much more',
      'expand.more.f1.title': 'Client dashboard',
      'expand.more.f1.desc': 'A client area where your customers track orders, bookings or progress, without unnecessary phone calls.',
      'expand.more.f2.title': 'Admin panel',
      'expand.more.f2.desc': 'Manage products, clients and site resources (images and text) in one place, built for the business owner.',
      'expand.more.f3.title': 'SEO optimisation',
      'expand.more.f3.desc': 'Structure and content prepared so the site is easier to find on search engines.',
      'plans.join.title': 'Join the brands growing fastest on the internet',
      'plans.build': 'Build',
      'plans.maint': 'Maintenance',
      'plans.perMonth': '/mo',
      'plans.billing.title': 'Build credibility and drive growth',
      'plans.billing.annual': 'Annually',
      'plans.billing.monthly': 'Monthly',
      'plans.billing.save': 'SAVE 16%',
      'plans.billing.billed': 'Billed annually',
      'plans.cta': 'Sign up now',
      'plans.ctaQuote': 'Request a quote',
      'plans.basico.f1': 'Professional site',
      'plans.basico.f2': 'Free domain at oseunegocio.pages.dev',
      'plans.basico.f3': 'Admin panel',
      'plans.basico.f4': 'High-speed hosting',
      'plans.basico.f5': 'SEO',
      'plans.basico.f6': '25 GB of storage',
      'plans.basico.f7': 'Security',
      'plans.basico.f8': 'Daily technical support',
      'plans.pro.badge': 'Most popular',
      'plans.pro.f1': 'Everything in Básico',
      'plans.pro.f2': 'User registration & login',
      'plans.pro.f3': 'Client area (account portal / profile page)',
      'plans.pro.f4': 'Up to 1,000 client accounts',
      'plans.pro.f5': 'Priority updates & support',
      'plans.empresa.f1': 'Everything in Profissional',
      'plans.empresa.f2': 'Custom .com domain',
      'plans.empresa.f3': 'Multiple user roles (e.g. students, staff)',
      'plans.empresa.f4': 'Up to 10,000 client accounts',
      'plans.empresa.f5': 'Higher capacity & custom features',
      'plans.empresa.f6': 'Advanced admin, reports, integrations',
      'plans.empresa.f7': 'Priority support',
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
      'contact.team': 'Questions? Get in touch with our team',
      'interest.title': 'Unlock growth for your business with Workers Dev',
      'interest.sub': 'The simplest set of tools to boost sales, build credibility and get your business online, no technical hassle.',
      'interest.lead': 'Fill in the form to learn more.',
      'own.eyebrow': 'Alternative',
      'own.title': 'Managed plan or Own the site?',
      'own.desc': 'Two ways to have a site: we manage it for you every month, or you pay once and own it, files included, no monthly fee.',
      'own.cmp.managed': 'Managed plan',
      'own.cmp.managedSub': 'Build + monthly fee',
      'own.cmp.own': 'Own the site',
      'own.cmp.ownSub': 'Build only · no monthly fee',
      'own.cmp.r1': 'Payment',
      'own.cmp.r1m': 'Build + monthly fee',
      'own.cmp.r1o': 'Build price only (one time)',
      'own.cmp.r2': 'Who owns it',
      'own.cmp.r2m': 'We host and manage the site',
      'own.cmp.r2o': 'You: full folders and files transferred',
      'own.cmp.r3': 'Monthly fee',
      'own.cmp.r3m': 'Yes (maintenance + hosting)',
      'own.cmp.r3o': 'No',
      'own.cmp.r4': 'Hosting',
      'own.cmp.r4m': 'Included with us',
      'own.cmp.r4o': 'Yours (domain and hosting on you)',
      'own.cmp.r5': 'Updates',
      'own.cmp.r5m': 'Included in monthly maintenance',
      'own.cmp.r5o': 'Free for 14 days after purchase · then 3.000 Kz per change',
      'own.cmp.r6': 'Best for',
      'own.cmp.r6m': 'Anyone who wants zero technical worry',
      'own.cmp.r6o': 'Anyone who wants to own it and skip the monthly fee',
      'own.badge': 'One-time payment',
      'own.headline': 'Buy the site. Keep everything.',
      'own.lead': 'Pay only the build price of the plan you choose. We hand over all folders and files, the site becomes yours.',
      'own.f1': 'One-time payment = build price (Básico, Profissional or Empresa)',
      'own.f2': 'Full transfer: code, folders, images and configuration',
      'own.f3': 'No monthly maintenance fee',
      'own.f4': 'Host wherever you want (your domain, your hosting)',
      'own.changeLabel': 'Changes later',
      'own.changeNote': 'per fix, change or new feature (after the 14 days)',
      'own.changeFree': 'Free adjustments for the first 14 days after purchase / transfer',
      'own.cta': 'I want Own the site',
      'own.rulesTitle': 'Rules and conditions',
      'own.r1.title': 'Ownership',
      'own.r1.desc': 'After payment and delivery, the site (code and files delivered) becomes yours.',
      'own.r2.title': 'Transfer',
      'own.r2.desc': 'You receive the full project folders and, if needed, help deploying to your own hosting account.',
      'own.r3.title': 'No monthly fee',
      'own.r3.desc': 'There is no monthly charge. Hosting and domain are your responsibility (or you can hire hosting separately).',
      'own.r4.title': 'Changes after 14 days',
      'own.r4.desc': 'Fix, change, new section or feature: 3.000 Kz per request, with scope agreed before work starts.',
      'own.r5.title': '14 free days after purchase',
      'own.r5.desc': 'In the first 14 days after transfer: adjustments and fixes at no cost. After that, each request is 3.000 Kz.',
      'own.r6.title': 'After delivery',
      'own.r6.desc': 'We are not responsible for uptime, backups or security of the hosting you choose. Further work only on paid request.',
      'form.name': 'Name',
      'form.email': 'Email',
      'form.phone': 'Phone',
      'form.business': 'Business / service type',
      'form.location': 'Location',
      'form.plan': 'Desired plan',
      'form.planPlaceholder': 'Select…',
      'form.notSure': 'Not sure yet',
      'form.own': 'Own the site',
      'form.message': 'Message',
      'form.submit': 'Send message',
      'form.successTitle': 'Request received',
      'form.successText': 'Thank you. The Workers Dev team will reply soon by email or WhatsApp.',
      'form.successHome': 'Back to home',
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
        } else if (el.hasAttribute('data-i18n-html')) {
          el.innerHTML = dict[key];
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

  /* ---------- Plan CTA → preselect form (same page) ---------- */
  document.querySelectorAll('.plan-cta').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const plan = btn.getAttribute('data-plan');
      const select = document.getElementById('plan');
      if (select && plan) {
        select.value = plan;
      }
    });
  });

  /* ---------- Preselect plan from URL ?plan=Basico|Profissional|Empresa ---------- */
  (function preselectPlanFromUrl() {
    const select = document.getElementById('plan');
    if (!select) return;
    const params = new URLSearchParams(window.location.search);
    const plan = params.get('plan');
    if (!plan) return;
    const allowed = ['Basico', 'Profissional', 'Empresa', 'Nao sei'];
    if (allowed.indexOf(plan) !== -1) {
      select.value = plan;
    }
  })();

  /* ---------- Contact form → Cloudflare Worker (Resend → Gmail) ---------- */
  const CONTACT_API = 'https://workersdev-contact-api.workersdevao.workers.dev/';
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
        ? 'Workers Dev: contacto (' + plan + ')'
        : 'Workers Dev: contacto do site';

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

      const formError = document.getElementById('formError');
      if (formError) {
        formError.textContent = '';
        formError.classList.add('hidden');
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
          form.classList.add('hidden');
          const success = document.getElementById('formSuccess');
          if (success) success.classList.remove('hidden');
          const header = document.querySelector('.interest-header');
          if (header) header.classList.add('hidden');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        })
        .catch(function () {
          if (formError) {
            formError.textContent = currentLang === 'en'
              ? 'Could not send. Try again or WhatsApp +244 943 278 361.'
              : 'Não foi possível enviar. Tente de novo ou WhatsApp +244 943 278 361.';
            formError.classList.remove('hidden');
          }
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

  /* ---------- Billing toggle (annual / monthly, 16% off annual), supports multiple toggles ---------- */
  (function initBillingToggle() {
    const annualBtns = document.querySelectorAll('.billing-opt[data-billing="annual"]');
    const monthlyBtns = document.querySelectorAll('.billing-opt[data-billing="monthly"]');
    const cards = document.querySelectorAll('.x-plan-card[data-maint-monthly]');
    if (!annualBtns.length || !monthlyBtns.length || !cards.length) return;

    function formatKz(n) {
      return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    function setBilling(mode) {
      const isAnnual = mode === 'annual';
      annualBtns.forEach(function (btn) { btn.classList.toggle('is-active', isAnnual); });
      monthlyBtns.forEach(function (btn) { btn.classList.toggle('is-active', !isAnnual); });

      cards.forEach(function (card) {
        const monthly = parseInt(card.getAttribute('data-maint-monthly'), 10);
        const annual = parseInt(card.getAttribute('data-maint-annual'), 10);
        const annualTotal = parseInt(card.getAttribute('data-maint-annual-total'), 10);
        const priceEl = card.querySelector('.x-plan-maint-price');
        const noteEl = card.querySelector('.x-plan-annual-note');
        const totalEl = card.querySelector('.x-plan-annual-total');

        if (priceEl) {
          priceEl.textContent = formatKz(isAnnual ? annual : monthly) + ' Kz';
        }
        if (noteEl) {
          noteEl.classList.toggle('is-visible', isAnnual);
        }
        if (totalEl && isAnnual) {
          totalEl.textContent = formatKz(annualTotal) + ' Kz';
        }
      });
    }

    annualBtns.forEach(function (btn) {
      btn.addEventListener('click', function () { setBilling('annual'); });
    });
    monthlyBtns.forEach(function (btn) {
      btn.addEventListener('click', function () { setBilling('monthly'); });
    });
    setBilling('annual');
  })();

  /* ---------- Slide-in on first load / scroll ---------- */
  (function initReveal() {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var selectors = [
      '.top-brand-mark',
      '.plans-x-header',
      '.plans-x-dashboard',
      '.plans-billing',
      '.plans-x-grid > .x-plan-card',
      '.trusted-block',
      '.plans-x-features-title',
      '.plans-x-feat-grid > .x-feat-card',
      '.plans-x-quote',
      '.expand-block',
      '.expand-pair',
      '.expand-more-block',
      '.expand-more-grid > .expand-more-card',
      '.plans-join-title',
      '.plans-billing--join',
      '.plans-join .plans-x-grid > .x-plan-card',
      '.contact-team-section'
    ];

    var nodes = [];
    selectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        nodes.push(el);
      });
    });

    if (!nodes.length) return;

    if (reduce) {
      nodes.forEach(function (el) { el.classList.add('reveal', 'is-in'); });
      return;
    }

    nodes.forEach(function (el, i) {
      el.classList.add('reveal', 'reveal--up');
      var delay = Math.min(i % 6, 5);
      if (delay > 0) el.classList.add('reveal--delay-' + delay);
    });

    // Stagger plan cards / feature cards left-to-right more clearly
    document.querySelectorAll('.plans-x-grid > .x-plan-card, .plans-x-feat-grid > .x-feat-card, .expand-more-grid > .expand-more-card').forEach(function (el, i) {
      el.classList.remove('reveal--delay-1', 'reveal--delay-2', 'reveal--delay-3', 'reveal--delay-4', 'reveal--delay-5');
      var d = Math.min(i + 1, 5);
      el.classList.add('reveal--delay-' + d);
    });

    if (!('IntersectionObserver' in window)) {
      nodes.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.12
    });

    nodes.forEach(function (el) { io.observe(el); });

    // Immediate first paint for above-the-fold brand + hero
    requestAnimationFrame(function () {
      ['.top-brand-mark', '.plans-x-header', '.plans-x-dashboard'].forEach(function (sel) {
        var el = document.querySelector(sel);
        if (el) el.classList.add('is-in');
      });
    });
  })();

  /* Init */
  setLanguage('pt');
})();
