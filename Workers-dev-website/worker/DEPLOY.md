# Deploy do Chat AI — Workers Dev

## 1. Frontend (já feito)
- `js/chat.js` e estilos em `css/styles.css` estão incluídos em `index.html` e `contact.html`.
- Abre o ficheiro `js/chat.js` e substitui:

```js
const WORKER_URL = "https://workersdev-chat.YOUR_SUBDOMAIN.workers.dev";
```

pelo URL real do Worker depois do deploy.

## 2. Cloudflare Worker

### Opção A — Dashboard
1. Cloudflare Dashboard → Workers & Pages → Create Worker
2. Nome: `workersdev-chat`
3. Cola o conteúdo de `chat-worker.js`
4. Settings → Bindings → adiciona **Workers AI** com binding name `AI`
5. Settings → Variables → Secrets:
   - `RESEND_API_KEY` = a tua chave Resend
   - `NOTIFY_EMAIL` = o teu email (ex: o Gmail que já usavas)
6. Deploy

### Opção B — Wrangler (CLI)
```bash
cd worker
npx wrangler login
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put NOTIFY_EMAIL
npx wrangler deploy
```

## 3. Resend
- Se ainda não tens: resend.com → API Key
- O `from` no Worker usa `onboarding@resend.dev` (funciona para testes).
- Para produção, verifica o teu domínio no Resend e muda o `from` no código.

## 4. Comportamento
- O cliente fala com o assistente (Llama via Workers AI).
- Tom formal, PT ou EN conforme o idioma do site.
- Ao fechar o chat (ou a cada ~4 mensagens), a conversa completa é enviada por email para `NOTIFY_EMAIL`.

## 5. Teste
1. Abre o site
2. Clica no balão azul no canto inferior direito
3. Envia uma pergunta (ex: “Quanto custa o plano Bro?”)
4. Fecha o chat → verifica o email
