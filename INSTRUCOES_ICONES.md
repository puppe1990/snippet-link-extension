# 🎨 Instruções para Gerar os Ícones

## Problema
A extensão não carrega porque os ícones PNG não existem ou estão corrompidos.

## Solução Rápida

### Método 1: Usar o Gerador HTML (Recomendado)

1. **Abra o arquivo `create_icons.html` no seu navegador**
2. **Os ícones serão baixados automaticamente** em alguns segundos
3. **Mova os arquivos baixados** para a pasta `icons/` do projeto:
   - `icon16.png`
   - `icon32.png` 
   - `icon48.png`
   - `icon128.png`
4. **Recarregue a extensão** no Chrome

### Método 2: Criar Manualmente

Se o método acima não funcionar, você pode criar ícones simples:

1. **Crie a pasta `icons/`** se não existir
2. **Use qualquer editor de imagem** para criar 4 arquivos PNG:
   - `icon16.png` (16x16 pixels)
   - `icon32.png` (32x32 pixels)
   - `icon48.png` (48x48 pixels)
   - `icon128.png` (128x128 pixels)
3. **Desenhe um ícone simples** (pode ser um quadrado colorido)
4. **Salve na pasta `icons/`**

### Método 3: Usar Ícones Temporários

1. **Baixe qualquer ícone PNG** da internet nos tamanhos necessários
2. **Renomeie** para `icon16.png`, `icon32.png`, `icon48.png`, `icon128.png`
3. **Coloque na pasta `icons/`**
4. **Recarregue a extensão**

## Verificação

Após criar os ícones:
1. Vá para `chrome://extensions/`
2. Encontre "Snippet Link Manager"
3. Clique no botão de recarregar (🔄)
4. O erro deve desaparecer

## Estrutura Final

```
snippet-link-extension/
├── icons/
│   ├── icon16.png   ✅
│   ├── icon32.png   ✅
│   ├── icon48.png   ✅
│   └── icon128.png  ✅
├── manifest.json
├── popup.html
├── popup.js
└── styles.css
```
