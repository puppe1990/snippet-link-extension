# PRD - Assinatura Stripe (US$ 1/mês sem trial)

## 1. Resumo

Implementar monetização via Stripe no Snippet Link Manager com plano único de assinatura mensal de **US$ 1**, **sem período de trial**.

Objetivo do MVP: permitir que usuários autenticados assinem e mantenham acesso aos recursos pagos (principalmente sincronização em nuvem), com controle de acesso feito no backend.

---

## 2. Problema

Hoje o produto possui autenticação, sincronização em nuvem e app mobile, mas não possui cobrança recorrente nem controle de entitlement por plano.

Isso impede:
- monetização recorrente;
- separação clara entre Free e Pro;
- gestão de cancelamento/renovação de forma escalável.

---

## 3. Objetivos

- Criar fluxo de assinatura Stripe com cobrança mensal de US$ 1.
- Não oferecer trial.
- Bloquear/liberar recursos pagos por status de assinatura ativa.
- Permitir autogestão de assinatura (cancelamento, cartão, etc.) via Customer Portal.
- Manter experiência atual de login/sync com mínimo retrabalho.

---

## 4. Fora de escopo (MVP)

- Múltiplos planos (anual, lifetime, enterprise).
- Cupons, promoções e descontos.
- Prorrata avançada.
- Reembolso automatizado.
- A/B test de preço.

---

## 5. Usuários e Cenários

- Usuário novo:
  - cria conta;
  - faz assinatura;
  - usa sync cloud e recursos Pro.
- Usuário existente sem assinatura:
  - faz login;
  - tenta usar recurso pago;
  - recebe paywall e link de assinatura.
- Usuário com assinatura cancelada/expirada:
  - perde acesso aos recursos pagos;
  - mantém dados locais.

---

## 6. Requisitos Funcionais

### RF-01 - Checkout de assinatura
- Backend deve criar Stripe Checkout Session em `mode=subscription`.
- Checkout deve usar preço mensal de US$ 1 (`USD 100` centavos).
- Checkout deve ser iniciado apenas para usuário autenticado.

### RF-02 - Sem trial
- Checkout/subscription não deve configurar trial (`trial_period_days` e `trial_end` ausentes).

