/* Workers Dev Admin — leads from Cloudflare Worker + KV */

(function () {
  'use strict';

  // Same origin as the public contact API (update after deploy)
  const API_BASE = 'https://workersdev-contact-api.workersdevao.workers.dev';

  const STORAGE_KEY = 'wd_admin_pwd';
  const REMEMBER_KEY = 'wd_admin_remember';

  const loginView = document.getElementById('loginView');
  const dashView = document.getElementById('dashView');
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');
  const passwordInput = document.getElementById('password');
  const rememberMe = document.getElementById('rememberMe');
  const pwdToggle = document.getElementById('pwdToggle');
  const leadList = document.getElementById('leadList');
  const emptyState = document.getElementById('emptyState');
  const metaLine = document.getElementById('metaLine');

  function getPwd() {
    return localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY) || '';
  }

  function setPwd(pwd, persist) {
    // Always clear both first so only one storage holds the value
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
    if (persist) {
      localStorage.setItem(STORAGE_KEY, pwd);
      localStorage.setItem(REMEMBER_KEY, '1');
    } else {
      sessionStorage.setItem(STORAGE_KEY, pwd);
      localStorage.removeItem(REMEMBER_KEY);
    }
  }

  function clearPwd() {
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(REMEMBER_KEY);
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
    // Keep dashboard visible while reloading so hard refresh does not flash login
    showDash();
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

  /* ---------- Show / hide password (eye toggle) ---------- */
  if (pwdToggle && passwordInput) {
    pwdToggle.addEventListener('click', function () {
      const showing = passwordInput.type === 'text';
      passwordInput.type = showing ? 'password' : 'text';
      pwdToggle.setAttribute('aria-pressed', showing ? 'false' : 'true');
      pwdToggle.setAttribute(
        'aria-label',
        showing ? 'Mostrar palavra-passe' : 'Ocultar palavra-passe'
      );
      pwdToggle.setAttribute(
        'title',
        showing ? 'Mostrar palavra-passe' : 'Ocultar palavra-passe'
      );
      const eye = pwdToggle.querySelector('.icon-eye');
      const eyeOff = pwdToggle.querySelector('.icon-eye-off');
      if (eye && eyeOff) {
        eye.classList.toggle('hidden', !showing);
        eyeOff.classList.toggle('hidden', showing);
      }
    });
  }

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const pwd = passwordInput.value.trim();
    if (!pwd) return;
    const persist = !!(rememberMe && rememberMe.checked);
    setPwd(pwd, persist);
    passwordInput.value = '';
    // Reset eye toggle to hidden state after clear
    if (passwordInput.type === 'text' && pwdToggle) {
      passwordInput.type = 'password';
      pwdToggle.setAttribute('aria-pressed', 'false');
      const eye = pwdToggle.querySelector('.icon-eye');
      const eyeOff = pwdToggle.querySelector('.icon-eye-off');
      if (eye) eye.classList.remove('hidden');
      if (eyeOff) eyeOff.classList.add('hidden');
    }
    fetchLeads();
  });

  document.getElementById('btnLogout').addEventListener('click', function () {
    clearPwd();
    if (rememberMe) rememberMe.checked = false;
    showLogin();
  });

  document.getElementById('btnRefresh').addEventListener('click', fetchLeads);

  leadList.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-delete');
    if (btn) deleteLead(btn.getAttribute('data-id'));
  });

  // Restore "stay logged in" checkbox if a persistent session exists
  if (localStorage.getItem(REMEMBER_KEY) === '1' && rememberMe) {
    rememberMe.checked = true;
  }

  // Auto-enter if session or persistent password exists (survives hard refresh)
  if (getPwd()) {
    fetchLeads();
  }
})();
