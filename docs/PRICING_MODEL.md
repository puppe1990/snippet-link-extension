# Modelo de Pricing - Snippet Link Manager

## Objetivo
Definir uma estrutura simples de monetizacao para validar conversao sem bloquear adocao inicial.

Periodo sugerido para teste inicial: 30 dias.

## Estrategia
- Plano `Free` para reduzir friccao de entrada.
- Plano `Pro` com valor claro para usuarios que usam multi-dispositivo.
- Upgrade orientado por uso real (quando o usuario percebe valor).

## Planos

| Recurso | Free | Pro |
| --- | --- | --- |
| Salvar links e textos localmente | Sim | Sim |
| Busca, tags, favoritos e arquivar | Sim | Sim |
| Import/Export manual | Sim | Sim |
| Sincronizacao em nuvem | Limitada (manual, 1 dispositivo principal) | Completa (multi-dispositivo, sync em background) |
| Resumo com IA | Nao | Sim |
| Prioridade de suporte | Nao | Sim |
| Preco | US$ 0 | US$ 4.99/mes ou US$ 39/ano |

## Regra de Upgrade
- Exibir convite para Pro quando:
- usuario ativar sincronizacao;
- usuario usar recurso de resumo IA;
- usuario ultrapassar limite definido para uso cloud no Free.

Mensagem sugerida:
`Desbloqueie sincronizacao completa e IA para acessar seus snippets em qualquer dispositivo.`

## Hipoteses para validacao
- H1: `US$ 4.99/mes` converte melhor que `US$ 5.99/mes` sem afetar retencao D7.
- H2: Oferta anual (`US$ 39/ano`) aumenta receita por usuario sem reduzir conversao inicial.
- H3: Mostrar paywall apenas apos valor percebido converte mais que paywall no onboarding.

## KPIs de Monetizacao
- Conversao para Pro em 14 dias.
- ARPPU (Average Revenue Per Paying User).
- Taxa de cancelamento mensal (churn de pagantes).
- Receita mensal recorrente (MRR).

## Experimentos recomendados
1. Teste A/B de preco mensal: `US$ 4.99` vs `US$ 5.99`.
2. Teste de copy de upgrade:
   - Variante A: foco em multi-dispositivo.
   - Variante B: foco em produtividade e economia de tempo.
3. Teste de timing:
   - apos 3 snippets salvos;
   - apos primeira sincronizacao.

## Posicionamento curto
`Seu segundo cerebro para links e snippets, com sync simples entre Chrome e celular.`
