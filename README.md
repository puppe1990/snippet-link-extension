# 📝 Snippet Link Manager - Extensão Chrome

Uma extensão do Chrome moderna e intuitiva para gerenciar links e textos salvos com funcionalidades completas de CRUD (criar, ler, atualizar, deletar) e organização.

## 🚀 Funcionalidades

- ✅ **Salvar Links e Textos**: Adicione facilmente links ou snippets de texto
- ✅ **Organização por Categorias**: Filtre por tipo (Links ou Textos)
- ✅ **Sistema de Busca**: Encontre rapidamente seus snippets
- ✅ **Tags**: Organize seus snippets com tags personalizadas
- ✅ **Edição Completa**: Edite título, conteúdo e tags
- ✅ **Exclusão Segura**: Modal de confirmação para evitar exclusões acidentais
- ✅ **Ordenação Inteligente**: Ordene por data de atualização
- ✅ **Cópia Rápida**: Clique em qualquer snippet para copiar o conteúdo
- ✅ **Abertura de Links**: Botão dedicado para abrir links em nova aba
- ✅ **Interface Moderna**: Design responsivo com gradientes e animações

## 🛠️ Instalação

### Pré-requisitos

Antes de instalar a extensão, você precisa gerar os ícones PNG necessários:

1. **Abra o arquivo `scripts/create_icons.html` no seu navegador**
2. **Os ícones serão baixados automaticamente** (icon16.png, icon32.png, icon48.png, icon128.png)
3. **Mova os arquivos baixados** para a pasta `extension/icons/` do projeto

### Instalação no Chrome

1. **Clone ou baixe este repositório**
   ```bash
   git clone [URL_DO_REPOSITORIO]
   cd snippet-link-extension
   ```

2. **Gere os ícones** (conforme instruções acima)

3. **Abra o Chrome** e vá para `chrome://extensions/`

4. **Ative o "Modo do desenvolvedor"** (toggle no canto superior direito)

5. **Clique em "Carregar sem compactação"**

6. **Selecione a pasta** `extension/` deste repositório

7. **A extensão será instalada** e aparecerá na barra de ferramentas

## 📱 Como Usar

### Adicionando Snippets

1. **Clique no ícone da extensão** na barra de ferramentas
2. **Clique em "Novo"** para abrir o modal
3. **Preencha os campos**:
   - **Título**: Nome do seu snippet
   - **Tipo**: Escolha entre "Link" ou "Texto"
   - **Conteúdo**: Cole o link ou texto
   - **Tags**: Adicione tags separadas por vírgula (opcional)
4. **Clique em "Salvar"**

### Organizando Snippets

- **Filtrar por tipo**: Use as abas "Todos", "Links" ou "Textos"
- **Buscar**: Digite no campo de busca para encontrar snippets específicos
- **Ordenar**: Clique em "Ordenar" para organizar por data de atualização

### Gerenciando Snippets

- **Copiar**: Clique em qualquer snippet para copiar o conteúdo
- **Editar**: Clique no botão "Editar" (✏️) para modificar
- **Excluir**: Clique no botão "Excluir" (🗑️) e confirme
- **Abrir Link**: Para links, use o botão "Abrir" (🔗)

## 🎨 Interface

