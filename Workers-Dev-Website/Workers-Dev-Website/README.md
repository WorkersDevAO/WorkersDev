# Workers Dev Website

Marketing site for **Workers Dev**, an agency that builds and hosts professional websites for services and businesses in Angola.

- **Stack:** Pure HTML / CSS / JS (no frameworks)
- **Languages:** Portuguese (Angola) default · English toggle
- **Deploy:** Cloudflare Pages (or any static host) via GitHub

---

## Structure

```text
Workers-Dev-Website/
├── index.html          # Page markup
├── styles.css          # Brand styles (blue background, white cards)
├── script.js           # i18n, header, carousel, contact form
├── favicon.png
├── assets/
│   ├── clients/        # Project screenshots (carousel)
│   ├── promo-loja-online.jpg
│   ├── logo.png
│   ├── Moto.jpg        # Hero background
│   └── favicons…
└── README.md
```

---

## Sections

1. Announcement bar + header  
2. Hero (full-bleed image)  
3. **Planos** (X-style pricing cards + feature cards + trust line)  
4. **Clientes** (carousel of live projects, including +100 placeholder)  
5. Promo CTA (full-bleed)  
6. Sobre  
7. Como funciona  
8. **Site próprio** (managed vs ownership comparison + rules)  
9. Contacto (form + WhatsApp / email)  

---

## Plans (public)

| Plan | Build (one-time) | Maintenance / month |
|------|------------------|---------------------|
| **Básico** | 20.000 Kz | 2.500 Kz |
| **Profissional** | 42.000 Kz | 5.000 Kz |
| **Empresa** | 100.000 Kz | 12.000 Kz |

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
- **Prices:** `index.html` plan cards + contact chips; keep both in sync  
- **Clients carousel:** cards in `index.html` · images in `assets/clients/`  
- **Header / announce bar:** markup in `index.html` · behaviour in `script.js`  

---

## Brand

- Name: **Workers Dev**  
- Text wordmark on the site (no logo image in the header)  
- Page background: brand blue (`#0c2461`)  
- Cards and panels: white, elevated  
- Accent: lighter blue on the page (`#6b9bff`), primary blue on cards (`#1a56db`)  
