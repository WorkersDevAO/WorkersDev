/**
 * Workers Dev — Contact API + Clients / Subscriptions
 *
 * POST /              → public contact form (save to KV + email via Resend)
 * GET  /leads         → admin list leads
 * DELETE /leads       → admin delete lead
 *
 * GET  /clients       → list clients (+ computed overdue)
 * POST /clients       → create client + first period
 * PUT  /clients       → update client
 * DELETE /clients     → delete client
 * POST /clients/period→ create next period | mark paid | edit period
 *
 * Bindings:
 *   LEADS          — KV namespace
 *   ADMIN_PASSWORD — secret
 *   RESEND_API_KEY — secret (optional)
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
};

const LEADS_KEY = 'leads';
const CLIENTS_KEY = 'clients';
const INVOICE_META_KEY = 'invoice_meta';
const MAX_LEADS = 500;
const MAX_CLIENTS = 200;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function checkAdmin(request, env) {
  const pwd = request.headers.get('X-Admin-Password') || '';
  return env.ADMIN_PASSWORD && pwd === env.ADMIN_PASSWORD;
}

/* ---------- Leads (unchanged) ---------- */

async function readLeads(env) {
  const raw = await env.LEADS.get(LEADS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeLeads(env, leads) {
  await env.LEADS.put(LEADS_KEY, JSON.stringify(leads));
}

async function sendEmail(env, lead) {
  if (!env.RESEND_API_KEY) return { sent: false, reason: 'no_key' };

  const lines = [
    `Nome: ${lead.name}`,
    `E-mail: ${lead.email}`,
    `Telefone: ${lead.phone || '—'}`,
    `Negócio: ${lead.business || '—'}`,
    `Localização: ${lead.location || '—'}`,
    `Plano: ${lead.plan || '—'}`,
    '',
    lead.message || '(sem mensagem)',
  ];

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + env.RESEND_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Workers Dev <onboarding@resend.dev>',
      to: ['workersdevao@gmail.com'],
      subject: lead.subject || ('Workers Dev: contacto' + (lead.plan ? ' (' + lead.plan + ')' : '')),
      text: lines.join('\n'),
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => '');
    return { sent: false, reason: err || String(res.status) };
  }
  return { sent: true };
}

async function handleContact(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON' }, 400);
  }

  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  if (!name || !email) {
    return json({ ok: false, error: 'Name and email required' }, 400);
  }

  const lead = {
    id: uid(),
    createdAt: new Date().toISOString(),
    name,
    email,
    phone: String(body.phone || '').trim(),
    business: String(body.business || '').trim(),
    location: String(body.location || '').trim(),
    plan: String(body.plan || '').trim(),
    subject: String(body.subject || '').trim(),
    message: String(body.message || '').trim(),
  };

  const leads = await readLeads(env);
  leads.unshift(lead);
  if (leads.length > MAX_LEADS) leads.length = MAX_LEADS;
  await writeLeads(env, leads);

  const mail = await sendEmail(env, lead).catch(function (e) {
    return { sent: false, reason: String(e) };
  });

  return json({ ok: true, id: lead.id, email: mail });
}

async function handleListLeads(request, env) {
  if (!checkAdmin(request, env)) {
    return json({ ok: false, error: 'Unauthorized' }, 401);
  }
  const leads = await readLeads(env);
  return json({ ok: true, leads: leads, total: leads.length });
}

async function handleDeleteLead(request, env) {
  if (!checkAdmin(request, env)) {
    return json({ ok: false, error: 'Unauthorized' }, 401);
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON' }, 400);
  }
  const id = String(body.id || '').trim();
  if (!id) return json({ ok: false, error: 'id required' }, 400);

  let leads = await readLeads(env);
  const before = leads.length;
  leads = leads.filter(function (l) { return l.id !== id; });
  if (leads.length === before) {
    return json({ ok: false, error: 'Not found' }, 404);
  }
  await writeLeads(env, leads);
  return json({ ok: true, total: leads.length });
}

/* ---------- Clients / Subscriptions ---------- */