### Design Moderno
- **Gradiente**: Cores modernas (#667eea → #764ba2)
- **Animações**: Transições suaves e feedback visual
- **Responsivo**: Adapta-se a diferentes tamanhos
- **Ícones**: Emojis e símbolos intuitivos

### Organização Visual
- **Cards**: Cada snippet em um card individual
- **Cores por Tipo**: Links (azul) e Textos (roxo)
- **Tags Coloridas**: Sistema visual de categorização
- **Estados de Hover**: Feedback visual ao interagir

## 🔧 Estrutura do Projeto

```
snippet-link-extension/
├── extension/                     # Chrome extension (MV3)
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   ├── fullpage.html
│   ├── background.js
│   ├── styles.css
│   ├── translations.js
│   └── icons/
├── web/                           # App web/PWA (Pocket-style)
│   ├── mobile-app.html
│   ├── mobile-app.js
│   ├── mobile-app.css
│   ├── mobile-sw.js
│   ├── manifest.webmanifest
│   └── icons/
├── api/netlify/functions/         # API serverless (Netlify Functions)
│   ├── auth.js
│   └── snippets.js
├── scripts/                       # utilitários (ícones/testes)
├── docs/                          # documentação extra
├── netlify.toml
├── package.json
└── README.md
```

## 🔒 Permissões

A extensão solicita apenas as permissões mínimas necessárias:
- **storage**: Para salvar seus snippets localmente
- **host_permissions**: Para buscar metadados e pré-visualizações de links em serviços externos (allorigins, codetabs, noembed, YouTube, Perplexity e ChatGPT)

## 💾 Armazenamento

- **Local Storage**: Todos os snippets e configurações são armazenados localmente no seu navegador
- **Privacidade**: O conteúdo dos links pode ser enviado a serviços externos apenas para gerar pré-visualização/resumo quando essas funcionalidades são usadas
- **Backup**: Os dados ficam salvos até você desinstalar a extensão

## ☁️ Sincronização com Turso + Netlify

### 1. Criar banco no Turso

```bash
turso db create snippet-link
turso db show snippet-link
turso db tokens create snippet-link
```

### 2. Configurar API no Netlify

Este projeto inclui as funções `api/netlify/functions/snippets.js` e `api/netlify/functions/auth.js`.

Instale dependências:

```bash
npm install
```

Variáveis de ambiente no Netlify:

- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `EXTENSION_API_KEY` (fallback para clientes legados sem login)
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_ID_MONTHLY_USD_1`
- `APP_BASE_URL` (ex.: `https://seu-site.netlify.app`)

Deploy:

```bash
npm run deploy
```

### 2.1 Configurar pagamento no Stripe

1. Crie um produto no Stripe (ex.: `Snippet Pocket Pro`).
2. Crie um preço recorrente mensal de `US$ 1.00`.
3. Copie o `price_id` (`price_...`) e salve em `STRIPE_PRICE_ID_MONTHLY_USD_1`.
4. Defina no Netlify:
   - `STRIPE_SECRET_KEY=sk_live_...` (ou `sk_test_...` em sandbox)
   - `APP_BASE_URL=https://seu-site.netlify.app`
5. Crie o endpoint de webhook no Stripe:
   - URL: `https://seu-site.netlify.app/.netlify/functions/stripe-webhook`
   - Eventos:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
6. Copie o webhook signing secret (`whsec_...`) para `STRIPE_WEBHOOK_SECRET` no Netlify.

Comandos úteis com Stripe CLI (ambiente local):

```bash
# login
stripe login

# listar preços e pegar o price_...
stripe prices list --limit 10

# encaminhar webhooks para netlify dev
stripe listen --events checkout.session.completed,customer.subscription.updated,customer.subscription.deleted,invoice.payment_failed --forward-to http://localhost:8888/.netlify/functions/stripe-webhook
```

### 3. Configurar a extensão

No modal **Configurações**:

1. Ative `Sincronização em Nuvem`
2. Preencha `URL base da API` (ex.: `https://seu-site.netlify.app`)
3. Preencha `Email` e `Senha`
4. Clique em `Cadastrar` (primeiro acesso) ou `Entrar`
5. Clique em `Sincronizar agora`

Observações:

- A extensão continua funcionando offline com `chrome.storage.local`.
- A nuvem usa merge por `updatedAt` (última atualização vence).
- Exclusão é `soft delete` no banco para evitar perda acidental.
- A extensão agora sincroniza em segundo plano automaticamente a cada 15 minutos (mesmo sem abrir o popup), desde que a opção de nuvem esteja ativada.

## 📱 Mini App Mobile (estilo Pocket)

Após deploy no Netlify, você terá também o mini app em:

- `https://SEU-SITE.netlify.app/` (redireciona para o mini app)
- `https://SEU-SITE.netlify.app/mobile-app.html`

No primeiro acesso:

1. Abra `Config`
2. Preencha `API Base URL` (seu domínio Netlify)
3. Preencha `Email` e `Senha`
4. Clique em `Cadastrar` (primeiro acesso) ou `Entrar`
5. Clique em `Sincronizar`

Recursos do mini app:

- Salvar link com tags
- Buscar por título, URL e tags
- Favoritar / Arquivar / Excluir
- Abrir links em nova aba

Link rápido para pré-preencher URL compartilhada:

- `https://SEU-SITE.netlify.app/mobile-app.html?url=https://exemplo.com&title=Meu+Link`

## 📲 PWA (instalável)

O mini app foi preparado como PWA com:

- `web/manifest.webmanifest`
- `web/mobile-sw.js` (cache offline do app shell)
- ícones `web/icons/icon192.png` e `web/icons/icon512.png`

Como instalar no celular:

1. Abra `https://SEU-SITE.netlify.app/mobile-app.html` no navegador móvel
2. No Chrome Android: menu > `Adicionar à tela inicial`
3. No Safari iOS: compartilhar > `Adicionar à Tela de Início`

## 🐛 Solução de Problemas

### Extensão não carrega
1. Verifique se todos os arquivos estão presentes
2. Confirme se os ícones PNG foram gerados corretamente
3. Recarregue a extensão em `chrome://extensions/`

### Ícones não aparecem
1. Abra `scripts/create_icons.html` no navegador
2. Baixe os ícones gerados automaticamente
3. Mova-os para a pasta `extension/icons/`
4. Recarregue a extensão

### Snippets não salvam
1. Verifique as permissões da extensão
2. Tente recarregar a página da extensão
3. Verifique o console do Chrome para erros

## 🚀 Funcionalidades Futuras

- [x] Sincronização na nuvem (Turso + Netlify)
- [ ] Importar/Exportar dados
- [ ] Categorias personalizadas
- [ ] Atalhos de teclado
- [ ] Tema escuro/claro
- [ ] Estatísticas de uso

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests
- Melhorar a documentação

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

Desenvolvido para facilitar o gerenciamento de links e snippets no Chrome e no celular.
