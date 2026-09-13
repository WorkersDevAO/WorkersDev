/**
 * Workers Dev — Chat AI Worker
 *
 * Deploy: wrangler deploy (or Cloudflare Dashboard → Workers)
 * Secrets needed:
 *   RESEND_API_KEY   → for emailing conversations
 *   NOTIFY_EMAIL     → your Gmail / inbox (e.g. you@gmail.com)
 *
 * Optional:
 *   Uses Cloudflare Workers AI (Llama) — no external API key required.
 *   If you prefer OpenAI/Grok, replace the AI call and add OPENAI_API_KEY.
 */

export default {
  async fetch(request, env, ctx) {
    // CORS for static site
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders()
      });
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }

    const { messages = [], lang = "pt", action = "chat" } = body;

    if (action === "save") {
      await emailTranscript(env, messages, lang);
      return json({ ok: true });
    }

    // action === "chat"
    try {
      const reply = await generateReply(env, messages, lang);
      // Also email every few turns (optional safety)
      if (messages.length >= 4 && messages.length % 4 === 0) {
        ctx.waitUntil(emailTranscript(env, messages.concat({ role: "assistant", content: reply }), lang));
      }
      return json({ reply });
    } catch (err) {
      console.error(err);
      return json({
        reply: lang === "en"
          ? "I am temporarily unable to respond. Please use the contact form or WhatsApp."
          : "Neste momento não consigo responder. Por favor use o formulário de contacto ou o WhatsApp."
      });
    }
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders()
  });
}

const SYSTEM_PT = `És o assistente oficial da Workers Dev, uma agência em Angola que cria e hospeda sites profissionais para serviços e negócios (salões, lojas, freelancers, etc.).

Tom: formal, claro, prestável e profissional. Responde em português de Angola.
Não inventes preços ou prazos. Usa apenas a informação abaixo.

Planos:
- Worker's Bro: 2.500 Kz/mês — presença online simples, WhatsApp, actualizações básicas, hospedagem incluída.
- Worker's Family: 25.000 Kz/ano — o mesmo do Bro, pagamento anual (poupa 5.000 Kz).
- Pro: 35.000 Kz/mês — dashboard, pedidos/formulários, booking, base de dados, suporte prioritário.
- Empresa: 75.000–120.000 Kz/mês ou orçamento personalizado — tudo do Pro + funcionalidades à medida, mais capacidade, suporte dedicado.

Prazos: a maioria dos sites fica online em poucos dias (tipicamente 3–7 dias) após receber conteúdo e fotos.
Hospedagem básica incluída nos planos; domínio personalizado tem custo extra.
Contacto: formulário no site ou WhatsApp +244 943 278 361.

Se a pergunta sair do âmbito (preços exactos de domínio, prazos exactos de um projecto específico, etc.), recomenda o formulário de contacto ou o WhatsApp para a equipa responder.
Respostas curtas e úteis (2–5 frases).`;

const SYSTEM_EN = `You are the official assistant of Workers Dev, an agency in Angola that builds and hosts professional websites for services and businesses (salons, shops, freelancers, etc.).

Tone: formal, clear, helpful and professional. Reply in English.
Do not invent prices or timelines. Use only the information below.

Plans:
- Worker's Bro: 2,500 Kz/month — simple online presence, WhatsApp, basic updates, hosting included.
- Worker's Family: 25,000 Kz/year — same as Bro, yearly payment (save 5,000 Kz).
- Pro: 35,000 Kz/month — dashboard, orders/forms, booking, database, priority support.
- Empresa: 75,000–120,000 Kz/month or custom quote — everything in Pro + custom features, more capacity, dedicated support.

Timeline: most sites go live in a few days (typically 3–7 days) after receiving content and photos.
Basic hosting is included; a custom domain costs extra.
Contact: form on the website or WhatsApp +244 943 278 361.

If the question is outside this scope, recommend the contact form or WhatsApp so the team can reply.
Keep answers short and useful (2–5 sentences).`;

async function generateReply(env, messages, lang) {
  const system = lang === "en" ? SYSTEM_EN : SYSTEM_PT;

  // Cloudflare Workers AI (Llama 3.1 8B)
  const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
    messages: [
      { role: "system", content: system },
      ...messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content
      }))
    ],
    max_tokens: 400,
    temperature: 0.4
  });

  return (response.response || response.result?.response || "").trim() ||
    (lang === "en" ? "How else may I assist you?" : "Em que mais posso ajudar?");
}

async function emailTranscript(env, messages, lang) {
  const apiKey = env.RESEND_API_KEY;
  const to = env.NOTIFY_EMAIL;
  if (!apiKey || !to) {
    console.log("Email skipped: missing RESEND_API_KEY or NOTIFY_EMAIL");
    return;
  }

  const lines = messages.map((m) => {
    const who = m.role === "user" ? "Cliente" : "Assistente";
    return `${who}: ${m.content}`;
  });

  const bodyText = [
    "Nova conversa no chat do site Workers Dev",
    `Idioma: ${lang}`,
    `Data: ${new Date().toISOString()}`,
    "",
    "———",
    ...lines,
    "———"
  ].join("\n");

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "Workers Dev Chat <onboarding@resend.dev>", // change to your verified domain later
      to: [to],
      subject: `[Chat] Nova conversa — Workers Dev`,
      text: bodyText
    })
  });
}
