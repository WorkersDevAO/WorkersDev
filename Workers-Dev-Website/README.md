# Workers Dev Website

Marketing site for **Workers Dev**, an agency that builds and hosts professional websites for services and businesses in Angola.

Layout and flow are inspired by **X Premium Business**–style marketing pages (minimal top brand, dashboard mockup, billing toggle, trusted marquee, feature tools, repeated pricing, contact CTA).

- **Stack:** Pure HTML / CSS / JS (no frameworks, no build step)
- **Languages:** Portuguese (Angola) default · English toggle
- **Deploy:** Cloudflare Pages (static) · Contact API on Cloudflare Workers + KV

---

## Structure

```text
Workers-Dev-Website/
├── index.html              # Main marketing page
├── styles.css              # Brand styles (blue background, X-style sections)
├── script.js               # i18n, billing toggle, UI behaviour
├── admin.html              # Private leads admin UI (noindex)
├── admin.js                # Admin login + leads list/delete
├── favicon.png
├── assets/
│   ├── clients/            # Client screenshots (trusted marquee) + naravazz-logo
│   ├── dashboard-workersdev.jpg
│   ├── feat-*.jpg          # Feature card visuals
│   ├── expand-*.jpg        # Expanded feature mockups
│   ├── logo.png / logo.jpg
│   ├── promo-loja-online.jpg
│   ├── Moto.jpg            # Legacy hero asset (unused on current home)
│   └── favicons…
├── worker/
│   ├── worker.js           # Contact API (POST form, GET/DELETE leads)
│   └── wrangler.toml       # Worker name + KV binding
└── README.md
```

Plan CTAs and the team contact button link to **`contacto.html`** (separate contact page; not in this folder snapshot — add or point those links if missing on deploy).

---

## Sections (`index.html`)

1. **Top brand** — favicon + “True Greatness Is Serving Others” (side by side) · EN/PT toggle  
2. **Planos hero** (`#planos`) — title, subtitle, “Começar agora”, dashboard mockup  
3. **Billing + pricing** (`#planos-precos`) — “Construa credibilidade…” · Anual / Mensal toggle (−16% annual) · 3 plan cards  
4. **Trusted marquee** (`#clientes`) — “Confiável para dezenas de negócios” · continuous client screenshots only  
5. **Tools** — “Ferramentas desenvolvidas para ajudar você a progredir”  
   - Aumente a credibilidade e a visibilidade  
   - Obtenha informações em tempo real  
   - Acesse um domínio gratuito  
6. **Testimonial** (`#testemunho`) — Nara Vazz quote  
7. **Expand blocks** — detailed credibility / analytics / domain rows + mockup images  
8. **E muito mais** — client dashboard, admin panel, SEO cards  
9. **Join + pricing again** (`#planos-join`) — second billing toggle + plan cards  
10. **Contact team CTA** — “Dúvidas? Fale com a nossa equipa” → `contacto.html`

No announcement bar, classic nav, hamburger, or full-bleed photo hero on the home page.

---

## Plans (public)

| Plan | Build (one-time) | Maintenance / month | Annual (−16%) / month | Annual total |
|------|------------------|---------------------|------------------------|--------------|
| **Básico** | 20.000 Kz | 2.500 Kz | 2.100 Kz | 25.200 Kz |
| **Profissional** | 42.000 Kz | 5.000 Kz | 4.200 Kz | 50.400 Kz |
| **Empresa** | 100.000 Kz | 12.000 Kz | 10.080 Kz | 120.960 Kz |

Construction price is always one-time. The toggle only changes **maintenance** display (monthly vs annual billing at 16% off).

### Feature lists (as on the cards)

**Básico**  
Site profissional · Domínio gratuito em `oseunegocio.pages.dev` · Painel de administração · Alojamento de alta velocidade · SEO · 25 GB · Segurança · Suporte técnico diário  

