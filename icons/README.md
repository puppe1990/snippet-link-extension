# Ícones da Extensão Link Manager

## Arquivos Necessários

Para que a extensão funcione corretamente, você precisa dos seguintes arquivos de ícone:

- `icon16.png` - 16x16 pixels
- `icon48.png` - 48x48 pixels  
- `icon128.png` - 128x128 pixels

## Como Gerar os Ícones

### Opção 1: Usando Ferramentas Online

1. Acesse [convertio.co](https://convertio.co/svg-png/) ou [cloudconvert.com](https://cloudconvert.com/svg-to-png)
2. Faça upload do arquivo `icon.svg`
3. Configure as dimensões:
   - Para icon16.png: 16x16 pixels
   - Para icon48.png: 48x48 pixels
   - Para icon128.png: 128x128 pixels
4. Baixe os arquivos convertidos

### Opção 2: Usando Inkscape (Gratuito)

```bash
# Instalar Inkscape (se não tiver)
# macOS: brew install inkscape
# Ubuntu: sudo apt install inkscape
# Windows: Baixar do site oficial

# Gerar os ícones
inkscape icon.svg --export-png=icon16.png --export-width=16 --export-height=16
inkscape icon.svg --export-png=icon48.png --export-width=48 --export-height=48
inkscape icon.svg --export-png=icon128.png --export-width=128 --export-height=128
```

### Opção 3: Usando ImageMagick

```bash
# Instalar ImageMagick
# macOS: brew install imagemagick
# Ubuntu: sudo apt install imagemagick
# Windows: Baixar do site oficial

# Gerar os ícones
convert icon.svg -resize 16x16 icon16.png
convert icon.svg -resize 48x48 icon48.png
convert icon.svg -resize 128x128 icon128.png
```

### Opção 4: Usando Node.js (se tiver instalado)

```bash
# Instalar sharp
npm install -g sharp-cli

# Gerar os ícones
sharp -i icon.svg -o icon16.png --width 16 --height 16
sharp -i icon.svg -o icon48.png --width 48 --height 48
sharp -i icon.svg -o icon128.png --width 128 --height 128
```

## Verificação

Após gerar os ícones, verifique se:

1. Os arquivos estão na pasta `icons/`
2. Os nomes estão corretos (icon16.png, icon48.png, icon128.png)
3. As dimensões estão corretas
4. Os arquivos não estão corrompidos

## Design do Ícone

O ícone representa:
- **Círculo azul**: Base da extensão
- **Corrente de links**: Representa a funcionalidade de gerenciar links
- **Símbolo de + verde**: Indica a capacidade de adicionar novos links

As cores seguem o tema da extensão:
- Azul principal: #3B82F6
- Verde de destaque: #10B981
- Branco para contraste
