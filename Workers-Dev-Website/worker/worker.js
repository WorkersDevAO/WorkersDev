/**
 * Workers Dev — Contact API
 *
 * POST /          → public contact form (save to KV + email via Resend)
 * GET  /leads     → admin list (header: X-Admin-Password)
 * DELETE /leads   → admin delete one (body: { id }, header: X-Admin-Password)
 *
 * Bindings:
 *   LEADS          — KV namespace
 *   ADMIN_PASSWORD — secret
 *   RESEND_API_KEY — secret (optional; if missing, still saves to KV)
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
};

const LEADS_KEY = 'leads';
const MAX_LEADS = 500;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

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

function checkAdmin(request, env) {
  const pwd = request.headers.get('X-Admin-Password') || '';
  return env.ADMIN_PASSWORD && pwd === env.ADMIN_PASSWORD;
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

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';

    try {
      if (request.method === 'POST' && (path === '/' || path === '/contact')) {
        return await handleContact(request, env);
      }
      if (request.method === 'GET' && path === '/leads') {
        return await handleListLeads(request, env);
      }
      if (request.method === 'DELETE' && path === '/leads') {
        return await handleDeleteLead(request, env);
      }
      return json({ ok: false, error: 'Not found' }, 404);
    } catch (err) {
      return json({ ok: false, error: 'Server error' }, 500);
    }
  },
};