async function readClients(env) {
  const raw = await env.LEADS.get(CLIENTS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeClients(env, clients) {
  await env.LEADS.put(CLIENTS_KEY, JSON.stringify(clients));
}

async function readInvoiceMeta(env) {
  const raw = await env.LEADS.get(INVOICE_META_KEY);
  if (!raw) return { lastInvoiceNumber: 1000 };
  try {
    const parsed = JSON.parse(raw);
    return {
      lastInvoiceNumber: typeof parsed.lastInvoiceNumber === 'number'
        ? parsed.lastInvoiceNumber
        : 1000,
    };
  } catch {
    return { lastInvoiceNumber: 1000 };
  }
}

async function writeInvoiceMeta(env, meta) {
  await env.LEADS.put(INVOICE_META_KEY, JSON.stringify(meta));
}

/** Add one calendar month, preserving day-of-month when possible */
function addOneMonth(isoDate) {
  const d = new Date(isoDate + 'T12:00:00Z');
  const day = d.getUTCDate();
  d.setUTCMonth(d.getUTCMonth() + 1);
  // Handle month overflow (e.g. 31 Jan → 3 Mar) by clamping
  if (d.getUTCDate() < day) {
    d.setUTCDate(0); // last day of previous month
  }
  return d.toISOString().slice(0, 10);
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function computePeriodStatus(period) {
  if (period.status === 'paid' || period.status === 'cancelled') return period.status;
  const today = todayISO();
  if (period.periodEnd < today) return 'overdue';
  return 'pending';
}

function enrichClient(client) {
  const periods = (client.periods || []).map(function (p) {
    return Object.assign({}, p, { status: computePeriodStatus(p) });
  });
  const overdueCount = periods.filter(function (p) { return p.status === 'overdue'; }).length;
  const pending = periods.filter(function (p) { return p.status === 'pending' || p.status === 'overdue'; });
  const nextDue = pending.length
    ? pending.slice().sort(function (a, b) { return a.periodEnd.localeCompare(b.periodEnd); })[0]
    : null;

  return Object.assign({}, client, {
    periods: periods,
    overdueCount: overdueCount,
    nextDue: nextDue,
  });
}

async function nextInvoiceNumber(env) {
  const meta = await readInvoiceMeta(env);
  const next = meta.lastInvoiceNumber + 1;
  await writeInvoiceMeta(env, { lastInvoiceNumber: next });
  return next;
}

async function handleListClients(request, env) {
  if (!checkAdmin(request, env)) {
    return json({ ok: false, error: 'Unauthorized' }, 401);
  }
  const clients = await readClients(env);
  const enriched = clients.map(enrichClient);
  const summary = {
    total: enriched.length,
    active: enriched.filter(function (c) { return c.status === 'active'; }).length,
    overdue: enriched.reduce(function (n, c) { return n + c.overdueCount; }, 0),
    expectedThisMonth: 0,
  };
  const today = todayISO();
  const thisMonth = today.slice(0, 7);
  enriched.forEach(function (c) {
    (c.periods || []).forEach(function (p) {
      if ((p.status === 'pending' || p.status === 'overdue') && p.periodEnd.slice(0, 7) === thisMonth) {
        summary.expectedThisMonth += Number(p.amount) || 0;
      }
    });
  });
  return json({ ok: true, clients: enriched, summary: summary });
}

async function handleCreateClient(request, env) {
  if (!checkAdmin(request, env)) {
    return json({ ok: false, error: 'Unauthorized' }, 401);
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON' }, 400);
  }

  const name = String(body.name || '').trim();
  const website = String(body.website || '').trim();
  const startDate = String(body.startDate || '').trim();
  const monthlyAmount = Number(body.monthlyAmount);
  if (!name || !startDate || !monthlyAmount || monthlyAmount <= 0) {
    return json({ ok: false, error: 'name, startDate and monthlyAmount required' }, 400);
  }

  const periodEnd = addOneMonth(startDate);
  const inv = await nextInvoiceNumber(env);

  const period = {
    id: uid(),
    periodStart: startDate,
    periodEnd: periodEnd,
    amount: monthlyAmount,
    status: 'pending',
    paidAt: null,
    invoiceNumber: inv,
    note: '',
    createdAt: new Date().toISOString(),
  };

  const client = {
    id: uid(),
    name: name,
    website: website,
    startDate: startDate,
    monthlyAmount: monthlyAmount,
    plan: String(body.plan || '').trim(),
    contactName: String(body.contactName || '').trim(),
    phone: String(body.phone || '').trim(),
    email: String(body.email || '').trim(),
    address: String(body.address || '').trim(),
    nif: String(body.nif || '').trim(),
    notes: String(body.notes || '').trim(),
    status: body.status === 'paused' || body.status === 'ended' ? body.status : 'active',
    periods: [period],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const clients = await readClients(env);
  if (clients.length >= MAX_CLIENTS) {
    return json({ ok: false, error: 'Max clients reached' }, 400);
  }
  clients.unshift(client);
  await writeClients(env, clients);

  return json({ ok: true, client: enrichClient(client) });
}

async function handleUpdateClient(request, env) {
  if (!checkAdmin(request, env)) {
    return json({ ok: false, error: 'Unauthorized' }, 401);
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON' }, 400);
  }
  const id = String(body.id || '').trim();
  if (!id) return json({ ok: false, error: 'id required' }, 400);

  const clients = await readClients(env);
  const idx = clients.findIndex(function (c) { return c.id === id; });
  if (idx === -1) return json({ ok: false, error: 'Not found' }, 404);

  const existing = clients[idx];
  const updated = Object.assign({}, existing, {
    name: body.name !== undefined ? String(body.name).trim() : existing.name,
    website: body.website !== undefined ? String(body.website).trim() : existing.website,
    startDate: body.startDate !== undefined ? String(body.startDate).trim() : existing.startDate,
    monthlyAmount: body.monthlyAmount !== undefined ? Number(body.monthlyAmount) : existing.monthlyAmount,
    plan: body.plan !== undefined ? String(body.plan).trim() : existing.plan,
    contactName: body.contactName !== undefined ? String(body.contactName).trim() : existing.contactName,
    phone: body.phone !== undefined ? String(body.phone).trim() : existing.phone,
    email: body.email !== undefined ? String(body.email).trim() : existing.email,
    address: body.address !== undefined ? String(body.address).trim() : existing.address,
    nif: body.nif !== undefined ? String(body.nif).trim() : existing.nif,
    notes: body.notes !== undefined ? String(body.notes).trim() : existing.notes,
    status: body.status === 'paused' || body.status === 'ended' || body.status === 'active'
      ? body.status
      : existing.status,
    updatedAt: new Date().toISOString(),
  });

  // Amount change only affects future periods (not already created ones)
  clients[idx] = updated;
  await writeClients(env, clients);
  return json({ ok: true, client: enrichClient(updated) });
}

async function handleDeleteClient(request, env) {
  if (!checkAdmin(request, env)) {
    return json({ ok: false, error: 'Unauthorized' }, 401);
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON' }, 400);
  }
  const id = String(body.id || '').trim();
  if (!id) return json({ ok: false, error: 'id required' }, 400);

  let clients = await readClients(env);
  const before = clients.length;
  clients = clients.filter(function (c) { return c.id !== id; });
  if (clients.length === before) {
    return json({ ok: false, error: 'Not found' }, 404);
  }
  await writeClients(env, clients);
  return json({ ok: true, total: clients.length });
}

/**
 * Body actions:
 *   { action: "next", clientId }                     → generate next period
 *   { action: "mark_paid", clientId, periodId }      → mark paid
 *   { action: "edit", clientId, periodId, ...fields} → edit period
 *   { action: "add", clientId, periodStart, periodEnd, amount, note? } → manual period
 */
async function handlePeriod(request, env) {
  if (!checkAdmin(request, env)) {
    return json({ ok: false, error: 'Unauthorized' }, 401);
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON' }, 400);
  }

  const action = String(body.action || '').trim();
  const clientId = String(body.clientId || '').trim();
  if (!action || !clientId) {
    return json({ ok: false, error: 'action and clientId required' }, 400);
  }

  const clients = await readClients(env);
  const idx = clients.findIndex(function (c) { return c.id === clientId; });
  if (idx === -1) return json({ ok: false, error: 'Client not found' }, 404);

  const client = clients[idx];
  const periods = Array.isArray(client.periods) ? client.periods.slice() : [];

  if (action === 'next') {
    let lastEnd = client.startDate;
    if (periods.length) {
      const sorted = periods.slice().sort(function (a, b) {
        return a.periodEnd.localeCompare(b.periodEnd);
      });
      lastEnd = sorted[sorted.length - 1].periodEnd;
    }
    const periodStart = lastEnd;
    const periodEnd = addOneMonth(periodStart);
    const inv = await nextInvoiceNumber(env);
    const period = {
      id: uid(),
      periodStart: periodStart,
      periodEnd: periodEnd,
      amount: Number(client.monthlyAmount) || 0,
      status: 'pending',
      paidAt: null,
      invoiceNumber: inv,
      note: '',
      createdAt: new Date().toISOString(),
    };
    periods.push(period);
  } else if (action === 'mark_paid') {
    const periodId = String(body.periodId || '').trim();
    if (!periodId) return json({ ok: false, error: 'periodId required' }, 400);
    const pIdx = periods.findIndex(function (p) { return p.id === periodId; });
    if (pIdx === -1) return json({ ok: false, error: 'Period not found' }, 404);
    periods[pIdx] = Object.assign({}, periods[pIdx], {
      status: 'paid',
      paidAt: new Date().toISOString(),
    });
  } else if (action === 'edit') {
    const periodId = String(body.periodId || '').trim();
    if (!periodId) return json({ ok: false, error: 'periodId required' }, 400);
    const pIdx = periods.findIndex(function (p) { return p.id === periodId; });
    if (pIdx === -1) return json({ ok: false, error: 'Period not found' }, 404);
    const p = periods[pIdx];
    periods[pIdx] = Object.assign({}, p, {
      periodStart: body.periodStart !== undefined ? String(body.periodStart).trim() : p.periodStart,
      periodEnd: body.periodEnd !== undefined ? String(body.periodEnd).trim() : p.periodEnd,
      amount: body.amount !== undefined ? Number(body.amount) : p.amount,
      status: body.status === 'pending' || body.status === 'paid' || body.status === 'cancelled'
        ? body.status
        : p.status,
      paidAt: body.status === 'paid' ? (p.paidAt || new Date().toISOString()) : (body.status === 'pending' || body.status === 'cancelled' ? null : p.paidAt),
      note: body.note !== undefined ? String(body.note).trim() : p.note,
      invoiceNumber: body.invoiceNumber !== undefined ? Number(body.invoiceNumber) : p.invoiceNumber,
    });
  } else if (action === 'add') {
    const periodStart = String(body.periodStart || '').trim();
    const periodEnd = String(body.periodEnd || '').trim();
    const amount = Number(body.amount);
    if (!periodStart || !periodEnd || !amount) {
      return json({ ok: false, error: 'periodStart, periodEnd, amount required' }, 400);
    }
    const inv = body.invoiceNumber != null
      ? Number(body.invoiceNumber)
      : await nextInvoiceNumber(env);
    periods.push({
      id: uid(),
      periodStart: periodStart,
      periodEnd: periodEnd,
      amount: amount,
      status: body.status === 'paid' ? 'paid' : 'pending',
      paidAt: body.status === 'paid' ? new Date().toISOString() : null,
      invoiceNumber: inv,
      note: String(body.note || '').trim(),
      createdAt: new Date().toISOString(),
    });
  } else {
    return json({ ok: false, error: 'Unknown action' }, 400);
  }

  clients[idx] = Object.assign({}, client, {
    periods: periods,
    updatedAt: new Date().toISOString(),
  });
  await writeClients(env, clients);
  return json({ ok: true, client: enrichClient(clients[idx]) });
}

/* ---------- Router ---------- */

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';

    try {
      // Public contact
      if (request.method === 'POST' && (path === '/' || path === '/contact')) {
        return await handleContact(request, env);
      }
      // Leads
      if (request.method === 'GET' && path === '/leads') {
        return await handleListLeads(request, env);
      }
      if (request.method === 'DELETE' && path === '/leads') {
        return await handleDeleteLead(request, env);
      }
      // Clients
      if (request.method === 'GET' && path === '/clients') {
        return await handleListClients(request, env);
      }
      if (request.method === 'POST' && path === '/clients') {
        return await handleCreateClient(request, env);
      }
      if (request.method === 'PUT' && path === '/clients') {
        return await handleUpdateClient(request, env);
      }
      if (request.method === 'DELETE' && path === '/clients') {
        return await handleDeleteClient(request, env);
      }
      if (request.method === 'POST' && path === '/clients/period') {
        return await handlePeriod(request, env);
      }

      return json({ ok: false, error: 'Not found' }, 404);
    } catch (err) {
      return json({ ok: false, error: 'Server error' }, 500);
    }
  },
};
