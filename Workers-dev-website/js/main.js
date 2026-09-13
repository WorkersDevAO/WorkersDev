/* Workers Dev — i18n + UI */

const translations = {
  pt: {
    // Nav
    "nav.home": "Início",
    "nav.what": "O Que Fazemos",
    "nav.clients": "Clientes",
    "nav.pricing": "Preços",
    "nav.contact": "Contato",
    // Hero
    "hero.badge": "Sites profissionais em Angola",
    "hero.title": "Sites que funcionam para o seu serviço ou negócio",
    "hero.sub": "Rápidos e profissionais para salões, lojas, freelancers e mais. Design limpo. Prontos para WhatsApp. Planos que crescem consigo.",
    "hero.cta": "Quero Meu Site",
    "hero.cta2": "Ver planos",
    // About
    "about.title": "Sites profissionais sem dor de cabeça",
    "about.sub": "Criamos sites limpos e profissionais para o seu serviço ou negócio e lançamos rápido — para você focar nos clientes.",
    "pillar1.title": "Simples e Limpo",
    "pillar1.text": "Sites modernos e rápidos. Sem builders pesados. Carrega instantaneamente e fica bem em qualquer dispositivo.",
    "pillar2.title": "Feito para o Seu Negócio",
    "pillar2.text": "Conteúdo à medida, galeria, preços e contacto claro com botão de WhatsApp para o cliente falar consigo num toque.",
    "pillar3.title": "Pronto em Poucos Dias",
    "pillar3.text": "A maioria dos sites fica no ar em poucos dias. Planos da presença básica a sistemas completos.",
    // Counters
    "count.clients": "Clientes satisfeitos",
    "count.sites": "Sites lançados",
    "count.days": "Dias para entregar",
    "count.host": "% hospedagem incluída",
    // Features
    "feat.title": "Tudo o que o seu serviço precisa",
    "feat.sub": "Design limpo. Serviços claros. Contacto num toque. Sem complexidade.",
    "feat1.title": "Fácil de personalizar",
    "feat1.text": "Serviços, preços, fotos e contactos — tudo adaptado ao seu negócio.",
    "feat2.title": "Pronto para WhatsApp",
    "feat2.text": "Botão de um toque para o cliente enviar mensagem e fechar o negócio.",
    "feat3.title": "Lançamento rápido",
    "feat3.text": "A maioria dos sites fica online em poucos dias. Sem processos longos.",
    "feat4.title": "Design limpo",
    "feat4.text": "Visual moderno e profissional que funciona bem no telemóvel e no computador.",
    "feat5.title": "Planos flexíveis",
    "feat5.text": "Da presença online simples a login, marcações e dashboards.",
    "feat6.title": "Sem complexidade",
    "feat6.text": "Nós tratamos da parte técnica. Você só usa o site.",
    // How
    "how.title": "Como funciona",
    "how.sub": "Processo simples. Resultados claros. Sem dor de cabeça técnica para si.",
    "how1.title": "Conte-nos sobre o negócio",
    "how1.text": "Partilhe serviços, fotos, preços e como os clientes costumam contactá-lo. Nós tratamos do resto.",
    "how2.title": "Nós construímos e personalizamos",
    "how2.text": "Criamos o site à sua marca, adicionamos o conteúdo e deixamos o WhatsApp pronto.",
    "how3.title": "O site fica online",
    "how3.text": "Rápido, mobile-friendly. Recebe o link e começa a partilhar com os clientes.",
    // Tips
    "tips.title": "Últimas dicas",
    "tips.sub": "Conselhos simples para o seu serviço parecer mais profissional online.",
    "tip1.label": "Presença",
    "tip1.title": "Por que todo serviço precisa de um site simples",
    "tip1.text": "Uma presença online limpa gera confiança, responde às dúvidas dos clientes e facilita o contacto pelo WhatsApp.",
    "tip2.label": "WhatsApp",
    "tip2.title": "Como um botão de WhatsApp acelera o contacto",
    "tip2.text": "Com o WhatsApp integrado, a comunicação fica mais rápida e directa — um toque e já estão a conversar.",
    "tip3.label": "Hospedagem",
    "tip3.title": "Hospedagem que ainda parece profissional",
    "tip3.text": "Pode começar com hospedagem incluída. Se quiser domínio personalizado (ex: seunegocio.com), há um custo extra.",
    // Pricing
    "price.title": "Planos e Preços",
    "price.sub": "Escolha o plano ideal para o seu negócio. Mensal ou anual. Suporte incluído.",
    "price.bro.name": "Worker's Bro",
    "price.bro.amount": "2.500 Kz",
    "price.bro.period": "/mês",
    "price.bro.ideal": "Ideal para pequenos negócios e serviços que precisam de presença clara e profissional online.",
    "price.bro.f1": "Site hospedado na Workers Dev",
    "price.bro.f2": "Alterações básicas de texto e imagens",
    "price.bro.f3": "Botão / link de WhatsApp",
    "price.bro.f4": "Manutenção técnica básica",
    "price.family.name": "Worker's Family",
    "price.family.amount": "25.000 Kz",
    "price.family.period": "/ano",
    "price.family.ideal": "O mesmo do Bro, com pagamento único anual. Poupe 5.000 Kz.",
    "price.family.f1": "Tudo do Worker's Bro",
    "price.family.f2": "Pagamento único por ano",
    "price.family.f3": "Poupe 5.000 Kz vs mensal",
    "price.family.f4": "Sem renovar todos os meses",
    "price.pro.name": "Pro",
    "price.pro.amount": "35.000 Kz",
    "price.pro.period": "/mês",
    "price.pro.ideal": "Para negócios em crescimento que precisam de sistemas reais no site.",
    "price.pro.f1": "Tudo do Bro +",
    "price.pro.f2": "Área de cliente (dashboard)",
    "price.pro.f3": "Pedidos / formulários / booking",
    "price.pro.f4": "Base de dados + suporte prioritário",
    "price.empresa.name": "Empresa",
    "price.empresa.amount": "75–120k Kz",
    "price.empresa.period": "/mês",
    "price.empresa.ideal": "Para negócios maiores. Ou orçamento personalizado.",
    "price.empresa.f1": "Tudo do Pro +",
    "price.empresa.f2": "Funcionalidades personalizadas",
    "price.empresa.f3": "Mais capacidade e admin avançado",
    "price.empresa.f4": "Integrações, relatórios e suporte dedicado",
    "price.cta": "Começar agora",
    "price.cta2": "Falar connosco",
    "price.badge": "Popular",
    // Clients
    "clients.title": "Negócios e serviços que confiam em nós",
    "clients.sub": "Presença online profissional para quem serve clientes todos os dias.",
    // Contact
    "contact.title": "Fale connosco",
    "contact.sub": "Preencha o formulário — respondemos depressa. Ou escolha um plano abaixo.",
    "contact.name": "Nome",
    "contact.email": "Email",
    "contact.phone": "Telefone / WhatsApp",
    "contact.business": "Tipo de negócio / serviço",
    "contact.location": "Localização",
    "contact.plan": "Plano desejado",
    "contact.plan.placeholder": "Seleccione um plano",
    "contact.plan.unsure": "Ainda não tenho a certeza",
    "contact.message": "Mensagem",
    "contact.submit": "Enviar mensagem",
    "contact.note": "A mensagem abre no WhatsApp com os seus dados preenchidos. Responderemos o mais breve possível.",
    // Footer
    "footer.copy": "© 2026 Workers Dev — sites profissionais para serviços e negócios em Angola",
    "footer.home": "Início",
    "footer.pricing": "Preços",
    "footer.contact": "Contato"
  },
  en: {
    "nav.home": "Home",
    "nav.what": "What We Do",
    "nav.clients": "Clients",
    "nav.pricing": "Pricing",
    "nav.contact": "Contact",
    "hero.badge": "Professional sites in Angola",
    "hero.title": "Websites that work for your service or business",
    "hero.sub": "Fast, professional sites for salons, shops, freelancers and more. Clean design. WhatsApp-ready. Plans that grow with you.",
    "hero.cta": "Get My Site",
    "hero.cta2": "See plans",
    "about.title": "Professional sites without the headache",
    "about.sub": "We build clean professional sites for your service or business and launch quickly — so you can focus on clients.",
    "pillar1.title": "Simple & Clean",
    "pillar1.text": "Fast modern sites. No heavy builders. Loads instantly and looks professional on any device.",
    "pillar2.title": "Made for Your Business",
    "pillar2.text": "Tailored content, gallery, prices and clear contact with a WhatsApp button so customers reach you in one tap.",
    "pillar3.title": "Ready in a Few Days",
    "pillar3.text": "Most sites go live in a few days. Plans from basic presence to full systems.",
    "count.clients": "Happy clients",
    "count.sites": "Sites launched",
    "count.days": "Days to deliver",
    "count.host": "% hosting included",
    "feat.title": "Everything your service business needs",
    "feat.sub": "Clean design. Clear services. One-tap contact. No complexity.",
    "feat1.title": "Easy to customize",
    "feat1.text": "Services, prices, photos and contact details — all tailored to your business.",
    "feat2.title": "WhatsApp ready",
    "feat2.text": "One-tap button so customers can message you instantly and close the deal.",
    "feat3.title": "Fast launch",
    "feat3.text": "Most sites go live in a few days. No long waiting or complicated processes.",
    "feat4.title": "Clean design",
    "feat4.text": "Modern professional look that works perfectly on phones and computers.",
    "feat5.title": "Flexible plans",
    "feat5.text": "From simple online presence to login, bookings and dashboards.",
    "feat6.title": "No complexity",
    "feat6.text": "We handle the tech. You just use the site.",
    "how.title": "How it works",
    "how.sub": "Simple process. Clear results. No technical headache for you.",
    "how1.title": "Tell us about your business",
    "how1.text": "Share your services, photos, prices and how customers usually contact you. We handle the rest.",
    "how2.title": "We build and customize",
    "how2.text": "We create the site to your brand, add your content and leave WhatsApp ready for clients.",
    "how3.title": "Your site goes live",
    "how3.text": "Fast, mobile-friendly. You get the link and can start sharing it right away.",
    "tips.title": "Latest tips",
    "tips.sub": "Simple advice to help your service business look more professional online.",
    "tip1.label": "Presence",
    "tip1.title": "Why every service needs a simple site",
    "tip1.text": "A clean online presence builds trust, answers client questions and makes WhatsApp contact easier.",
    "tip2.label": "WhatsApp",
    "tip2.title": "How a WhatsApp button speeds up contact",
    "tip2.text": "With WhatsApp integrated, communication is faster and direct — one tap and you're talking.",
    "tip3.label": "Hosting",
    "tip3.title": "Hosting that still looks professional",
    "tip3.text": "You can start with included hosting. A custom domain (e.g. yourbusiness.com) costs extra.",
    "price.title": "Plans & Pricing",
    "price.sub": "Choose the plan that fits your business. Monthly or yearly. Support included.",
    "price.bro.name": "Worker's Bro",
    "price.bro.amount": "2,500 Kz",
    "price.bro.period": "/month",
    "price.bro.ideal": "Ideal for small businesses and services that need a clear, professional online presence.",
    "price.bro.f1": "Hosted on Workers Dev",
    "price.bro.f2": "Basic text & image updates",
    "price.bro.f3": "WhatsApp button / link",
    "price.bro.f4": "Basic technical maintenance",
    "price.family.name": "Worker's Family",
    "price.family.amount": "25,000 Kz",
    "price.family.period": "/year",
    "price.family.ideal": "Same as Bro, one yearly payment. Save 5,000 Kz.",
    "price.family.f1": "Everything in Worker's Bro",
    "price.family.f2": "One payment per year",
    "price.family.f3": "Save 5,000 Kz vs monthly",
    "price.family.f4": "No monthly renewals",
    "price.pro.name": "Pro",
    "price.pro.amount": "35,000 Kz",
    "price.pro.period": "/month",
    "price.pro.ideal": "For growing businesses that need real systems on the site.",
    "price.pro.f1": "Everything in Bro +",
    "price.pro.f2": "Client area (dashboard)",
    "price.pro.f3": "Orders / forms / booking",
    "price.pro.f4": "Database + priority support",
    "price.empresa.name": "Empresa",
    "price.empresa.amount": "75–120k Kz",
    "price.empresa.period": "/month",
    "price.empresa.ideal": "For larger businesses. Or custom quote.",
    "price.empresa.f1": "Everything in Pro +",
    "price.empresa.f2": "Custom features",
    "price.empresa.f3": "More capacity & advanced admin",
    "price.empresa.f4": "Integrations, reports & dedicated support",
    "price.cta": "Get started",
    "price.cta2": "Talk to us",
    "price.badge": "Popular",
    "clients.title": "Businesses and services that trust us",
    "clients.sub": "Professional online presence for those who serve clients every day.",
    "contact.title": "Get in touch",
    "contact.sub": "Fill in the form — we reply quickly. Or pick a plan below.",
    "contact.name": "Name",
    "contact.email": "Email",
    "contact.phone": "Phone / WhatsApp",
    "contact.business": "Business / service type",
    "contact.location": "Location",
    "contact.plan": "Desired plan",
    "contact.plan.placeholder": "Select a plan",
    "contact.plan.unsure": "Not sure yet",
    "contact.message": "Message",
    "contact.submit": "Send message",
    "contact.note": "The message opens in WhatsApp with your details pre-filled. We will reply as soon as possible.",
    "footer.copy": "© 2026 Workers Dev — professional sites for services and businesses in Angola",
    "footer.home": "Home",
    "footer.pricing": "Pricing",
    "footer.contact": "Contact"
  }
};

