# 🔧 Solução para o Erro dos Ícones

## Problema Atual
```
Error: Could not load icon 'icons/icon32.png' specified in 'action'.
Could not load manifest.
```

## Solução Rápida

### Passo 1: Abrir o Gerador de Ícones
1. **Abra o arquivo `create_icons_simple.html` no seu navegador**
2. **Os ícones serão baixados automaticamente** em alguns segundos
3. **Mova os arquivos baixados** para a pasta `icons/` do projeto

### Passo 2: Verificar Estrutura
Após baixar os ícones, você deve ter:
```
snippet-link-extension/
├── icons/
│   ├── icon16.png   ✅
│   ├── icon32.png   ✅ (este estava faltando!)
│   ├── icon48.png   ✅
│   └── icon128.png  ✅
├── manifest.json
├── popup.html
├── popup.js
└── styles.css
```

### Passo 3: Recarregar a Extensão
1. Vá para `chrome://extensions/`
2. Encontre "Snippet Link Manager"
3. Clique no botão de recarregar (🔄)
4. O erro deve desaparecer

## Alternativa: Criar Ícones Manuais

Se o gerador não funcionar, você pode criar ícones simples:

1. **Crie a pasta `icons/`** se não existir
2. **Use qualquer editor de imagem** para criar 4 arquivos PNG:
   - `icon16.png` (16x16 pixels)
   - `icon32.png` (32x32 pixels) 
   - `icon48.png` (48x48 pixels)
   - `icon128.png` (128x128 pixels)
3. **Desenhe um ícone simples** (pode ser um quadrado colorido)
4. **Salve na pasta `icons/`**

## Verificação Final

Após resolver:
1. ✅ Todos os 4 arquivos PNG existem na pasta `icons/`
2. ✅ A extensão carrega sem erros
3. ✅ O ícone aparece na barra de ferramentas do Chrome
4. ✅ O popup abre normalmente

## Arquivos Necessários

- `icons/icon16.png` - Ícone 16x16
- `icons/icon32.png` - Ícone 32x32 (este estava faltando!)
- `icons/icon48.png` - Ícone 48x48  
- `icons/icon128.png` - Ícone 128x128
