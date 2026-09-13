/* Workers Dev — AI Chat Bubble
   Calls Cloudflare Worker → AI + email transcript
*/

(function () {
  // ——— Config (edit these) ———
  const WORKER_URL = "https://workersdev-chat.YOUR_SUBDOMAIN.workers.dev"; // ← replace after deploy
  const SAVE_ON_CLOSE = true; // email transcript when chat is closed

  // ——— State ———
  let history = [];
  let isOpen = false;
  let isSending = false;
  let lang = localStorage.getItem("wd-lang") || "pt";

  const i18n = {
    pt: {
      title: "Workers Dev",
      subtitle: "Assistente · resposta formal",
      placeholder: "Escreva a sua mensagem…",
      welcome: "Olá. Sou o assistente da Workers Dev. Posso esclarecer dúvidas sobre planos, prazos e como funciona o nosso serviço. Em que posso ajudar?",
      typing: "A escrever…",
      note: "A conversa é enviada por email à equipa.",
      error: "Não foi possível obter resposta. Tente novamente ou contacte-nos pelo formulário.",
      offline: "O assistente está temporariamente indisponível. Use o formulário de contacto ou WhatsApp."
    },
    en: {
      title: "Workers Dev",
      subtitle: "Assistant · formal tone",
      placeholder: "Type your message…",
      welcome: "Hello. I am the Workers Dev assistant. I can answer questions about plans, timelines and how our service works. How may I help you?",
      typing: "Typing…",
      note: "The conversation is emailed to the team.",
      error: "Could not get a reply. Please try again or use the contact form.",
      offline: "The assistant is temporarily unavailable. Please use the contact form or WhatsApp."
    }
  };

  function t(key) {
    return (i18n[lang] && i18n[lang][key]) || i18n.pt[key] || key;
  }

  // ——— DOM ———
  function createUI() {
    const launcher = document.createElement("button");
    launcher.className = "wd-chat-launcher";
    launcher.setAttribute("aria-label", "Abrir chat");
    launcher.innerHTML = `
      <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    `;

    const windowEl = document.createElement("div");
    windowEl.className = "wd-chat-window";
    windowEl.setAttribute("role", "dialog");
    windowEl.setAttribute("aria-label", "Chat Workers Dev");
    windowEl.innerHTML = `
      <div class="wd-chat-header">
        <div>
          <div class="wd-chat-header-title" data-chat="title">${t("title")}</div>
          <div class="wd-chat-header-sub" data-chat="subtitle">${t("subtitle")}</div>
        </div>
        <button type="button" class="wd-chat-close" aria-label="Fechar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="wd-chat-messages" id="wd-chat-messages"></div>
      <div class="wd-chat-footer">
        <form class="wd-chat-form" id="wd-chat-form">
          <input type="text" class="wd-chat-input" id="wd-chat-input" autocomplete="off" data-chat-ph="placeholder" placeholder="${t("placeholder")}" />
          <button type="submit" class="wd-chat-send" aria-label="Enviar">
            <svg viewBox="0 0 24 24"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          </button>
        </form>
        <p class="wd-chat-note" data-chat="note">${t("note")}</p>
      </div>
    `;

    document.body.appendChild(launcher);
    document.body.appendChild(windowEl);

    return { launcher, windowEl };
  }

  function addMessage(role, text, isTyping = false) {
    const box = document.getElementById("wd-chat-messages");
    if (!box) return;

    const div = document.createElement("div");
    div.className = `wd-chat-msg ${role}${isTyping ? " typing" : ""}`;
    div.textContent = text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
    return div;
  }

  function updateLangUI() {
    lang = localStorage.getItem("wd-lang") || "pt";
    document.querySelectorAll("[data-chat]").forEach((el) => {
      const key = el.getAttribute("data-chat");
      if (key && i18n[lang][key]) el.textContent = i18n[lang][key];
    });
    const input = document.getElementById("wd-chat-input");
    if (input) input.placeholder = t("placeholder");
  }

  async function sendToWorker(userText) {
    history.push({ role: "user", content: userText });

    const typingEl = addMessage("bot", t("typing"), true);
    isSending = true;
    const sendBtn = document.querySelector(".wd-chat-send");
    if (sendBtn) sendBtn.disabled = true;

    try {
      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          lang: lang,
          action: "chat"
        })
      });

      if (!res.ok) throw new Error("Worker error");

      const data = await res.json();
      if (typingEl) typingEl.remove();

      const reply = data.reply || t("error");
      addMessage("bot", reply);
      history.push({ role: "assistant", content: reply });
    } catch (err) {
      if (typingEl) typingEl.remove();
      addMessage("bot", t("offline"));
      console.warn("Chat worker:", err);
    } finally {
      isSending = false;
      if (sendBtn) sendBtn.disabled = false;
    }
  }

  async function saveConversation() {
    if (history.length < 2) return;
    try {
      await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          lang: lang,
          action: "save"
        })
      });
    } catch (e) {
      console.warn("Save conversation failed", e);
    }
  }

  function openChat() {
    isOpen = true;
    document.querySelector(".wd-chat-launcher")?.classList.add("open");
    document.querySelector(".wd-chat-window")?.classList.add("open");
    if (history.length === 0) {
      addMessage("bot", t("welcome"));
      history.push({ role: "assistant", content: t("welcome") });
    }
    setTimeout(() => document.getElementById("wd-chat-input")?.focus(), 200);
  }

  function closeChat() {
    isOpen = false;
    document.querySelector(".wd-chat-launcher")?.classList.remove("open");
    document.querySelector(".wd-chat-window")?.classList.remove("open");
    if (SAVE_ON_CLOSE) saveConversation();
  }

  function init() {
    const { launcher, windowEl } = createUI();

    launcher.addEventListener("click", () => {
      if (isOpen) closeChat();
      else openChat();
    });

    windowEl.querySelector(".wd-chat-close")?.addEventListener("click", closeChat);

    document.getElementById("wd-chat-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      if (isSending) return;
      const input = document.getElementById("wd-chat-input");
      const text = (input?.value || "").trim();
      if (!text) return;
      input.value = "";
      addMessage("user", text);
      sendToWorker(text);
    });

    // Sync language when main site language changes
    document.querySelectorAll(".lang-toggle button").forEach((btn) => {
      btn.addEventListener("click", () => setTimeout(updateLangUI, 50));
    });

    updateLangUI();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
