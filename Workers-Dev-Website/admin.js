/* Workers Dev Admin — leads + clients / subscriptions */

(function () {
  'use strict';

  const API_BASE = 'https://workersdev-contact-api.workersdevao.workers.dev';

  const STORAGE_KEY = 'wd_admin_pwd';
  const REMEMBER_KEY = 'wd_admin_remember';

  /* ---------- DOM ---------- */
  const loginView = document.getElementById('loginView');
  const dashView = document.getElementById('dashView');
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');
  const passwordInput = document.getElementById('password');
  const rememberMe = document.getElementById('rememberMe');
  const pwdToggle = document.getElementById('pwdToggle');
  const pageTitle = document.getElementById('pageTitle');

  const leadsView = document.getElementById('leadsView');
  const clientsView = document.getElementById('clientsView');
  const leadList = document.getElementById('leadList');
  const emptyState = document.getElementById('emptyState');
  const metaLine = document.getElementById('metaLine');

  const clientList = document.getElementById('clientList');
  const clientsEmpty = document.getElementById('clientsEmpty');
  const clientsMeta = document.getElementById('clientsMeta');
  const clientFormPanel = document.getElementById('clientFormPanel');
  const clientForm = document.getElementById('clientForm');
  const clientFormTitle = document.getElementById('clientFormTitle');
  const clientDetailPanel = document.getElementById('clientDetailPanel');
  const periodList = document.getElementById('periodList');
  const detailTitle = document.getElementById('detailTitle');
  const detailInfo = document.getElementById('detailInfo');

  let currentTab = 'leads';
  let clientsCache = [];
  let currentFilter = 'all';
  let selectedClientId = null;

  /* ---------- Auth helpers ---------- */
  function getPwd() {
    return localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY) || '';
  }

  function setPwd(pwd, persist) {
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

  /* ---------- Utils ---------- */
  function formatDate(iso) {
    if (!iso) return '—';
    try {
      const d = new Date(iso.length === 10 ? iso + 'T12:00:00' : iso);
      return d.toLocaleDateString('pt-AO', {
        day: '2-digit', month: 'short', year: 'numeric',
      });
    } catch {
      return iso;
    }
  }

  function formatDateTime(iso) {
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

  function formatMoney(n) {
    const num = Number(n) || 0;
    return num.toLocaleString('pt-AO') + ' Kz';
  }

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function authHeaders(extra) {
    const h = { 'X-Admin-Password': getPwd() };
    if (extra) Object.assign(h, extra);
    return h;
  }

  async function api(path, opts) {
    const res = await fetch(API_BASE + path, opts);
    if (res.status === 401) {
      clearPwd();
      showLogin('Sessão expirada ou palavra-passe incorrecta.');
      throw new Error('401');
    }
    if (!res.ok) {
      const errBody = await res.json().catch(function () { return {}; });
      throw new Error(errBody.error || ('HTTP ' + res.status));
    }
    return res.json();
  }

  /* ---------- Tabs ---------- */
  function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.admin-tab').forEach(function (el) {
      el.classList.toggle('active', el.getAttribute('data-tab') === tab);
    });
    if (tab === 'leads') {
      leadsView.classList.remove('hidden');
      clientsView.classList.add('hidden');
      pageTitle.textContent = 'Contactos';
      fetchLeads();
    } else {
      leadsView.classList.add('hidden');
      clientsView.classList.remove('hidden');
      pageTitle.textContent = 'Clientes';
      hideClientPanels();
      fetchClients();
    }
  }

  document.getElementById('tabLeads').addEventListener('click', function () { switchTab('leads'); });
  document.getElementById('tabClients').addEventListener('click', function () { switchTab('clients'); });

  /* ---------- Leads (existing) ---------- */
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
        '<div class="lead-date">' + formatDateTime(lead.createdAt) + '</div>' +
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
    showDash();
    metaLine.textContent = 'A carregar…';
    try {
      const data = await api('/leads', { headers: authHeaders() });
      renderLeads(data.leads || []);
    } catch (err) {
      if (err.message !== '401') {
        metaLine.textContent = 'Erro ao carregar. Verifica a API.';
        console.error(err);
      }
    }
  }

  async function deleteLead(id) {
    if (!id || !confirm('Apagar este contacto?')) return;
    try {
      await api('/leads', {
        method: 'DELETE',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ id: id }),
      });
      await fetchLeads();
    } catch (err) {
      if (err.message !== '401') {
        alert('Não foi possível apagar.');
        console.error(err);
      }
    }
  }

  leadList.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-delete');
    if (btn) deleteLead(btn.getAttribute('data-id'));
  });

  /* ---------- Clients ---------- */
  function hideClientPanels() {
    clientFormPanel.classList.add('hidden');
    clientDetailPanel.classList.add('hidden');
    selectedClientId = null;
  }

  function statusBadge(status) {
    const map = {
      active: 'badge--active',
      overdue: 'badge--overdue',
      pending: 'badge--pending',
      paid: 'badge--paid',
      paused: 'badge--paused',
      ended: 'badge--ended',
    };
    const labels = {
      active: 'Activo',
      overdue: 'Em atraso',
      pending: 'Pendente',
      paid: 'Pago',
      paused: 'Pausado',
      ended: 'Terminado',
    };
    const cls = map[status] || 'badge--pending';
    const label = labels[status] || status;
    return '<span class="badge ' + cls + '">' + escapeHtml(label) + '</span>';
  }

  function renderSummary(summary) {
    document.getElementById('sumTotal').textContent = summary.total != null ? summary.total : '—';
    document.getElementById('sumActive').textContent = summary.active != null ? summary.active : '—';
    document.getElementById('sumOverdue').textContent = summary.overdue != null ? summary.overdue : '—';
    document.getElementById('sumExpected').textContent =
      summary.expectedThisMonth != null ? formatMoney(summary.expectedThisMonth) : '—';
  }

  function filteredClients() {
    if (currentFilter === 'all') return clientsCache;
    if (currentFilter === 'overdue') {
      return clientsCache.filter(function (c) { return c.overdueCount > 0; });
    }
    if (currentFilter === 'active') {
      return clientsCache.filter(function (c) { return c.status === 'active'; });
    }
    return clientsCache;
  }

  function renderClients() {
    const list = filteredClients();
    clientList.innerHTML = '';
    if (!list.length) {
      clientsEmpty.classList.remove('hidden');
      clientsMeta.textContent = clientsCache.length
        ? 'Nenhum cliente neste filtro'
        : '0 clientes';
      return;
    }
    clientsEmpty.classList.add('hidden');
    clientsMeta.textContent = list.length + ' cliente' + (list.length === 1 ? '' : 's');

    list.forEach(function (c) {
      const card = document.createElement('article');
      card.className = 'client-card';
      card.dataset.id = c.id;

      const nextDueText = c.nextDue
        ? formatDate(c.nextDue.periodEnd) + ' · ' + formatMoney(c.nextDue.amount)
        : 'Sem períodos pendentes';

      const websiteLink = c.website
        ? '<a href="https://' + escapeHtml(c.website.replace(/^https?:\/\//, '')) + '" target="_blank" rel="noopener">' + escapeHtml(c.website) + '</a>'
        : '—';

      card.innerHTML =
        '<div class="client-card-top">' +
          '<div class="client-name">' + escapeHtml(c.name) + '</div>' +
          statusBadge(c.overdueCount > 0 ? 'overdue' : c.status) +
        '</div>' +
        '<div class="client-row">' +
          '<span>' + websiteLink + '</span>' +
          '<span>' + formatMoney(c.monthlyAmount) + '/mês</span>' +
        '</div>' +
        '<div class="client-row">' +
          '<span>Próximo: ' + escapeHtml(nextDueText) + '</span>' +
          (c.plan ? '<span class="lead-plan">' + escapeHtml(c.plan) + '</span>' : '') +
        '</div>' +
        '<div class="client-actions">' +
          '<button type="button" class="admin-btn admin-btn--sm btn-open-client" data-id="' + escapeHtml(c.id) + '">Ver períodos</button>' +
        '</div>';

      clientList.appendChild(card);
    });
  }

  async function fetchClients() {
    const pwd = getPwd();
    if (!pwd) {
      showLogin();
      return;
    }
    showDash();
    clientsMeta.textContent = 'A carregar…';
    try {
      const data = await api('/clients', { headers: authHeaders() });
      clientsCache = data.clients || [];
      renderSummary(data.summary || {});
      renderClients();
    } catch (err) {
      if (err.message !== '401') {
        clientsMeta.textContent = 'Erro ao carregar clientes.';
        console.error(err);
      }
    }
  }

  /* Client form */
  function openNewClientForm() {
    clientDetailPanel.classList.add('hidden');
    clientFormPanel.classList.remove('hidden');
    clientFormTitle.textContent = 'Novo cliente';
    clientForm.reset();
    document.getElementById('cfId').value = '';
    document.getElementById('cfStatus').value = 'active';
    document.getElementById('cfStartDate').value = new Date().toISOString().slice(0, 10);
    selectedClientId = null;
  }

  function openEditClientForm(client) {
    clientDetailPanel.classList.add('hidden');
    clientFormPanel.classList.remove('hidden');
    clientFormTitle.textContent = 'Editar cliente';
    document.getElementById('cfId').value = client.id;
    document.getElementById('cfName').value = client.name || '';
    document.getElementById('cfWebsite').value = client.website || '';
    document.getElementById('cfStartDate').value = client.startDate || '';
    document.getElementById('cfAmount').value = client.monthlyAmount || '';
    document.getElementById('cfPlan').value = client.plan || '';
    document.getElementById('cfStatus').value = client.status || 'active';
    document.getElementById('cfContactName').value = client.contactName || '';
    document.getElementById('cfPhone').value = client.phone || '';
    document.getElementById('cfEmail').value = client.email || '';
    document.getElementById('cfNif').value = client.nif || '';
    document.getElementById('cfAddress').value = client.address || '';
    document.getElementById('cfNotes').value = client.notes || '';
    selectedClientId = client.id;
  }

  document.getElementById('btnNewClient').addEventListener('click', openNewClientForm);
  document.getElementById('cfCancel').addEventListener('click', function () {
    clientFormPanel.classList.add('hidden');
  });

  clientForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const id = document.getElementById('cfId').value.trim();
    const payload = {
      name: document.getElementById('cfName').value.trim(),
      website: document.getElementById('cfWebsite').value.trim(),
      startDate: document.getElementById('cfStartDate').value,
      monthlyAmount: Number(document.getElementById('cfAmount').value),
      plan: document.getElementById('cfPlan').value,
      status: document.getElementById('cfStatus').value,
      contactName: document.getElementById('cfContactName').value.trim(),
      phone: document.getElementById('cfPhone').value.trim(),
      email: document.getElementById('cfEmail').value.trim(),
      nif: document.getElementById('cfNif').value.trim(),
      address: document.getElementById('cfAddress').value.trim(),
      notes: document.getElementById('cfNotes').value.trim(),
    };

    try {
      if (id) {
        payload.id = id;
        await api('/clients', {
          method: 'PUT',
          headers: authHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify(payload),
        });
      } else {
        await api('/clients', {
          method: 'POST',
          headers: authHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify(payload),
        });
      }
      clientFormPanel.classList.add('hidden');
      await fetchClients();
    } catch (err) {
      if (err.message !== '401') {
        alert('Erro ao guardar: ' + err.message);
        console.error(err);
      }
    }
  });

  /* Client detail / periods */
  function openClientDetail(client) {
    selectedClientId = client.id;
    clientFormPanel.classList.add('hidden');
    clientDetailPanel.classList.remove('hidden');
    detailTitle.textContent = client.name;

    const websiteLink = client.website
      ? '<a href="https://' + escapeHtml(client.website.replace(/^https?:\/\//, '')) + '" target="_blank" rel="noopener">' + escapeHtml(client.website) + '</a>'
      : '—';

    detailInfo.innerHTML =
      '<span>' + websiteLink + '</span>' +
      '<span>' + formatMoney(client.monthlyAmount) + '/mês</span>' +
      '<span>' + statusBadge(client.status) + '</span>' +
      (client.contactName ? '<span>' + escapeHtml(client.contactName) + '</span>' : '') +
      (client.phone ? '<span>' + escapeHtml(client.phone) + '</span>' : '');

    const periods = (client.periods || []).slice().sort(function (a, b) {
      return b.periodEnd.localeCompare(a.periodEnd);
    });

    periodList.innerHTML = '';
    if (!periods.length) {
      periodList.innerHTML = '<p style="color:rgba(244,247,252,0.5);font-size:0.88rem;">Sem períodos.</p>';
      return;
    }

    periods.forEach(function (p) {
      const item = document.createElement('div');
      item.className = 'period-item';
      item.innerHTML =
        '<div>' +
          '<div class="period-dates">' +
            formatDate(p.periodStart) + ' → ' + formatDate(p.periodEnd) +
            (p.invoiceNumber ? ' · Fat. #' + escapeHtml(String(p.invoiceNumber)) : '') +
          '</div>' +
          '<div class="period-amount">' + formatMoney(p.amount) +
            (p.paidAt ? ' · pago ' + formatDateTime(p.paidAt) : '') +
          '</div>' +
        '</div>' +
        '<div style="display:flex;gap:0.4rem;align-items:center;flex-wrap:wrap;">' +
          statusBadge(p.status) +
          (p.status === 'pending' || p.status === 'overdue'
            ? '<button type="button" class="admin-btn admin-btn--sm admin-btn--solid btn-mark-paid" data-period="' + escapeHtml(p.id) + '">Marcar pago</button>'
            : '') +
        '</div>';
      periodList.appendChild(item);
    });
  }

  clientList.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-open-client');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    const client = clientsCache.find(function (c) { return c.id === id; });
    if (client) openClientDetail(client);
  });

  periodList.addEventListener('click', async function (e) {
    const btn = e.target.closest('.btn-mark-paid');
    if (!btn || !selectedClientId) return;
    const periodId = btn.getAttribute('data-period');
    if (!confirm('Marcar este período como pago?')) return;
    try {
      const data = await api('/clients/period', {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          action: 'mark_paid',
          clientId: selectedClientId,
          periodId: periodId,
        }),
      });
      // refresh cache entry
      const idx = clientsCache.findIndex(function (c) { return c.id === selectedClientId; });
      if (idx !== -1 && data.client) clientsCache[idx] = data.client;
      renderSummary((await api('/clients', { headers: authHeaders() })).summary || {});
      renderClients();
      if (data.client) openClientDetail(data.client);
    } catch (err) {
      if (err.message !== '401') {
        alert('Erro: ' + err.message);
        console.error(err);
      }
    }
  });

  document.getElementById('btnDetailClose').addEventListener('click', function () {
    clientDetailPanel.classList.add('hidden');
    selectedClientId = null;
  });

  document.getElementById('btnDetailEdit').addEventListener('click', function () {
    if (!selectedClientId) return;
    const client = clientsCache.find(function (c) { return c.id === selectedClientId; });
    if (client) openEditClientForm(client);
  });

  document.getElementById('btnDetailNext').addEventListener('click', async function () {
    if (!selectedClientId) return;
    if (!confirm('Gerar o próximo período de faturação?')) return;
    try {
      const data = await api('/clients/period', {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ action: 'next', clientId: selectedClientId }),
      });
      const idx = clientsCache.findIndex(function (c) { return c.id === selectedClientId; });
      if (idx !== -1 && data.client) clientsCache[idx] = data.client;
      await fetchClients();
      if (data.client) openClientDetail(data.client);
    } catch (err) {
      if (err.message !== '401') {
        alert('Erro: ' + err.message);
        console.error(err);
      }
    }
  });

  document.getElementById('btnDetailDelete').addEventListener('click', async function () {
    if (!selectedClientId) return;
    if (!confirm('Apagar este cliente e todo o histórico de períodos?')) return;
    try {
      await api('/clients', {
        method: 'DELETE',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ id: selectedClientId }),
      });
      hideClientPanels();
      await fetchClients();
    } catch (err) {
      if (err.message !== '401') {
        alert('Erro ao apagar.');
        console.error(err);
      }
    }
  });

  /* Filters */
  document.getElementById('clientFilters').addEventListener('click', function (e) {
    const chip = e.target.closest('.filter-chip');
    if (!chip) return;
    currentFilter = chip.getAttribute('data-filter');
    document.querySelectorAll('#clientFilters .filter-chip').forEach(function (el) {
      el.classList.toggle('active', el === chip);
    });
    renderClients();
  });

  /* ---------- Password toggle (existing) ---------- */
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

  /* ---------- Login / Logout / Refresh ---------- */
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const pwd = passwordInput.value.trim();
    if (!pwd) return;
    const persist = !!(rememberMe && rememberMe.checked);
    setPwd(pwd, persist);
    passwordInput.value = '';
    if (passwordInput.type === 'text' && pwdToggle) {
      passwordInput.type = 'password';
      pwdToggle.setAttribute('aria-pressed', 'false');
      const eye = pwdToggle.querySelector('.icon-eye');
      const eyeOff = pwdToggle.querySelector('.icon-eye-off');
      if (eye) eye.classList.remove('hidden');
      if (eyeOff) eyeOff.classList.add('hidden');
    }
    switchTab(currentTab);
  });

  document.getElementById('btnLogout').addEventListener('click', function () {
    clearPwd();
    if (rememberMe) rememberMe.checked = false;
    showLogin();
  });

  document.getElementById('btnRefresh').addEventListener('click', function () {
    if (currentTab === 'leads') fetchLeads();
    else fetchClients();
  });

  if (localStorage.getItem(REMEMBER_KEY) === '1' && rememberMe) {
    rememberMe.checked = true;
  }

  if (getPwd()) {
    switchTab('leads');
  }
})();
