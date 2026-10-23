# Workers Dev Website

Marketing site for **Workers Dev**, an agency that builds and hosts professional websites for services and businesses in Angola.

- **Stack:** Pure HTML / CSS / JS (no frameworks, no build step)
- **Languages:** Portuguese (Angola) default · English toggle
- **Deploy:** Cloudflare Pages (or any static host) via GitHub

---

## Structure

```text
Workers-Dev-Website/
├── index.html          # Page markup
├── styles.css          # Brand styles (blue background, X-style sections)
├── script.js           # i18n, billing toggle, contact form, UI behaviour
├── favicon.png
├── assets/
│   ├── clients/        # Client site screenshots (trusted marquee)
│   ├── expand-*.jpg    # Feature mockups
│   ├── dashboard-workersdev.jpg
│   ├── logo.png / logo.jpg
│   ├── promo-loja-online.jpg
│   └── favicons…
└── README.md
```

---

## Sections

1. Top brand mark  
2. **Planos** (hero title, dashboard mockup, billing toggle, pricing cards)  
3. **Confiado por…** (continuous client-site marquee)  
4. Feature tools + expand blocks (credibility, data, domain)  
5. “E muito mais” extras grid  
6. Join CTA + repeated pricing cards  
7. **Site próprio** (managed vs ownership)  
8. Contacto (form + WhatsApp / email)

---

## Plans (public)

| Plan | Build (one-time) | Maintenance / month (monthly) | Maintenance / month (annual, −16%) |
|------|------------------|-------------------------------|-------------------------------------|
| **Básico** | 20.000 Kz | 2.500 Kz | 2.100 Kz |
| **Profissional** | 42.000 Kz | 5.000 Kz | 4.200 Kz |
| **Empresa** | 100.000 Kz | 12.000 Kz | 10.080 Kz |

Annual totals (maintenance only): Básico 25.200 Kz · Profissional 50.400 Kz · Empresa 120.960 Kz.

### Features

**Básico**
- Site profissional  
- Domínio gratuito em `oseunegocio.pages.dev`  
- Painel de administração  
- Alojamento de alta velocidade  
- SEO  
- 25 GB de armazenamento  
- Segurança  
- Suporte técnico diário  

**Profissional** — everything in Básico, plus:
- Cadastro e login de utilizadores  
- Área do cliente (portal da conta / página de perfil)  
- Até **250** contas de cliente  
- Actualizações e suporte prioritários  

**Empresa** — everything in Profissional, plus:
- Domínio personalizado `.com`  
- Vários tipos de utilizador (ex.: alunos, funcionários)  
- Até **1.000** contas de cliente  
- Maior capacidade e funcionalidades à medida  
- Admin avançado, relatórios e integrações  
- Suporte prioritário  

**Site próprio:** one-time = build price of the chosen plan. Full file transfer, no monthly fee. Free adjustments for 14 days after transfer, then **3.000 Kz** per change.

Heavy custom work (full e-commerce, advanced systems) is quoted separately.

---

## Contact form

The form **POSTs JSON** to a Cloudflare Worker, which sends email via **Resend** to **workersdevao@gmail.com**.

| Item | Value |
|------|--------|
| Worker URL | `https://old-lab-e4bacontact-form.workersdevao.workers.dev/` |
| Worker name | `old-lab-e4bacontact-form` |
| Secret | `RESEND_API_KEY` (Cloudflare Worker settings) |
| From (current) | `Workers Dev <onboarding@resend.dev>` |
| To | `workersdevao@gmail.com` |

Fields sent: `name`, `email`, `phone`, `business`, `location`, `plan`, `subject`, `message`.

Endpoint is set in `script.js` as `CONTACT_API`.

WhatsApp and email remain available as direct links on the page:

- WhatsApp: `+244 943 278 361`
- Email: `workersdevao@gmail.com`

### Optional: custom sending domain

While using `onboarding@resend.dev`, Resend may only deliver to your own account email.  
To send from your brand domain later:

1. Add and verify the domain in [Resend → Domains](https://resend.com/domains)  
2. Update the Worker `from` field, e.g. `Workers Dev <contacto@yourdomain.com>`  
3. Redeploy the Worker  

---

## Local preview

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
# or
python3 -m http.server 8080
```

---

## Deploy (Cloudflare Pages)

1. Push this folder to the GitHub repo (e.g. `WorkersDevAO/WorkersDev`)  
2. Cloudflare Pages → connect the repo  
3. Build: none (static) · Output directory: `/` (or the folder that contains `index.html`)  
4. Deploy  

After deploy, hard-refresh if assets or `script.js` look cached.

---

## Editing tips

- **Copy / i18n:** strings live in `script.js` under `translations.pt` and `translations.en`  
- **Prices:** plan cards in `index.html` (both grids) + `data-maint-monthly` / `data-maint-annual` attributes; billing toggle logic in `script.js`  
- **Plan features:** feature lists in both pricing grids in `index.html` · matching keys in `script.js`  
- **Client marquee:** items in `index.html` · images in `assets/clients/` · speed in `.trusted-track` (`styles.css`)  
- **Headings / layout:** main type scale and expand grids in `styles.css`

---

## Brand

- Name: **Workers Dev**  
- Page background: brand blue (`#0c2461`)  
- Accent: lighter blue (`#6b9bff`)  
- Layout inspired by X Premium Business–style marketing pages  
