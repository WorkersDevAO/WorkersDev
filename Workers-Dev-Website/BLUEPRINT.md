# Workers Dev — Technical Blueprint

Architecture, data model, and contracts for the marketing site + admin + API.

**Last updated:** 2026-11-21

---

## 1. System overview

```text
┌─────────────────────┐     static      ┌──────────────────────┐
│  Cloudflare Pages   │ ◄────────────── │  index / contacto /  │
│  (HTML/CSS/JS)      │                 │  admin.html + admin.js│
└─────────────────────┘                 └──────────┬───────────┘
                                                   │ fetch
                                                   │ X-Admin-Password
                                                   ▼
                                        ┌──────────────────────┐
                                        │  Cloudflare Worker   │
                                        │  workersdev-contact- │
                                        │  api                 │
                                        └──────────┬───────────┘
                                                   │
                                        ┌──────────▼───────────┐
                                        │  KV namespace LEADS   │
                                        │  keys: leads,        │
                                        │  clients,            │
                                        │  invoice_meta        │
                                        └──────────────────────┘
```

- **Public site:** pure static (no client-side secrets, no hydration).
- **Admin:** static UI; all mutation goes through the Worker.
- **Worker:** edge runtime only (no Node-only APIs).
- **Auth:** shared secret `ADMIN_PASSWORD` sent as header `X-Admin-Password`.

---

## 2. Admin UI

| Area | Behaviour |
|------|-----------|
| Login | Password + optional “Manter sessão” (localStorage / sessionStorage) |
| Shell | Left sidebar (Contactos · Clientes) + main content |
| Contactos | Lead cards · delete |
| Clientes | Summary strip · filters · client cards · inline create/edit form |
| Periods | Right slide-over panel (overlay + close on ✕ / backdrop) |

Mobile: sidebar becomes off-canvas; slide-over goes full width.

---

## 3. Data model (KV)

### 3.1 `leads` (array)

Contact-form submissions. Newest first. Soft cap ~500.

```js
{
  id: string,
  createdAt: ISO8601,
  name, email, phone, business, location, plan, subject, message
}
```

### 3.2 `clients` (array)

Active subscription clients. Soft cap ~200.

```js
{
  id: string,
  name: string,                 // e.g. "Wakanda Training"
  website: string,              // e.g. "wakandatraining.com"
  startDate: "YYYY-MM-DD",      // anniversary anchor
  monthlyAmount: number,        // Kz
  plan: string,                 // Básico | Profissional | Empresa | …
  contactName: string,
  phone: string,
  email: string,
  address: string,
  nif: string,
  notes: string,
  status: "active" | "paused" | "ended",
  periods: PaymentPeriod[],
  createdAt: ISO8601,
  updatedAt: ISO8601
}
```

### 3.3 `PaymentPeriod` (embedded in client)

```js
{
  id: string,
  periodStart: "YYYY-MM-DD",
  periodEnd: "YYYY-MM-DD",      // typically start + 1 calendar month
  amount: number,               // snapshot at creation (history preserved)
  status: "pending" | "paid" | "overdue" | "cancelled",
  // "overdue" is computed on read if periodEnd < today and status was pending
  paidAt: ISO8601 | null,
  invoiceNumber: number,        // sequential
  note: string,
  createdAt: ISO8601
}
```

### 3.4 `invoice_meta`

```js
{ lastInvoiceNumber: number }   // default seed 1000 → first issued = 1001
```

---

## 4. Business rules

| Rule | Detail |
|------|--------|
| Period model | Monthly, anniversary-based (`startDate` day each month) |
| First period | Created on client create: `[startDate, startDate+1 month)` |
| Next period | Starts at previous `periodEnd`; uses **current** `monthlyAmount` |
| Amount change | Only future periods use the new amount; past periods keep their snapshot |
| Overdue | `periodEnd < today` and status not `paid` / `cancelled` (no grace) |
| Invoice numbers | Atomic increment via `invoice_meta`; starting sequence **1001** |
| Delete client | Removes client and all embedded periods |

---

## 5. API contracts

Base URL (production):  
`https://workersdev-contact-api.workersdevao.workers.dev`

All admin routes require header:

```http
X-Admin-Password: <secret>
```

### 5.1 Leads

- `GET /leads` → `{ ok, leads[], total }`
- `DELETE /leads` body `{ id }` → `{ ok, total }`

### 5.2 Clients

- `GET /clients` → `{ ok, clients[], summary }`  
  `summary`: `{ total, active, overdue, expectedThisMonth }`  
  Each client is enriched with `overdueCount` and `nextDue`.

