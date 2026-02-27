# AGENTS.md

Guia para agentes (IA ou humanos) contribuírem neste repositório com segurança e consistência.

## 1) Objetivo do projeto
- Produto: `Snippet Pocket` (web/mobile) + extensão Chrome (`Snippet Manager`) com sincronização em nuvem e cobrança Stripe.
- Site em produção: `https://snippet-link-pocket.netlify.app`
- Hospedagem e funções: Netlify (`web` + `api/netlify/functions`)

## 2) Estrutura do repositório
- `web/`: app web/mobile (UI principal do usuário)
- `extension/`: extensão Chrome (manifest v3, popup, background)
- `api/netlify/functions/`: backend serverless (auth, snippets, billing, webhook Stripe)
- `netlify.toml`: configuração de build/functions
- `package.json`: scripts de dev/deploy

## 3) Comandos principais
- Instalar dependências:
  - `npm install`
- Rodar local com Netlify:
  - `npm run dev`
- Deploy produção:
  - `npm run deploy`

## 4) Variáveis de ambiente críticas
Nunca commitar segredos. Configure no Netlify (Site settings > Environment variables) e localmente via ambiente.

Principais variáveis:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_ID` (quando aplicável)
- Variáveis de banco usadas pelas funções (`snippets`/`auth`)

## 5) Regras de alteração por área

### 5.1 Extensão Chrome (`extension/`)
- Sempre aumentar `version` em `extension/manifest.json` antes de gerar ZIP para publicação.
- Se usar permissões sensíveis (`alarms`, etc.), garantir justificativa na Chrome Web Store.
- Evitar quebrar IDs/classes esperados por `popup.js` ao editar `popup.html`.
- Após mudanças visuais, validar:
  - popup abre sem erros
  - ações por snippet funcionam (abrir, copiar, editar, excluir, mostrar)

### 5.2 App web/mobile (`web/`)
- Preservar i18n PT/EN/FR ao adicionar textos novos.
- Evitar regressão no fluxo de auth, sync e billing.
- Para conteúdo longo de texto/link, manter preview truncado e modal de conteúdo completo.

### 5.3 Funções Netlify (`api/netlify/functions/`)
- Mudanças em cobrança exigem atenção extra em:
  - `billing.js`
  - `stripe-webhook.js`
- Ao mexer em webhook, validar impacto no estado `entitled/subscriptionStatus` do usuário.
- Nunca logar segredos ou tokens sensíveis.

## 6) Fluxo de publicação da extensão
1. Atualizar `extension/manifest.json` com versão maior que a publicada.
2. Gerar ZIP do conteúdo da pasta `extension/` (não zipar a pasta raiz inteira).
3. Validar `manifest.json` dentro do ZIP.
4. Subir na Chrome Web Store.

Observação: manter pacote de upload sem arquivos temporários (`.DS_Store`, etc.).

## 7) Fluxo recomendado de deploy
1. Commitar somente arquivos relevantes (evitar `dist/`, temporários e segredos).
2. Push para branch alvo (`main`, hoje).
3. Executar `npm run deploy`.
4. Confirmar URL de produção e logs do deploy.

## 8) Checklist de regressão mínima
Antes de finalizar qualquer entrega, validar:
- Login/cadastro funcionando.
- Sync manual funcionando no app e extensão.
- Ações de snippet: criar, editar, excluir, favoritar, arquivar, copiar.
- Modal “Mostrar” para texto/link e botão “Copiar” dentro da modal.
- Billing UI:
  - usuário sem assinatura vê CTA de assinar
  - usuário Pro vê estado correto e opção de gerenciar assinatura.

## 9) Convenções de commit
- Mensagens claras no padrão:
  - `feat: ...`
  - `fix: ...`
  - `chore: ...`
- Evitar commits gigantes sem foco.

## 10) O que não fazer
- Não commitar chaves Stripe (`pk_live`, `sk_live`, `whsec_*`).
- Não usar comandos destrutivos de git sem solicitação explícita.
- Não alterar comportamento de cobrança sem considerar webhook + estado local + UI.

---
Se houver conflito entre este guia e solicitação explícita do dono do projeto, a solicitação explícita prevalece.
