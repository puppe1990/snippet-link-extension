# Snippet Pocket Landing (Next.js)

Landing page multilíngue de conversão para o Snippet Pocket.

## Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- i18n por rota (`/pt-br`, `/en`, `/fr`)

## Rotas
- `/{locale}`
- `/{locale}/privacy`
- `/{locale}/terms`
- `/` redireciona para locale padrão

## Ambiente
Copie `.env.example` e ajuste conforme necessário.

Variáveis principais:
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_DEFAULT_LOCALE`
- `NEXT_PUBLIC_SITE_URL`

## Desenvolvimento
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run start
```

## Deploy Netlify (site separado)
- Base directory: `apps/snippet-pocket-landing`
- Build command: `npm run build`
- Publish directory: `out`