### RF-03 - Webhook Stripe
- Backend deve receber eventos do Stripe e atualizar status de assinatura no banco.
- Eventos mínimos:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_failed` (opcional no MVP, recomendado)

### RF-04 - Entitlement no backend
- Endpoints de recursos pagos devem validar assinatura ativa no backend.
- Se não ativo, retornar `402` ou `403` com erro padronizado (`subscription_required`).

### RF-05 - Customer Portal
- Usuário autenticado deve conseguir abrir sessão do Stripe Customer Portal para gerenciar assinatura.

### RF-06 - Exposição de status de assinatura
- Endpoint de sessão/auth deve retornar status de assinatura atual para UI renderizar estado (ativa, inativa, pendente).

### RF-07 - UI de paywall
- Extensão e app mobile devem mostrar CTA de assinatura quando usuário sem entitlement tentar recurso pago.
- CTA principal: “Assinar por US$ 1/mês”.
- CTA secundário (se assinante): “Gerenciar assinatura”.

---

## 7. Requisitos Não Funcionais

- Segurança:
  - validação de assinatura de webhook (`Stripe-Signature`);
  - chaves secretas somente em variáveis de ambiente.
- Confiabilidade:
  - fonte de verdade de billing = webhook + banco local.
- Performance:
  - validação de entitlement com consulta simples indexada.
- Auditoria:
  - armazenar IDs Stripe relevantes (`customer`, `subscription`, `price`, `event_id` quando necessário).

---

## 8. Arquitetura e Impacto Técnico

## Backend (Netlify Functions + Turso)
- Novo: `api/netlify/functions/billing.js`
  - criar checkout session;
  - criar portal session;
  - retornar status de assinatura.
- Novo: `api/netlify/functions/stripe-webhook.js`
  - validar assinatura;
  - processar eventos e atualizar banco.
- Alterar: `api/netlify/functions/auth.js`
  - incluir retorno de subscription status.
- Alterar: `api/netlify/functions/snippets.js`
  - aplicar gate de recurso pago.

## Frontend extensão
- Alterar: `extension/popup.js`
  - consumir status de assinatura;
  - abrir checkout/portal;
  - tratar erro `subscription_required`.
- Alterar: `extension/popup.html`
  - adicionar área de assinatura/paywall.
- Alterar: `extension/translations.js`
  - novas strings de billing.
- Alterar: `extension/background.js`
  - evitar sync pago em background sem entitlement.

## Mobile web app
- Alterar: `web/mobile-app.js`
  - exibir estado de assinatura e CTA de checkout/portal;
  - bloquear sync pago se necessário.

## Configuração
- Alterar: `package.json`
  - adicionar dependência `stripe`.
- Variáveis de ambiente:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `STRIPE_PRICE_ID_MONTHLY_USD_1`
  - `APP_BASE_URL`

---

## 9. Modelo de Dados (proposto)

Tabela `users` (incremental):
- `stripe_customer_id` TEXT NULL
- `subscription_status` TEXT NOT NULL DEFAULT 'inactive'
- `subscription_id` TEXT NULL
- `subscription_price_id` TEXT NULL
- `subscription_current_period_end` TEXT NULL
- `updated_at` TEXT

Status esperados:
- `active`
- `trialing` (não usado no MVP, mas permitido para compatibilidade)
- `past_due`
- `canceled`
- `inactive`

Regra de entitlement no MVP:
- permitido somente se `subscription_status = 'active'`.

---

## 10. Fluxos

### Fluxo A - Assinatura
1. Usuário autenticado clica em “Assinar”.
2. Front chama `billing.js` para criar Checkout Session.
3. Front redireciona para URL do Checkout.
4. Pagamento aprovado.
5. Stripe envia webhook.
6. Backend atualiza `subscription_status = active`.
7. Usuário volta ao app e recursos pagos são liberados.

### Fluxo B - Cancelamento
1. Usuário clica “Gerenciar assinatura”.
2. Front chama `billing.js` para criar Portal Session.
3. Stripe Portal controla cancelamento/cartão.
4. Webhook atualiza status no banco.
5. App reflete novo status.

---

## 11. UX e Copy (MVP)

- Headline paywall:
  - `Desbloqueie o Pro por US$ 1/mês`
- Subheadline:
  - `Sincronização completa e recursos avançados sem complicação.`
- Botões:
  - `Assinar por US$ 1/mês`
  - `Gerenciar assinatura`

Observação: atualizar copy da Chrome Web Store para declarar recursos pagos de forma transparente.

---

## 12. Métricas de Sucesso

- `checkout_started` / usuários autenticados.
- `checkout_completed` / `checkout_started`.
- Conversão para pagante em 7 dias.
- Churn mensal de pagantes.
- Taxa de erro de webhook.
- Taxa de bloqueio indevido (false positive de entitlement).

---

## 13. Critérios de Aceite

- Usuário autenticado consegue assinar por US$ 1/mês sem trial.
- Após pagamento confirmado por webhook, usuário ganha acesso a recursos pagos.
- Usuário sem assinatura ativa recebe bloqueio consistente no backend.
- Usuário consegue abrir Customer Portal e cancelar/gerenciar assinatura.
- Extensão e mobile exibem estado correto de assinatura.
- Webhook rejeita payload inválido por assinatura incorreta.

---

## 14. Riscos e Mitigações

- Risco: UI considerar assinatura ativa antes do webhook.
  - Mitigação: backend como fonte de verdade.
- Risco: falha de entrega de webhook.
  - Mitigação: idempotência por evento + reprocessamento manual.
- Risco: bloqueio de usuários legados por gate abrupto.
  - Mitigação: feature flag gradual e janela de transição.

---

## 15. Plano de Entrega (MVP)

1. Infra Stripe + variáveis + preço.
2. Criar funções `billing` e `stripe-webhook`.
3. Persistir status de assinatura no banco.
4. Aplicar gate backend no endpoint de sync.
5. Exibir paywall/CTA na extensão.
6. Exibir status/CTA no mobile.
7. Atualizar docs (README + Chrome Web Store copy).
8. Testes ponta a ponta em ambiente de teste Stripe.

