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

  /* ---------- Sidebar / Tabs ---------- */
  const slideOverlay = document.getElementById('slideOverlay');
  const adminSidebar = document.getElementById('adminSidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');

  function closeSidebarMobile() {
    if (adminSidebar) adminSidebar.classList.remove('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('open');
  }

  const accountsView = document.getElementById('accountsView');
  const websitesView = document.getElementById('websitesView');
  const pendingView = document.getElementById('pendingView');
  const grokView = document.getElementById('grokView');

  function hideAllMainViews() {
    leadsView.classList.add('hidden');
    clientsView.classList.add('hidden');
    if (accountsView) accountsView.classList.add('hidden');
    if (websitesView) websitesView.classList.add('hidden');
    if (pendingView) pendingView.classList.add('hidden');
    if (grokView) grokView.classList.add('hidden');
  }

  function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.sidebar-link').forEach(function (el) {
      el.classList.toggle('active', el.getAttribute('data-tab') === tab);
    });
    closeSidebarMobile();
    hideAllMainViews();
    closeSlide();
    hideClientPanels();
    stopGrokTicker();

    if (tab === 'leads') {
      leadsView.classList.remove('hidden');
      pageTitle.textContent = 'Contactos';
      fetchLeads();
    } else if (tab === 'clients') {
      clientsView.classList.remove('hidden');
      pageTitle.textContent = 'Clientes';
      fetchClients();
    } else if (tab === 'accounts') {
      if (accountsView) accountsView.classList.remove('hidden');
      pageTitle.textContent = 'Contas';
      fetchAccounts();
    } else if (tab === 'grok') {
      if (grokView) grokView.classList.remove('hidden');
      pageTitle.textContent = 'Grok';
      fetchGrok();
    } else if (tab === 'websites') {
      if (websitesView) websitesView.classList.remove('hidden');
      pageTitle.textContent = 'Websites';
      fetchWebsites();
    } else if (tab === 'pending') {
      if (pendingView) pendingView.classList.remove('hidden');
      pageTitle.textContent = 'Pendentes';
      fetchPending();
    }
  }

  document.getElementById('tabLeads').addEventListener('click', function () { switchTab('leads'); });
  document.getElementById('tabClients').addEventListener('click', function () { switchTab('clients'); });
  document.getElementById('tabAccounts').addEventListener('click', function () { switchTab('accounts'); });
  const tabGrokEl = document.getElementById('tabGrok');
  if (tabGrokEl) tabGrokEl.addEventListener('click', function () { switchTab('grok'); });
  document.getElementById('tabWebsites').addEventListener('click', function () { switchTab('websites'); });
  document.getElementById('tabPending').addEventListener('click', function () { switchTab('pending'); });

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function () {
      adminSidebar.classList.toggle('open');
      sidebarBackdrop.classList.toggle('open');
    });
  }
  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeSidebarMobile);
  }

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
  function closeSlide() {
    clientDetailPanel.classList.remove('open');
    clientDetailPanel.setAttribute('aria-hidden', 'true');
    if (slideOverlay) slideOverlay.classList.remove('open');
    selectedClientId = null;
  }

  function openSlide() {
    clientDetailPanel.classList.add('open');
    clientDetailPanel.setAttribute('aria-hidden', 'false');
    if (slideOverlay) slideOverlay.classList.add('open');
  }

  function hideClientPanels() {
    clientFormPanel.classList.add('hidden');
    closeSlide();
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
    closeSlide();
    clientFormPanel.classList.remove('hidden');
    clientFormTitle.textContent = 'Novo cliente';
    clientForm.reset();
    document.getElementById('cfId').value = '';
    document.getElementById('cfStatus').value = 'active';
    document.getElementById('cfStartDate').value = new Date().toISOString().slice(0, 10);
    selectedClientId = null;
  }

  function openEditClientForm(client) {
    closeSlide();
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

  /* Client detail / periods — right slide-over */
  function openClientDetail(client) {
    selectedClientId = client.id;
    clientFormPanel.classList.add('hidden');
    detailTitle.textContent = client.name;

    const websiteLink = client.website
      ? '<a href="https://' + escapeHtml(client.website.replace(/^https?:\/\//, '')) + '" target="_blank" rel="noopener">' + escapeHtml(client.website) + '</a>'
      : '—';

    detailInfo.innerHTML =
      websiteLink + ' · ' + formatMoney(client.monthlyAmount) + '/mês' +
      (client.contactName ? ' · ' + escapeHtml(client.contactName) : '') +
      (client.phone ? ' · ' + escapeHtml(client.phone) : '');

    openSlide();

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

  document.getElementById('btnDetailClose').addEventListener('click', closeSlide);
  if (slideOverlay) {
    slideOverlay.addEventListener('click', closeSlide);
  }

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
    else if (currentTab === 'clients') fetchClients();
    else if (currentTab === 'accounts') fetchAccounts();
    else if (currentTab === 'grok') fetchGrok();
    else if (currentTab === 'websites') fetchWebsites();
    else if (currentTab === 'pending') fetchPending();
  });

  /* ---------- Accounts / Websites / Pending ---------- */

  let accountsCache = [];
  let websitesCache = [];
  let pendingCache = [];
  let accountTypeFilter = 'all';
  let pendingStatusFilter = 'all';
  let accountsSearchQ = '';
  let websitesSearchQ = '';
  let pendingSearchQ = '';
  let selectedPendingIds = {};

  const TYPE_LABELS = {
    google: 'Google', microsoft: 'Microsoft', github: 'GitHub',
    cloudflare: 'Cloudflare', cloudinary: 'Cloudinary',
    facebook: 'Facebook', instagram: 'Instagram', x: 'X', other: 'Outro',
  };
  const PENDING_LABELS = {
    pending: 'Pendente', contacted: 'Contactado', proposal: 'Proposta',
    won: 'Ganho', lost: 'Perdido',
  };

  function downloadCsv(filename, rows) {
    const bom = '\uFEFF';
    const csv = rows.map(function (r) {
      return r.map(function (c) {
        const s = c == null ? '' : String(c);
        if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
        return s;
      }).join(',');
    }).join('\n');
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  /* ---- Accounts ---- */

  function filteredAccounts() {
    let list = accountsCache.slice();
    if (accountTypeFilter !== 'all') {
      list = list.filter(function (a) { return a.type === accountTypeFilter; });
    }
    if (accountsSearchQ) {
      const q = accountsSearchQ.toLowerCase();
      list = list.filter(function (a) {
        return (a.emailOrUsername || '').toLowerCase().indexOf(q) !== -1
          || (a.notes || '').toLowerCase().indexOf(q) !== -1;
      });
    }
    return list;
  }

  function renderAccounts() {
    const listEl = document.getElementById('accountsList');
    const emptyEl = document.getElementById('accountsEmpty');
    const metaEl = document.getElementById('accountsMeta');
    if (!listEl) return;
    listEl.innerHTML = '';
    const list = filteredAccounts();
    if (!list.length) {
      emptyEl.classList.remove('hidden');
      metaEl.textContent = accountsCache.length ? '0 resultados' : '0 contas';
      return;
    }
    emptyEl.classList.add('hidden');
    metaEl.textContent = list.length + ' conta' + (list.length === 1 ? '' : 's');

    list.forEach(function (a) {
      const card = document.createElement('div');
      card.className = 'client-card';
      const pwdMasked = a.password ? '••••••••' : '—';
      card.innerHTML =
        '<div class="client-card-top">' +
          '<div class="client-name">' + escapeHtml(a.emailOrUsername) + '</div>' +
          '<span class="badge badge--active">' + escapeHtml(TYPE_LABELS[a.type] || a.type) + '</span>' +
        '</div>' +
        '<div class="client-row">' +
          '<span>Password: <code class="pwd-mask" data-pwd="' + escapeHtml(a.password || '') + '">' + pwdMasked + '</code> ' +
          (a.password ? '<button type="button" class="admin-btn admin-btn--sm btn-reveal-pwd">Mostrar</button>' : '') +
          '</span>' +
        '</div>' +
        (a.notes ? '<div class="client-row"><span>' + escapeHtml(a.notes) + '</span></div>' : '') +
        '<div class="client-meta">' + formatDateTime(a.updatedAt || a.createdAt) + '</div>' +
        '<div class="client-actions">' +
          '<button type="button" class="admin-btn admin-btn--sm btn-edit-account" data-id="' + escapeHtml(a.id) + '">Editar</button>' +
          '<button type="button" class="admin-btn admin-btn--sm admin-btn--danger btn-del-account" data-id="' + escapeHtml(a.id) + '">Apagar</button>' +
        '</div>';
      listEl.appendChild(card);
    });
  }

  async function fetchAccounts() {
    try {
      const data = await api('/accounts', { headers: authHeaders() });
      accountsCache = data.accounts || [];
      renderAccounts();
    } catch (e) {
      document.getElementById('accountsMeta').textContent = 'Erro: ' + (e.message || e);
    }
  }

  function openAccountForm(account) {
    document.getElementById('accountFormPanel').classList.remove('hidden');
    document.getElementById('accountFormTitle').textContent = account ? 'Editar conta' : 'Nova conta';
    document.getElementById('afId').value = account ? account.id : '';
    document.getElementById('afType').value = account ? account.type : 'google';
    document.getElementById('afEmail').value = account ? account.emailOrUsername : '';
    document.getElementById('afPassword').value = account ? (account.password || '') : '';
    document.getElementById('afPassword').type = 'password';
    document.getElementById('afNotes').value = account ? (account.notes || '') : '';
  }

  function closeAccountForm() {
    document.getElementById('accountFormPanel').classList.add('hidden');
  }

  document.getElementById('btnNewAccount').addEventListener('click', function () { openAccountForm(null); });
  document.getElementById('afCancel').addEventListener('click', closeAccountForm);
  document.getElementById('afPwdToggle').addEventListener('click', function () {
    const inp = document.getElementById('afPassword');
    inp.type = inp.type === 'password' ? 'text' : 'password';
  });

  document.getElementById('accountForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const id = document.getElementById('afId').value;
    const body = {
      type: document.getElementById('afType').value,
      emailOrUsername: document.getElementById('afEmail').value.trim(),
      password: document.getElementById('afPassword').value,
      notes: document.getElementById('afNotes').value.trim(),
    };
    try {
      if (id) {
        body.id = id;
        await api('/accounts', { method: 'PUT', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(body) });
      } else {
        await api('/accounts', { method: 'POST', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(body) });
      }
      closeAccountForm();
      fetchAccounts();
    } catch (err) {
      alert('Erro: ' + (err.message || err));
    }
  });

  document.getElementById('accountsList').addEventListener('click', function (e) {
    const reveal = e.target.closest('.btn-reveal-pwd');
    if (reveal) {
      const code = reveal.parentElement.querySelector('.pwd-mask');
      if (!code) return;
      const showing = code.getAttribute('data-showing') === '1';
      if (showing) {
        code.textContent = '••••••••';
        code.setAttribute('data-showing', '0');
        reveal.textContent = 'Mostrar';
      } else {
        code.textContent = code.getAttribute('data-pwd') || '';
        code.setAttribute('data-showing', '1');
        reveal.textContent = 'Ocultar';
      }
      return;
    }
    const editBtn = e.target.closest('.btn-edit-account');
    if (editBtn) {
      const a = accountsCache.find(function (x) { return x.id === editBtn.getAttribute('data-id'); });
      if (a) openAccountForm(a);
      return;
    }
    const delBtn = e.target.closest('.btn-del-account');
    if (delBtn) {
      if (!confirm('Apagar esta conta?')) return;
      api('/accounts', {
        method: 'DELETE',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ id: delBtn.getAttribute('data-id') }),
      }).then(fetchAccounts).catch(function (err) { alert(err.message || err); });
    }
  });

  document.getElementById('accountFilters').addEventListener('click', function (e) {
    const chip = e.target.closest('.filter-chip');
    if (!chip) return;
    accountTypeFilter = chip.getAttribute('data-atype');
    document.querySelectorAll('#accountFilters .filter-chip').forEach(function (c) {
      c.classList.toggle('active', c === chip);
    });
    renderAccounts();
  });

  document.getElementById('accountsSearch').addEventListener('input', function (e) {
    accountsSearchQ = e.target.value.trim();
    renderAccounts();
  });

  document.getElementById('btnExportAccounts').addEventListener('click', function () {
    const rows = [['Tipo', 'Email/Username', 'Password', 'Notas', 'Actualizado']];
    filteredAccounts().forEach(function (a) {
      rows.push([a.type, a.emailOrUsername, a.password, a.notes, a.updatedAt || a.createdAt]);
    });
    downloadCsv('contas-workersdev.csv', rows);
  });

  document.getElementById('btnSeedData').addEventListener('click', async function () {
    if (!confirm('Carregar dados iniciais em falta (não sobrescreve existentes)?')) return;
    try {
      const data = await api('/seed', {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: '{}',
      });
      alert('Adicionadas: ' + (data.addedAccounts || 0) + ' contas, ' + (data.addedPending || 0) + ' pendentes.');
      if (currentTab === 'accounts') fetchAccounts();
      if (currentTab === 'pending') fetchPending();
    } catch (err) {
      alert('Erro: ' + (err.message || err));
    }
  });

  /* ---- Websites ---- */

  function filteredWebsites() {
    let list = websitesCache.slice();
    if (websitesSearchQ) {
      const q = websitesSearchQ.toLowerCase();
      list = list.filter(function (w) {
        return (w.name || '').toLowerCase().indexOf(q) !== -1
          || (w.domain || '').toLowerCase().indexOf(q) !== -1
          || (w.notes || '').toLowerCase().indexOf(q) !== -1;
      });
    }
    return list;
  }

  function fillAccountSelects() {
    function fill(selId, type) {
      const sel = document.getElementById(selId);
      if (!sel) return;
      const current = sel.value;
      sel.innerHTML = '<option value="">—</option>';
      accountsCache.filter(function (a) { return a.type === type; }).forEach(function (a) {
        const opt = document.createElement('option');
        opt.value = a.id;
        opt.textContent = a.emailOrUsername;
        sel.appendChild(opt);
      });
      if (current) sel.value = current;
    }
    fill('wfCloudflare', 'cloudflare');
    fill('wfGithub', 'github');
    fill('wfCloudinary', 'cloudinary');
  }

  function renderWebsites() {
    const listEl = document.getElementById('websitesList');
    const emptyEl = document.getElementById('websitesEmpty');
    const metaEl = document.getElementById('websitesMeta');
    if (!listEl) return;
    listEl.innerHTML = '';
    const list = filteredWebsites();
    if (!list.length) {
      emptyEl.classList.remove('hidden');
      metaEl.textContent = websitesCache.length ? '0 resultados' : '0 websites';
      return;
    }
    emptyEl.classList.add('hidden');
    metaEl.textContent = list.length + ' website' + (list.length === 1 ? '' : 's');

    list.forEach(function (w) {
      const card = document.createElement('div');
      card.className = 'client-card';
      const statusCls = w.status === 'active' ? 'badge--active' : (w.status === 'paused' ? 'badge--paused' : 'badge--ended');
      card.innerHTML =
        '<div class="client-card-top">' +
          '<div class="client-name">' + escapeHtml(w.name) + '</div>' +
          '<span class="badge ' + statusCls + '">' + escapeHtml(w.status) + '</span>' +
        '</div>' +
        (w.domain ? '<div class="client-row"><span>' + escapeHtml(w.domain) + '</span></div>' : '') +
        '<div class="client-row">' +
          '<span>CF: ' + escapeHtml(w.cloudflareEmail || '—') + '</span>' +
          '<span>GH: ' + escapeHtml(w.githubEmail || '—') + '</span>' +
          '<span>Cloudinary: ' + escapeHtml(w.cloudinaryEmail || '—') + '</span>' +
        '</div>' +
        (w.notes ? '<div class="client-row"><span>' + escapeHtml(w.notes) + '</span></div>' : '') +
        '<div class="client-actions">' +
          '<button type="button" class="admin-btn admin-btn--sm btn-edit-website" data-id="' + escapeHtml(w.id) + '">Editar</button>' +
          '<button type="button" class="admin-btn admin-btn--sm admin-btn--danger btn-del-website" data-id="' + escapeHtml(w.id) + '">Apagar</button>' +
        '</div>';
      listEl.appendChild(card);
    });
  }

  async function fetchWebsites() {
    try {
      if (!accountsCache.length) {
        const acc = await api('/accounts', { headers: authHeaders() });
        accountsCache = acc.accounts || [];
      }
      const data = await api('/websites', { headers: authHeaders() });
      websitesCache = data.websites || [];
      fillAccountSelects();
      renderWebsites();
    } catch (e) {
      document.getElementById('websitesMeta').textContent = 'Erro: ' + (e.message || e);
    }
  }

  function openWebsiteForm(website) {
    fillAccountSelects();
    document.getElementById('websiteFormPanel').classList.remove('hidden');
    document.getElementById('websiteFormTitle').textContent = website ? 'Editar website' : 'Novo website';
    document.getElementById('wfId').value = website ? website.id : '';
    document.getElementById('wfName').value = website ? website.name : '';
    document.getElementById('wfDomain').value = website ? (website.domain || '') : '';
    document.getElementById('wfCloudflare').value = website && website.cloudflareAccountId ? website.cloudflareAccountId : '';
    document.getElementById('wfGithub').value = website && website.githubAccountId ? website.githubAccountId : '';
    document.getElementById('wfCloudinary').value = website && website.cloudinaryAccountId ? website.cloudinaryAccountId : '';
    document.getElementById('wfStatus').value = website ? website.status : 'active';
    document.getElementById('wfNotes').value = website ? (website.notes || '') : '';
  }

  function closeWebsiteForm() {
    document.getElementById('websiteFormPanel').classList.add('hidden');
  }

  document.getElementById('btnNewWebsite').addEventListener('click', function () { openWebsiteForm(null); });
  document.getElementById('wfCancel').addEventListener('click', closeWebsiteForm);

  document.getElementById('websiteForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const id = document.getElementById('wfId').value;
    const body = {
      name: document.getElementById('wfName').value.trim(),
      domain: document.getElementById('wfDomain').value.trim(),
      cloudflareAccountId: document.getElementById('wfCloudflare').value || null,
      githubAccountId: document.getElementById('wfGithub').value || null,
      cloudinaryAccountId: document.getElementById('wfCloudinary').value || null,
      status: document.getElementById('wfStatus').value,
      notes: document.getElementById('wfNotes').value.trim(),
    };
    try {
      if (id) {
        body.id = id;
        await api('/websites', { method: 'PUT', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(body) });
      } else {
        await api('/websites', { method: 'POST', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(body) });
      }
      closeWebsiteForm();
      fetchWebsites();
    } catch (err) {
      alert('Erro: ' + (err.message || err));
    }
  });

  document.getElementById('websitesList').addEventListener('click', function (e) {
    const editBtn = e.target.closest('.btn-edit-website');
    if (editBtn) {
      const w = websitesCache.find(function (x) { return x.id === editBtn.getAttribute('data-id'); });
      if (w) openWebsiteForm(w);
      return;
    }
    const delBtn = e.target.closest('.btn-del-website');
    if (delBtn) {
      if (!confirm('Apagar este website?')) return;
      api('/websites', {
        method: 'DELETE',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ id: delBtn.getAttribute('data-id') }),
      }).then(fetchWebsites).catch(function (err) { alert(err.message || err); });
    }
  });

  document.getElementById('websitesSearch').addEventListener('input', function (e) {
    websitesSearchQ = e.target.value.trim();
    renderWebsites();
  });

  document.getElementById('btnExportWebsites').addEventListener('click', function () {
    const rows = [['Nome', 'Domínio', 'Cloudflare', 'GitHub', 'Cloudinary', 'Estado', 'Notas']];
    filteredWebsites().forEach(function (w) {
      rows.push([w.name, w.domain, w.cloudflareEmail, w.githubEmail, w.cloudinaryEmail, w.status, w.notes]);
    });
    downloadCsv('websites-workersdev.csv', rows);
  });

  /* ---- Pending ---- */

  function filteredPending() {
    let list = pendingCache.slice();
    if (pendingStatusFilter !== 'all') {
      list = list.filter(function (p) { return p.status === pendingStatusFilter; });
    }
    if (pendingSearchQ) {
      const q = pendingSearchQ.toLowerCase();
      list = list.filter(function (p) {
        return (p.name || '').toLowerCase().indexOf(q) !== -1
          || (p.contactName || '').toLowerCase().indexOf(q) !== -1
          || (p.phone || '').toLowerCase().indexOf(q) !== -1
          || (p.notes || '').toLowerCase().indexOf(q) !== -1;
      });
    }
    return list;
  }

  function updateBulkBtn() {
    const n = Object.keys(selectedPendingIds).length;
    const btn = document.getElementById('btnBulkPending');
    btn.disabled = n === 0;
    btn.textContent = 'Alterar estado (' + n + ')';
  }

  function renderPending() {
    const listEl = document.getElementById('pendingList');
    const emptyEl = document.getElementById('pendingEmpty');
    const metaEl = document.getElementById('pendingMeta');
    if (!listEl) return;
    listEl.innerHTML = '';
    const list = filteredPending();
    if (!list.length) {
      emptyEl.classList.remove('hidden');
      metaEl.textContent = pendingCache.length ? '0 resultados' : '0 pendentes';
      updateBulkBtn();
      return;
    }
    emptyEl.classList.add('hidden');
    metaEl.textContent = list.length + ' pendente' + (list.length === 1 ? '' : 's');

    list.forEach(function (p) {
      const card = document.createElement('div');
      card.className = 'client-card';
      const checked = selectedPendingIds[p.id] ? ' checked' : '';
      const badgeCls = p.status === 'won' ? 'badge--active'
        : (p.status === 'lost' ? 'badge--ended'
          : (p.status === 'proposal' ? 'badge--pending' : 'badge--paused'));
      card.innerHTML =
        '<div class="client-card-top">' +
          '<div style="display:flex;align-items:center;gap:0.6rem;">' +
            '<input type="checkbox" class="pending-check" data-id="' + escapeHtml(p.id) + '"' + checked + '>' +
            '<div class="client-name">' + escapeHtml(p.name) + '</div>' +
          '</div>' +
          '<span class="badge ' + badgeCls + '">' + escapeHtml(PENDING_LABELS[p.status] || p.status) + '</span>' +
        '</div>' +
        '<div class="client-row">' +
          (p.contactName ? '<span>' + escapeHtml(p.contactName) + '</span>' : '') +
          (p.phone ? '<span>' + escapeHtml(p.phone) + '</span>' : '') +
          (p.instagram ? '<span>IG: ' + escapeHtml(p.instagram) + '</span>' : '') +
          (p.facebook ? '<span>FB: ' + escapeHtml(p.facebook) + '</span>' : '') +
        '</div>' +
        (p.notes ? '<div class="client-row"><span>' + escapeHtml(p.notes) + '</span></div>' : '') +
        '<div class="client-meta">' + formatDate(p.createdAt) + '</div>' +
        '<div class="client-actions">' +
          '<button type="button" class="admin-btn admin-btn--sm btn-edit-pending" data-id="' + escapeHtml(p.id) + '">Editar</button>' +
          '<button type="button" class="admin-btn admin-btn--sm admin-btn--danger btn-del-pending" data-id="' + escapeHtml(p.id) + '">Apagar</button>' +
        '</div>';
      listEl.appendChild(card);
    });
    updateBulkBtn();
  }

  async function fetchPending() {
    try {
      const data = await api('/pending_clients', { headers: authHeaders() });
      pendingCache = data.pending || [];
      renderPending();
    } catch (e) {
      document.getElementById('pendingMeta').textContent = 'Erro: ' + (e.message || e);
    }
  }

  function openPendingForm(item) {
    document.getElementById('pendingFormPanel').classList.remove('hidden');
    document.getElementById('pendingFormTitle').textContent = item ? 'Editar pendente' : 'Novo pendente';
    document.getElementById('pfId').value = item ? item.id : '';
    document.getElementById('pfName').value = item ? item.name : '';
    document.getElementById('pfContact').value = item ? (item.contactName || '') : '';
    document.getElementById('pfPhone').value = item ? (item.phone || '') : '';
    document.getElementById('pfStatus').value = item ? item.status : 'pending';
    document.getElementById('pfInstagram').value = item ? (item.instagram || '') : '';
    document.getElementById('pfFacebook').value = item ? (item.facebook || '') : '';
    document.getElementById('pfNotes').value = item ? (item.notes || '') : '';
  }

  function closePendingForm() {
    document.getElementById('pendingFormPanel').classList.add('hidden');
  }

  document.getElementById('btnNewPending').addEventListener('click', function () { openPendingForm(null); });
  document.getElementById('pfCancel').addEventListener('click', closePendingForm);

  document.getElementById('pendingForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const id = document.getElementById('pfId').value;
    const body = {
      name: document.getElementById('pfName').value.trim(),
      contactName: document.getElementById('pfContact').value.trim(),
      phone: document.getElementById('pfPhone').value.trim(),
      status: document.getElementById('pfStatus').value,
      instagram: document.getElementById('pfInstagram').value.trim(),
      facebook: document.getElementById('pfFacebook').value.trim(),
      notes: document.getElementById('pfNotes').value.trim(),
    };
    try {
      if (id) {
        body.id = id;
        await api('/pending_clients', { method: 'PUT', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(body) });
      } else {
        await api('/pending_clients', { method: 'POST', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(body) });
      }
      closePendingForm();
      fetchPending();
    } catch (err) {
      alert('Erro: ' + (err.message || err));
    }
  });

  document.getElementById('pendingList').addEventListener('click', function (e) {
    const check = e.target.closest('.pending-check');
    if (check) {
      const id = check.getAttribute('data-id');
      if (check.checked) selectedPendingIds[id] = true;
      else delete selectedPendingIds[id];
      updateBulkBtn();
      return;
    }
    const editBtn = e.target.closest('.btn-edit-pending');
    if (editBtn) {
      const p = pendingCache.find(function (x) { return x.id === editBtn.getAttribute('data-id'); });
      if (p) openPendingForm(p);
      return;
    }
    const delBtn = e.target.closest('.btn-del-pending');
    if (delBtn) {
      if (!confirm('Apagar este pendente?')) return;
      api('/pending_clients', {
        method: 'DELETE',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ id: delBtn.getAttribute('data-id') }),
      }).then(function () {
        delete selectedPendingIds[delBtn.getAttribute('data-id')];
        fetchPending();
      }).catch(function (err) { alert(err.message || err); });
    }
  });

  document.getElementById('pendingFilters').addEventListener('click', function (e) {
    const chip = e.target.closest('.filter-chip');
    if (!chip) return;
    pendingStatusFilter = chip.getAttribute('data-pstatus');
    document.querySelectorAll('#pendingFilters .filter-chip').forEach(function (c) {
      c.classList.toggle('active', c === chip);
    });
    renderPending();
  });

  document.getElementById('pendingSearch').addEventListener('input', function (e) {
    pendingSearchQ = e.target.value.trim();
    renderPending();
  });

  document.getElementById('btnBulkPending').addEventListener('click', async function () {
    const ids = Object.keys(selectedPendingIds);
    if (!ids.length) return;
    const status = prompt('Novo estado: pending | contacted | proposal | won | lost', 'contacted');
    if (!status || !PENDING_LABELS[status]) {
      if (status !== null) alert('Estado inválido');
      return;
    }
    try {
      await api('/pending_clients/bulk_status', {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ ids: ids, status: status }),
      });
      selectedPendingIds = {};
      fetchPending();
    } catch (err) {
      alert('Erro: ' + (err.message || err));
    }
  });

  document.getElementById('btnExportPending').addEventListener('click', function () {
    const rows = [['Nome', 'Contacto', 'Telefone', 'Instagram', 'Facebook', 'Estado', 'Notas', 'Criado']];
    filteredPending().forEach(function (p) {
      rows.push([p.name, p.contactName, p.phone, p.instagram, p.facebook, p.status, p.notes, p.createdAt]);
    });
    downloadCsv('pendentes-workersdev.csv', rows);
  });

  /* ---------- Grok accounts (24h free-tier cooldown) ---------- */

  let grokCache = [];
  let grokStatusFilter = 'all';
  let grokSearchQ = '';
  let grokTickerId = null;

  function stopGrokTicker() {
    if (grokTickerId) {
      clearInterval(grokTickerId);
      grokTickerId = null;
    }
  }

  function startGrokTicker() {
    stopGrokTicker();
    grokTickerId = setInterval(function () {
      if (currentTab === 'grok') renderGrok();
    }, 30000);
  }

  function formatRemaining(ms) {
    if (ms <= 0) return '0m';
    const totalMin = Math.ceil(ms / 60000);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    if (h > 0) return h + 'h ' + m + 'm';
    return m + 'm';
  }

  function isGrokOnCooldown(a) {
    if (!a.cooldownUntil) return false;
    return new Date(a.cooldownUntil).getTime() > Date.now();
  }

  function filteredGrok() {
    let list = grokCache.slice();
    if (grokStatusFilter === 'available') {
      list = list.filter(function (a) { return !isGrokOnCooldown(a); });
    } else if (grokStatusFilter === 'cooldown') {
      list = list.filter(function (a) { return isGrokOnCooldown(a); });
    }
    if (grokSearchQ) {
      const q = grokSearchQ.toLowerCase();
      list = list.filter(function (a) {
        return (a.email || '').toLowerCase().indexOf(q) !== -1
          || (a.notes || '').toLowerCase().indexOf(q) !== -1
          || (a.label || '').toLowerCase().indexOf(q) !== -1;
      });
    }
    // Available first, then soonest-to-expire
    list.sort(function (a, b) {
      const aOn = isGrokOnCooldown(a);
      const bOn = isGrokOnCooldown(b);
      if (aOn !== bOn) return aOn ? 1 : -1;
      if (aOn && bOn) {
        return new Date(a.cooldownUntil).getTime() - new Date(b.cooldownUntil).getTime();
      }
      return (a.email || '').localeCompare(b.email || '');
    });
    return list;
  }

  function renderGrok() {
    const listEl = document.getElementById('grokList');
    const emptyEl = document.getElementById('grokEmpty');
    const metaEl = document.getElementById('grokMeta');
    if (!listEl) return;

    const availableCount = grokCache.filter(function (a) { return !isGrokOnCooldown(a); }).length;
    const cooldownCount = grokCache.length - availableCount;
    const sumTotal = document.getElementById('grokSumTotal');
    const sumAvail = document.getElementById('grokSumAvailable');
    const sumCool = document.getElementById('grokSumCooldown');
    if (sumTotal) sumTotal.textContent = String(grokCache.length);
    if (sumAvail) sumAvail.textContent = String(availableCount);
    if (sumCool) sumCool.textContent = String(cooldownCount);

    listEl.innerHTML = '';
    const list = filteredGrok();
    if (!list.length) {
      emptyEl.classList.remove('hidden');
      metaEl.textContent = grokCache.length ? '0 resultados' : '0 contas Grok';
      return;
    }
    emptyEl.classList.add('hidden');
    metaEl.textContent = list.length + ' conta' + (list.length === 1 ? '' : 's');

    const now = Date.now();
    list.forEach(function (a) {
      const onCd = isGrokOnCooldown(a);
      const remaining = onCd ? new Date(a.cooldownUntil).getTime() - now : 0;
      const card = document.createElement('div');
      card.className = 'client-card' + (onCd ? ' client-card--cooldown' : '');
      const badgeClass = onCd ? 'badge badge--overdue' : 'badge badge--active';
      const badgeText = onCd ? 'Em cooldown' : 'Disponível';
      const pwdMasked = a.password ? '••••••••' : '—';
      const title = (a.label ? a.label + ' · ' : '') + (a.email || '');

      card.innerHTML =
        '<div class="client-card-top">' +
          '<div class="client-name">' + escapeHtml(title) + '</div>' +
          '<span class="' + badgeClass + '">' + badgeText + '</span>' +
        '</div>' +
        (onCd
          ? '<div class="client-row"><strong>Disponível em ' + formatRemaining(remaining) + '</strong>' +
            ' <span style="opacity:0.7">(' + formatDateTime(a.cooldownUntil) + ')</span></div>'
          : '') +
        '<div class="client-row">' +
          '<span>Password: <code class="pwd-mask" data-pwd="' + escapeHtml(a.password || '') + '">' + pwdMasked + '</code> ' +
          (a.password ? '<button type="button" class="admin-btn admin-btn--sm btn-reveal-pwd">Mostrar</button>' : '') +
          '</span>' +
        '</div>' +
        (a.notes ? '<div class="client-row"><span>' + escapeHtml(a.notes) + '</span></div>' : '') +
        '<div class="client-meta">' + formatDateTime(a.updatedAt || a.createdAt) + '</div>' +
        '<div class="client-actions">' +
          (onCd
            ? '<button type="button" class="admin-btn admin-btn--sm btn-clear-cooldown" data-id="' + escapeHtml(a.id) + '">Limpar cooldown</button>'
            : '<button type="button" class="admin-btn admin-btn--sm admin-btn--solid btn-mark-limit" data-id="' + escapeHtml(a.id) + '">Marcar limite (24h)</button>') +
          '<button type="button" class="admin-btn admin-btn--sm btn-edit-grok" data-id="' + escapeHtml(a.id) + '">Editar</button>' +
          '<button type="button" class="admin-btn admin-btn--sm admin-btn--danger btn-del-grok" data-id="' + escapeHtml(a.id) + '">Apagar</button>' +
        '</div>';
      listEl.appendChild(card);
    });
  }

  async function fetchGrok() {
    try {
      const data = await api('/grok_accounts', { headers: authHeaders() });
      grokCache = data.accounts || [];
      renderGrok();
      startGrokTicker();
    } catch (e) {
      const meta = document.getElementById('grokMeta');
      if (meta) meta.textContent = 'Erro: ' + (e.message || e);
    }
  }

  function openGrokForm(account) {
    document.getElementById('grokFormPanel').classList.remove('hidden');
    document.getElementById('grokFormTitle').textContent = account ? 'Editar conta Grok' : 'Nova conta Grok';
    document.getElementById('gfId').value = account ? account.id : '';
    document.getElementById('gfEmail').value = account ? account.email : '';
    document.getElementById('gfLabel').value = account ? (account.label || '') : '';
    document.getElementById('gfPassword').value = account ? (account.password || '') : '';
    document.getElementById('gfPassword').type = 'password';
    document.getElementById('gfNotes').value = account ? (account.notes || '') : '';
  }

  function closeGrokForm() {
    document.getElementById('grokFormPanel').classList.add('hidden');
  }

  document.getElementById('btnNewGrok').addEventListener('click', function () {
    openGrokForm(null);
  });

  document.getElementById('gfCancel').addEventListener('click', closeGrokForm);

  document.getElementById('gfPwdToggle').addEventListener('click', function () {
    const inp = document.getElementById('gfPassword');
    inp.type = inp.type === 'password' ? 'text' : 'password';
  });

  document.getElementById('grokForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const id = document.getElementById('gfId').value.trim();
    const body = {
      email: document.getElementById('gfEmail').value.trim(),
      label: document.getElementById('gfLabel').value.trim(),
      password: document.getElementById('gfPassword').value,
      notes: document.getElementById('gfNotes').value.trim(),
    };
    try {
      if (id) {
        body.id = id;
        await api('/grok_accounts', {
          method: 'PUT',
          headers: authHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify(body),
        });
      } else {
        await api('/grok_accounts', {
          method: 'POST',
          headers: authHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify(body),
        });
      }
      closeGrokForm();
      fetchGrok();
    } catch (err) {
      alert('Erro: ' + (err.message || err));
    }
  });

  document.getElementById('grokList').addEventListener('click', function (e) {
    const reveal = e.target.closest('.btn-reveal-pwd');
    if (reveal) {
      const code = reveal.parentElement.querySelector('.pwd-mask');
      if (code) {
        const real = code.getAttribute('data-pwd') || '';
        if (code.textContent === '••••••••') {
          code.textContent = real;
          reveal.textContent = 'Ocultar';
        } else {
          code.textContent = '••••••••';
          reveal.textContent = 'Mostrar';
        }
      }
      return;
    }

    const markBtn = e.target.closest('.btn-mark-limit');
    if (markBtn) {
      const id = markBtn.getAttribute('data-id');
      api('/grok_accounts/cooldown', {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ id: id, action: 'mark' }),
      }).then(function () { fetchGrok(); }).catch(function (err) {
        alert('Erro: ' + (err.message || err));
      });
      return;
    }

    const clearBtn = e.target.closest('.btn-clear-cooldown');
    if (clearBtn) {
      const id = clearBtn.getAttribute('data-id');
      api('/grok_accounts/cooldown', {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ id: id, action: 'clear' }),
      }).then(function () { fetchGrok(); }).catch(function (err) {
        alert('Erro: ' + (err.message || err));
      });
      return;
    }

    const editBtn = e.target.closest('.btn-edit-grok');
    if (editBtn) {
      const a = grokCache.find(function (x) { return x.id === editBtn.getAttribute('data-id'); });
      if (a) openGrokForm(a);
      return;
    }

    const delBtn = e.target.closest('.btn-del-grok');
    if (delBtn) {
      if (!confirm('Apagar esta conta Grok?')) return;
      api('/grok_accounts', {
        method: 'DELETE',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ id: delBtn.getAttribute('data-id') }),
      }).then(function () { fetchGrok(); }).catch(function (err) {
        alert('Erro: ' + (err.message || err));
      });
    }
  });

  document.getElementById('grokFilters').addEventListener('click', function (e) {
    const chip = e.target.closest('.filter-chip');
    if (!chip) return;
    grokStatusFilter = chip.getAttribute('data-gstatus');
    document.querySelectorAll('#grokFilters .filter-chip').forEach(function (c) {
      c.classList.toggle('active', c === chip);
    });
    renderGrok();
  });

  document.getElementById('grokSearch').addEventListener('input', function (e) {
    grokSearchQ = e.target.value.trim();
    renderGrok();
  });

  document.getElementById('btnSeedGrok').addEventListener('click', async function () {
    if (!confirm('Importar contas Google de Contas para a lista Grok? (só se a lista Grok estiver vazia)')) return;
    try {
      const data = await api('/grok_accounts/seed', {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: '{}',
      });
      alert(data.message || ('Importadas: ' + (data.added || 0)));
      fetchGrok();
    } catch (err) {
      alert('Erro: ' + (err.message || err));
    }
  });

  document.getElementById('btnExportGrok').addEventListener('click', function () {
    const rows = [['Email', 'Etiqueta', 'Password', 'Cooldown até', 'Estado', 'Notas', 'Actualizado']];
    filteredGrok().forEach(function (a) {
      const onCd = isGrokOnCooldown(a);
      rows.push([
        a.email,
        a.label || '',
        a.password || '',
        a.cooldownUntil || '',
        onCd ? 'cooldown' : 'available',
        a.notes || '',
        a.updatedAt || a.createdAt || '',
      ]);
    });
    downloadCsv('grok-accounts-workersdev.csv', rows);
  });

  if (localStorage.getItem(REMEMBER_KEY) === '1' && rememberMe) {
    rememberMe.checked = true;
  }

  if (getPwd()) {
    switchTab('leads');
  }
})();