- `POST /clients` body (required: `name`, `startDate`, `monthlyAmount`)  
  → creates client + first period + next invoice number  
  → `{ ok, client }`

- `PUT /clients` body `{ id, ...fields }` → `{ ok, client }`

- `DELETE /clients` body `{ id }` → `{ ok, total }`

### 5.3 Periods — `POST /clients/period`

| `action` | Required fields | Effect |
|----------|-----------------|--------|
| `next` | `clientId` | Append next period; assign new invoice number |
| `mark_paid` | `clientId`, `periodId` | Set status `paid`, set `paidAt` |
| `edit` | `clientId`, `periodId`, optional fields | Patch period |
| `add` | `clientId`, `periodStart`, `periodEnd`, `amount` | Manual period (+ optional invoice number) |

Response: `{ ok, client }` (enriched).

---

## 6. Security

- Admin password never in client bundles beyond what the user types (stored only in browser storage after login).
- No secrets in public HTML/JS.
- XSS: admin renders with `escapeHtml` on all dynamic text.
- CORS: open for the static origin; methods limited to those used.
- KV writes only from authenticated Worker handlers.

---

## 7. Deploy checklist

1. **Worker**
   ```bash
   cd worker
   npx wrangler secret put ADMIN_PASSWORD
   npx wrangler secret put RESEND_API_KEY   # optional
   npx wrangler deploy
   ```
2. Confirm `API_BASE` in `admin.js` matches the deployed Worker URL.
3. **Pages** — deploy the static folder (or push to the connected Git repo).
4. Open `/admin.html` → login → test Clientes create / mark paid / next period.

---

## 8. Accounts / Websites / Pending clients

KV keys (same namespace `LEADS`): `accounts` · `websites` · `pending_clients`

### 8.1 `accounts`
```js
{ id, type: "google"|"microsoft"|"github"|"cloudflare"|"cloudinary"|"facebook"|"instagram"|"x"|"other",
  emailOrUsername, password, notes, createdAt, updatedAt }
```
Endpoints: `GET/POST/PUT/DELETE /accounts`  
Auto-seeds Google + Microsoft list on first empty load.  
`POST /seed` merges missing seed rows without overwriting.

### 8.2 `websites`
```js
{ id, name, domain, cloudflareAccountId, githubAccountId, cloudinaryAccountId,
  notes, status: "active"|"paused"|"archived", createdAt, updatedAt }
```
Endpoints: `GET/POST/PUT/DELETE /websites`  
`GET` enriches with linked account emails.

### 8.3 `pending_clients`
```js
{ id, name, contactName, phone, instagram, facebook, notes,
  status: "pending"|"contacted"|"proposal"|"won"|"lost", createdAt, updatedAt }
```
Endpoints: `GET/POST/PUT/DELETE /pending_clients`  
`POST /pending_clients/bulk_status` body `{ ids[], status }`

Admin UI tabs: **Contas** · **Grok** · **Websites** · **Pendentes**  
Features: search, type/status filters, password reveal, CSV export, bulk status, seed button.

### 8.4 `grok_accounts` (Grok free-tier cooldown)

```js
{
  id, email, password, label, notes,
  cooldownUntil: ISO8601 | null,   // null = available
  createdAt, updatedAt
}
```

Endpoints (admin auth):
- `GET /grok_accounts` → list + summary `{ available, onCooldown }`
- `POST /grok_accounts` · `PUT /grok_accounts` · `DELETE /grok_accounts`
- `POST /grok_accounts/cooldown` body `{ id, action: "mark"|"clear" }`  
  `mark` sets `cooldownUntil = now + 24h`
- `POST /grok_accounts/seed` — copies Google accounts from Contas **only if** Grok list is empty

UI: summary strip, filters (Todos / Disponíveis / Em cooldown), live countdown, mark/clear buttons. Sort: available first, then soonest-to-expire.

---

## 9. Out of scope (planned later)

- Automatic WhatsApp / Gmail invoice messages  
- PDF invoice generation  
- Public client portal  
- Background cron for overdue (currently computed on read)  
- Live API sync with GitHub / Cloudflare / Cloudinary  

These can sit on top of the existing data without schema breakage.

---

## 10. File ownership

| Concern | File(s) |
|---------|---------|
| Marketing page | `index.html`, `styles.css`, `script.js` |
| Contact form page | `contacto.html` |
| Admin UI | `admin.html`, `admin.js` |
| API + persistence | `worker/worker.js`, `worker/wrangler.toml` |
| Docs | `README.md`, `BLUEPRINT.md` |
