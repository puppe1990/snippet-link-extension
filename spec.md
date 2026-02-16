# Spec - Billing Stripe MVP (US$ 1/mês, sem trial)

## 1. Objetivo
Implementar cobrança recorrente via Stripe para liberar recursos Pro no Snippet Link Manager, com plano único de assinatura mensal de US$ 1, sem período de trial, e entitlement validado no backend.

## 2. Escopo
### Em escopo (MVP)
- Checkout de assinatura (`mode=subscription`) para usuário autenticado.
- Customer Portal para autogestão de assinatura.
- Webhook Stripe para atualizar status de assinatura no banco.
- Gate backend para recursos pagos.
- Exposição de status de assinatura para extensão e mobile.
- UI de paywall/CTA na extensão e no app mobile web.

### Fora de escopo (MVP)
- Múltiplos planos.
- Cupons/descontos.
- Trial.
- Prorrata avançada.
- Reembolso automatizado.
- A/B de preço.

## 3. Regras de negócio
- Plano único: mensal, US$ 1 (`USD 100`).
- Trial proibido: não enviar `trial_period_days` nem `trial_end`.
- Entitlement MVP: acesso Pro apenas com `subscription_status = 'active'`.
- Fonte de verdade de billing: eventos webhook + estado persistido no banco.

## 4. Impacto técnico
### Backend (Netlify Functions + Turso)
- Novo: `api/netlify/functions/billing.js`
- Novo: `api/netlify/functions/stripe-webhook.js`
- Alterar: `api/netlify/functions/auth.js`
- Alterar: `api/netlify/functions/snippets.js`

### Frontend extensão
- Alterar: `extension/popup.js`
- Alterar: `extension/popup.html`
- Alterar: `extension/translations.js`
- Alterar: `extension/background.js`

### Mobile web app
- Alterar: `web/mobile-app.js`

### Configuração
- Alterar: `package.json` (dependência `stripe`).
- Variáveis:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `STRIPE_PRICE_ID_MONTHLY_USD_1`
  - `APP_BASE_URL`

## 5. Modelo de dados
Extensão na tabela `users`:
- `stripe_customer_id` TEXT NULL
- `subscription_status` TEXT NOT NULL DEFAULT 'inactive'
- `subscription_id` TEXT NULL
- `subscription_price_id` TEXT NULL
- `subscription_current_period_end` TEXT NULL
- `updated_at` TEXT

Status suportados:
- `active`
- `trialing` (compatibilidade, não usado no MVP)
- `past_due`
- `canceled`
- `inactive`

Índices recomendados:
- `users(stripe_customer_id)`
- `users(subscription_status)`
- `users(subscription_id)`

## 6. Contratos de API

### 6.1 `POST /.netlify/functions/billing` (ação: criar checkout)
Request:
```json
{
  "action": "create_checkout"
}
```
Resposta 200:
```json
{
  "url": "https://checkout.stripe.com/c/session/..."
}
```
Erros:
- `401` usuário não autenticado.
- `409` usuário já com assinatura ativa (opcional, recomendado).
- `500` erro interno.

Comportamento:
- Criar `checkout.sessions.create` com:
  - `mode: 'subscription'`
  - `line_items: [{ price: STRIPE_PRICE_ID_MONTHLY_USD_1, quantity: 1 }]`
  - sem campos de trial
  - `success_url` e `cancel_url` baseados em `APP_BASE_URL`
  - metadata com `user_id`

### 6.2 `POST /.netlify/functions/billing` (ação: criar portal)
Request:
```json
{
  "action": "create_portal"
}
```
Resposta 200:
```json
{
  "url": "https://billing.stripe.com/session/..."
}
```
Erros:
- `401` não autenticado.
- `404` usuário sem `stripe_customer_id`.
- `500` erro interno.

### 6.3 `GET /.netlify/functions/billing` (ação: status)
Resposta 200:
```json
{
  "subscription_status": "active",
  "entitled": true,
  "subscription_current_period_end": "2026-03-16T00:00:00Z"
}
```

### 6.4 `POST /.netlify/functions/stripe-webhook`
- Deve validar `Stripe-Signature` com `STRIPE_WEBHOOK_SECRET`.
- Deve ser idempotente por `event.id`.
- Retornar `400` para assinatura inválida.
- Retornar `200` rápido após persistir atualização essencial.

