# 🚀 Instalação Rápida - Link Manager

## ⚡ Instalação em 3 Passos

### 1️⃣ Preparar os Ícones
Antes de instalar, você precisa gerar os ícones PNG:

**Opção A - Online (Mais Fácil):**
1. Acesse: https://convertio.co/svg-png/
2. Faça upload do arquivo `icons/icon.svg`
3. Configure e baixe:
   - 16x16 pixels → salve como `icon16.png`
   - 48x48 pixels → salve como `icon48.png`
   - 128x128 pixels → salve como `icon128.png`
4. Coloque os 3 arquivos na pasta `icons/`

**Opção B - Terminal (Se tiver ImageMagick):**
```bash
cd icons
convert icon.svg -resize 16x16 icon16.png
convert icon.svg -resize 48x48 icon48.png
convert icon.svg -resize 128x128 icon128.png
```

### 2️⃣ Instalar no Chrome
1. Abra o Chrome
2. Digite: `chrome://extensions/`
3. Ative "Modo do desenvolvedor" (canto superior direito)
4. Clique "Carregar sem compactação"
5. Selecione a pasta do projeto
6. ✅ Pronto! A extensão está instalada

### 3️⃣ Usar a Extensão
1. Clique no ícone de quebra-cabeça na barra do Chrome
2. Clique no pin ao lado de "Link Manager"
3. Clique no ícone da extensão para abrir
4. Comece a adicionar seus links! 🎉

## 🎯 Primeiros Passos

1. **Adicionar um link:**
   - Digite um título (ex: "Google")
   - Digite a URL (ex: "https://google.com")
   - Clique "Adicionar Link"

2. **Gerenciar links:**
   - 🔗 **Abrir**: Clique no ícone azul
   - 📋 **Copiar**: Clique no ícone verde
   - ✏️ **Editar**: Clique no ícone amarelo
   - 🗑️ **Excluir**: Clique no ícone vermelho

3. **Ordenar:**
   - Use o menu "Ordenar por" para organizar

## ❗ Problemas Comuns

**Extensão não aparece:**
- Verifique se os ícones PNG estão na pasta `icons/`
- Recarregue a extensão (ícone de atualização)

**Interface não carrega:**
- Verifique sua conexão com internet (Tailwind CSS é carregado online)

**Links não salvam:**
- Verifique se não há erros no console (F12)

## 🎨 Personalização

Quer mudar as cores? Edite o arquivo `popup.html`:
- Procure por classes como `bg-blue-600`, `text-blue-600`
- Substitua por outras cores do Tailwind (ex: `bg-green-600`)

## 📱 Funcionalidades

✅ Adicionar links com título personalizado  
✅ Editar links existentes  
✅ Excluir links  
✅ Copiar URLs para área de transferência  
✅ Ordenar por título, data ou URL  
✅ Abrir links em novas abas  
✅ Interface moderna e responsiva  
✅ Armazenamento local (seus links ficam salvos)  

---

**🎉 Divirta-se gerenciando seus links!**
