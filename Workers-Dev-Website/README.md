# Workers Dev Website

Marketing site for **Workers Dev**, an agency that builds and hosts professional websites for services and businesses in Angola.

Layout and flow are inspired by **X Premium Business**–style marketing pages (minimal top brand, dashboard mockup, billing toggle, trusted marquee, feature tools, repeated pricing, contact CTA).

- **Stack:** Pure HTML / CSS / JS (no frameworks, no build step)
- **Languages:** Portuguese (Angola) default · English toggle
- **Deploy:** Cloudflare Pages (static) · API on Cloudflare Workers + KV

---

## Structure

```text
Workers-Dev-Website/
├── index.html              # Main marketing page
├── styles.css              # Brand styles (blue background, X-style sections)
├── script.js               # i18n, billing toggle, UI behaviour
├── contacto.html           # Contact form page
├── admin.html              # Private admin (leads + clients) — noindex
├── admin.js                # Admin login, leads, client subscriptions UI
├── favicon.png
├── assets/
│   ├── clients/            # Client screenshots (trusted marquee)
│   ├── dashboard-workersdev.jpg
│   ├── feat-*.jpg / expand-*.jpg
│   ├── logo.png / logo.jpg
│   └── favicons…
├── worker/
│   ├── worker.js           # Contact API + Clients / Subscriptions API
│   └── wrangler.toml       # Worker name + KV binding
├── BLUEPRINT.md            # Architecture, data model, endpoints
└── README.md
```

---

## Sections (`index.html`)

1. **Top brand** — favicon + “True Greatness Is Serving Others” · EN/PT toggle  
2. **Planos hero** (`#planos`) — title, subtitle, “Começar agora”, dashboard mockup  
3. **Billing + pricing** (`#planos-precos`) — Anual / Mensal toggle (−16% annual) · 3 plan cards  
4. **Trusted marquee** (`#clientes`) — continuous client screenshots  
5. **Tools** — credibility, analytics, free domain  
6. **Testimonial** (`#testemunho`) — Nara Vazz quote  
7. **Expand blocks** — detailed feature rows + mockups  
8. **E muito mais** — client dashboard, admin, SEO  
9. **Join + pricing again** (`#planos-join`)  
10. **Contact team CTA** → `contacto.html`

---

## Plans (public)

| Plan | Build (one-time) | Maintenance / month | Annual (−16%) / month | Annual total |
|------|------------------|---------------------|------------------------|--------------|
| **Básico** | 19.000 Kz | 2.500 Kz | 2.100 Kz | 25.200 Kz |
| **Profissional** | 39.000 Kz | 5.000 Kz | 4.200 Kz | 50.400 Kz |
| **Empresa** | 99.000 Kz | 12.000 Kz | 10.080 Kz | 120.960 Kz |

Construction is one-time. The toggle only changes **maintenance** display.

---

## Admin (`admin.html`)

Password-protected panel (same `ADMIN_PASSWORD` as the Worker).

### Layout
- **Left sidebar** — Contactos · Clientes · Contas · **Grok** · Websites · Pendentes · Actualizar · Sair  
- **Main area** — list / summary for the active section  
- **Right slide-over** — client detail + payment periods  

### Contactos
- List leads from the public contact form  
- Delete individual leads  

### Clientes (subscriptions)
- Summary: total · active · overdue · expected revenue this month  
- Filters: Todos / Em atraso / Activos  
- Create / edit / delete clients  
- Monthly recurring periods (anniversary date model)  
- Mark period as paid · Generate next period  
- Sequential invoice numbers (starts at **1001**)  
- Full billing fields: contact name, phone, email, address, NIF, plan, notes  

### Grok (free-tier accounts)
- Dedicated list of Gmail accounts used for Grok free tier  
- **Marcar limite (24h)** starts a countdown; **Limpar cooldown** clears it  
- Filters: Todos / Disponíveis / Em cooldown · live remaining time · summary counts  
- Import from Contas (Google) when list is empty · CSV export  

See **BLUEPRINT.md** for data model and API details.

---

## API (`worker/`)

Cloudflare Worker **`workersdev-contact-api`**.

### Public

| Method | Path | Auth | Role |
|--------|------|------|------|
| `POST` | `/` or `/contact` | none | Save lead to KV + optional email (Resend) |

### Admin (header `X-Admin-Password`)

| Method | Path | Role |
|--------|------|------|
| `GET` | `/leads` | List leads |
| `DELETE` | `/leads` | Delete one lead (`{ id }`) |
| `GET` | `/clients` | List clients + summary |
| `POST` | `/clients` | Create client + first period |
| `PUT` | `/clients` | Update client |
| `DELETE` | `/clients` | Delete client |
| `POST` | `/clients/period` | `next` · `mark_paid` · `edit` · `add` |

**KV keys** (same namespace `LEADS`): `leads` · `clients` · `invoice_meta`  

**Secrets:** `ADMIN_PASSWORD` · `RESEND_API_KEY` (optional)

**Email:** `Workers Dev <onboarding@resend.dev>` → `workersdevao@gmail.com`

### Deploy the Worker

```bash
cd worker
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put RESEND_API_KEY   # optional
npx wrangler deploy
```

After any change to `worker.js`, redeploy. Static admin/UI changes only need a Pages redeploy (or hard refresh if testing locally).

---

## Contact channels

- WhatsApp: `+244 943 278 361`  
- Email: `workersdevao@gmail.com`

---

## Local testing

Open `admin.html` in the browser (or via a static server).  
The admin talks to the **deployed** Worker URL defined in `admin.js` (`API_BASE`).  
Ensure the Worker is deployed and `ADMIN_PASSWORD` matches what you type at login.