let currentLang = localStorage.getItem("wd-lang") || "pt";

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("wd-lang", lang);
  document.documentElement.lang = lang === "pt" ? "pt" : "en";

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (translations[lang][key]) {
      el.placeholder = translations[lang][key];
    }
  });

  // Update lang buttons
  document.querySelectorAll(".lang-toggle button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  // Update price badge attr if needed
  document.querySelectorAll(".price-card.featured").forEach((card) => {
    card.setAttribute("data-badge", translations[lang]["price.badge"]);
  });
}

function initLangToggle() {
  document.querySelectorAll(".lang-toggle button").forEach((btn) => {
    btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
  });
  setLanguage(currentLang);
}

function initMobileMenu() {
  const btn = document.querySelector(".menu-btn");
  const nav = document.querySelector(".mobile-nav");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    btn.classList.toggle("open");
    nav.classList.toggle("open");
    document.body.style.overflow = nav.classList.contains("open") ? "hidden" : "";
  });

  nav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      btn.classList.remove("open");
      nav.classList.remove("open");
      document.body.style.overflow = "";
    });
  });
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  // WhatsApp number (Angola +244)
  const WHATSAPP_NUMBER = "244943278361";

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get("name") || "";
    const email = data.get("email") || "";
    const phone = data.get("phone") || "";
    const business = data.get("business") || "";
    const location = data.get("location") || "";
    const plan = data.get("plan") || "";
    const message = data.get("message") || "";

    const text = [
      "Olá Workers Dev — pedido de site",
      "",
      `Nome: ${name}`,
      `Email: ${email}`,
      `Telefone: ${phone}`,
      `Negócio/Serviço: ${business}`,
      `Localização: ${location}`,
      `Plano: ${plan}`,
      "",
      `Mensagem: ${message}`
    ].join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  });

  // Plan chips select plan
  document.querySelectorAll(".plan-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".plan-chip").forEach((c) => c.classList.remove("selected"));
      chip.classList.add("selected");
      const planSelect = form.querySelector('[name="plan"]');
      if (planSelect) planSelect.value = chip.dataset.plan || "";
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initLangToggle();
  initMobileMenu();
  initContactForm();
});