Eventos mínimos processados:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_failed` (recomendado)

Mapeamento sugerido de status:
- subscription ativa -> `active`
- cancelada -> `canceled`
- inadimplência/pagamento falho -> `past_due`

### 6.5 `GET /.netlify/functions/auth`
Adicionar no payload:
```json
{
  "subscription_status": "inactive",
  "entitled": false
}
```

### 6.6 Gate de recurso pago (`snippets.js`)
- Em endpoints Pro/sync cloud, validar entitlement no backend.
- Se não elegível, retornar:
```json
{
  "error": "subscription_required"
}
```
com status HTTP `402` (preferencial) ou `403`.

## 7. Fluxos
### Fluxo A - Assinatura
1. Usuário autenticado clica em `Assinar por US$ 1/mês`.
2. Front chama `billing` (`create_checkout`).
3. Front redireciona para Checkout Stripe.
4. Pagamento aprovado.
5. Stripe envia webhook.
6. Backend atualiza usuário para `subscription_status=active`.
7. App/extensão passam a liberar recursos Pro.

### Fluxo B - Cancelamento/gestão
1. Usuário clica em `Gerenciar assinatura`.
2. Front chama `billing` (`create_portal`).
3. Stripe Portal executa alterações.
4. Webhook atualiza status no banco.
5. UI reflete novo estado.

## 8. UX e copy (MVP)
- Headline: `Desbloqueie o Pro por US$ 1/mês`
- Subheadline: `Sincronização completa e recursos avançados sem complicação.`
- CTA primário: `Assinar por US$ 1/mês`
- CTA secundário: `Gerenciar assinatura`

Também atualizar texto da Chrome Web Store para transparência de recurso pago.

## 9. Observabilidade e auditoria
Registrar, no mínimo:
- IDs Stripe: `customer`, `subscription`, `price`, `event_id`.
- Eventos de produto:
  - `checkout_started`
  - `checkout_completed`
  - `entitlement_denied`
  - `portal_opened`

Métricas alvo:
- Conversão checkout (`completed/started`).
- Conversão para pagante em 7 dias.
- Churn mensal.
- Taxa de falha de webhook.
- Taxa de bloqueio indevido.

## 10. Segurança
- Nunca expor `STRIPE_SECRET_KEY` no client.
- Validar assinatura do webhook obrigatoriamente.
- Restringir endpoints de billing para usuários autenticados.
- Garantir idempotência para evitar escrita duplicada por reentrega.

## 11. Plano de testes
### Unitários
- Gate de entitlement (`active` libera; demais bloqueiam).
- Parser/mapeamento de eventos webhook para status interno.
- Falhas de assinatura webhook retornam `400`.

### Integração (Stripe test mode)
- Checkout cria sessão válida sem trial.
- `checkout.session.completed` atualiza usuário para `active`.
- `customer.subscription.deleted` muda para `canceled`.
- `invoice.payment_failed` muda para `past_due`.
- Portal abre para usuário com customer válido.

### E2E
- Usuário sem assinatura tenta sync pago e recebe `subscription_required`.
- Usuário assina e passa a usar sync cloud.
- Usuário cancela no portal e perde entitlement após webhook.

## 12. Critérios de aceite
- Usuário autenticado assina por US$ 1/mês sem trial.
- Entitlement só é liberado após confirmação via webhook.
- Recursos pagos bloqueiam de forma consistente quando não ativo.
- Customer Portal abre e permite gestão/cancelamento.
- Extensão e mobile exibem estado de assinatura corretamente.
- Webhook rejeita payload inválido por assinatura incorreta.

## 13. Rollout
1. Provisionar produto/preço Stripe e variáveis de ambiente.
2. Deploy de `billing` e `stripe-webhook` com logs.
3. Migrar esquema `users` com novos campos.
4. Ativar gate no backend com feature flag gradual.
5. Publicar UI de paywall em extensão e mobile.
6. Atualizar docs (`README` e copy da Chrome Web Store).
7. Executar bateria de testes em Stripe test mode.

## 14. Riscos e mitigação
- Estado desatualizado na UI antes do webhook:
  - Mitigação: backend como única fonte de verdade.
- Falha/perda de webhook:
  - Mitigação: idempotência + rotina de reconciliação manual.
- Bloqueio de usuários legados:
  - Mitigação: rollout com feature flag e janela de transição.