**Profissional** — everything in Básico, plus:  
Cadastro e login · Área do cliente · Até **1.000** contas de cliente · Actualizações e suporte prioritários  

**Empresa** — everything in Profissional, plus:  
Domínio personalizado `.com` · Vários tipos de utilizador · Até **10.000** contas · Capacidade / funcionalidades à medida · Admin avançado, relatórios e integrações · Suporte prioritário  

Heavy custom work (full e-commerce, advanced systems) is quoted separately.

---

## Contact API (`worker/`)

Cloudflare Worker **`workersdev-contact-api`**:

| Method | Path | Auth | Role |
|--------|------|------|------|
| `POST` | `/` | public | Save lead to KV + optional email via Resend |
| `GET` | `/leads` | `X-Admin-Password` | List leads |
| `DELETE` | `/leads` | `X-Admin-Password` + body `{ id }` | Delete one lead |

- **KV binding:** `LEADS` (see `wrangler.toml`)  
- **Secrets:** `ADMIN_PASSWORD`, `RESEND_API_KEY` (optional; without it, leads still save to KV)  
- **Email:** From `Workers Dev <onboarding@resend.dev>` → `workersdevao@gmail.com`  
- **Fields:** `name`, `email`, `phone`, `business`, `location`, `plan`, `subject`, `message`

WhatsApp / email still used as direct contact channels:

- WhatsApp: `+244 943 278 361`  
- Email: `workersdevao@gmail.com`

### Deploy the Worker

```bash
cd worker
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put RESEND_API_KEY   # optional
npx wrangler deploy
```

Point the contact form’s API URL (in the contact page / form script) at the deployed Worker URL.

### Optional: custom sending domain

While using `onboarding@resend.dev`, Resend may only deliver to your account email. To send from a brand domain:

1. Verify the domain in [Resend → Domains](https://resend.com/domains)  
2. Update the Worker `from` field (e.g. `Workers Dev <contacto@yourdomain.com>`)  
3. Redeploy  

---

## Admin (`admin.html`)

- Password gate via Worker (`X-Admin-Password`)  
- Lists leads from KV, delete one-by-one  
- `noindex, nofollow`  
- Uses shared `styles.css` + `admin.js`

Do not link the admin page from the public site.

---

## Local preview

```bash
npx serve .
# or
python3 -m http.server 8080
```

Open `index.html` (or the serve URL). Admin: open `admin.html` and use the Worker password.

---

## Deploy (Cloudflare Pages)

1. Push this folder to the GitHub repo (e.g. `WorkersDevAO/WorkersDev`)  
2. Cloudflare Pages → connect the repo  
3. Build: none (static) · Output directory: `/` (folder that contains `index.html`)  
4. Deploy  

Hard-refresh after deploy if `styles.css`, `script.js`, or images look cached.

---

## Editing tips

| What | Where |
|------|--------|
| Copy / i18n | `script.js` → `translations.pt` / `translations.en` |
| Plan prices & annual math | `index.html` plan cards · `data-maint-monthly` / `data-maint-annual` / `data-maint-annual-total` · toggle in `script.js` |
| Plan feature bullets | Both pricing grids in `index.html` + matching keys in `script.js` |
| Client marquee | Items in `index.html` · images in `assets/clients/` · animation `.trusted-track` in `styles.css` |
| Feature / expand visuals | `assets/feat-*.jpg`, `assets/expand-*.jpg` |
| Dashboard mockup | `assets/dashboard-workersdev.jpg` |
| Brand colours | `:root` in `styles.css` — `--bg` / `--brand` `#0c2461`, accent `#6b9bff` |

---

## Brand

- **Name:** Workers Dev  
- **Motto:** True Greatness Is Serving Others  
- **Page background:** brand blue `#0c2461`  
- **Accent:** `#6b9bff`  
- **Cards / panels:** darker blue elevated surfaces, white text  
- **Layout language:** X Premium Business–style marketing (not a clone of product UI)  
