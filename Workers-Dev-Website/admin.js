/* Workers Dev Admin — leads from Cloudflare Worker + KV */

(function () {
  'use strict';

  // Same origin as the public contact API (update after deploy)
  const API_BASE = 'https://workersdev-contact-api.workersdevao.workers.dev';

  const STORAGE_KEY = 'wd_admin_pwd';

  const loginView = document.getElementById('loginView');
  const dashView = document.getElementById('dashView');
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');
  const passwordInput = document.getElementById('password');
  const leadList = document.getElementById('leadList');
  const emptyState = document.getElementById('emptyState');
  const metaLine = document.getElementById('metaLine');

  function getPwd() {
    return sessionStorage.getItem(STORAGE_KEY) || '';
  }

  function setPwd(pwd) {
    sessionStorage.setItem(STORAGE_KEY, pwd);
  }

  function clearPwd() {
    sessionStorage.removeItem(STORAGE_KEY);
  }

  function showLogin(msg) {
    dashView.classList.add('hidden');
    loginView.classList.remove('hidden');
    if (msg) loginError.textContent = msg;
  }

  function showDash() {
    loginView.classList.add('hidden');
    dashView.classList.remove('hidden');
    loginError.textContent = '';
  }

  function formatDate(iso) {
    if (!iso) return '—';
    try {
      const d = new Date(iso);
      return d.toLocaleString('pt-AO', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
    } catch {
      return iso;
    }
  }

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderLeads(leads) {
    leadList.innerHTML = '';
    if (!leads || !leads.length) {
      emptyState.classList.remove('hidden');
      metaLine.textContent = '0 contactos';
      return;
    }
    emptyState.classList.add('hidden');
    metaLine.textContent = leads.length + ' contacto' + (leads.length === 1 ? '' : 's');

    leads.forEach(function (lead) {
      const card = document.createElement('article');
      card.className = 'lead-card';
      card.dataset.id = lead.id;

      const phone = lead.phone
        ? '<a href="https://wa.me/' + escapeHtml(String(lead.phone).replace(/\D/g, '')) + '" target="_blank" rel="noopener">' + escapeHtml(lead.phone) + '</a>'
        : '—';
      const email = lead.email
        ? '<a href="mailto:' + escapeHtml(lead.email) + '">' + escapeHtml(lead.email) + '</a>'
        : '—';

      card.innerHTML =
        '<div class="lead-card-top">' +
          '<div class="lead-name">' + escapeHtml(lead.name) + '</div>' +
          (lead.plan ? '<span class="lead-plan">' + escapeHtml(lead.plan) + '</span>' : '') +
        '</div>' +
        '<div class="lead-row">' +
          '<span>' + email + '</span>' +
          '<span>' + phone + '</span>' +
        '</div>' +
        '<div class="lead-row">' +
          '<span>' + escapeHtml(lead.business || '—') + '</span>' +
          '<span>' + escapeHtml(lead.location || '—') + '</span>' +
        '</div>' +
        (lead.message
          ? '<div class="lead-msg">' + escapeHtml(lead.message) + '</div>'
          : '') +
        '<div class="lead-date">' + formatDate(lead.createdAt) + '</div>' +
        '<div class="lead-actions">' +
          '<button type="button" class="admin-btn admin-btn--danger btn-delete" data-id="' + escapeHtml(lead.id) + '">Apagar</button>' +
        '</div>';

      leadList.appendChild(card);
    });
  }

  async function fetchLeads() {
    const pwd = getPwd();
    if (!pwd) {
      showLogin();
      return;
    }
    metaLine.textContent = 'A carregar…';
    try {
      const res = await fetch(API_BASE + '/leads', {
        headers: { 'X-Admin-Password': pwd },
      });
      if (res.status === 401) {
        clearPwd();
        showLogin('Palavra-passe incorrecta.');
        return;
      }
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      showDash();
      renderLeads(data.leads || []);
    } catch (err) {
      metaLine.textContent = 'Erro ao carregar. Verifica a API.';
      console.error(err);
    }
  }

  async function deleteLead(id) {
    if (!id || !confirm('Apagar este contacto?')) return;
    const pwd = getPwd();
    try {
      const res = await fetch(API_BASE + '/leads', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': pwd,
        },
        body: JSON.stringify({ id: id }),
      });
      if (res.status === 401) {
        clearPwd();
        showLogin('Sessão expirada.');
        return;
      }
      if (!res.ok) throw new Error('HTTP ' + res.status);
      await fetchLeads();
    } catch (err) {
      alert('Não foi possível apagar.');
      console.error(err);
    }
  }

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const pwd = passwordInput.value.trim();
    if (!pwd) return;
    setPwd(pwd);
    passwordInput.value = '';
    fetchLeads();
  });

  document.getElementById('btnLogout').addEventListener('click', function () {
    clearPwd();
    showLogin();
  });

  document.getElementById('btnRefresh').addEventListener('click', fetchLeads);

  leadList.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-delete');
    if (btn) deleteLead(btn.getAttribute('data-id'));
  });

  // Auto-enter if already logged in this tab
  if (getPwd()) {
    fetchLeads();
  }
})();
