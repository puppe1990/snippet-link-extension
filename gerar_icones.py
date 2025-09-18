#!/usr/bin/env python3
"""
Script para criar ícones PNG para a extensão Chrome
"""
import os
from PIL import Image, ImageDraw

def create_icon(size):
    # Criar imagem com fundo transparente
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Cores
    bg_color = (102, 126, 234)  # #667eea
    doc_color = (255, 255, 255, 230)  # Branco semi-transparente
    text_color = (102, 126, 234)  # #667eea
    link_color = (76, 175, 80)  # #4CAF50
    
    # Desenhar círculo de fundo
    margin = 2
    draw.ellipse([margin, margin, size-margin, size-margin], fill=bg_color)
    
    # Desenhar documento
    doc_width = int(size * 0.35)
    doc_height = int(size * 0.47)
    doc_x = int(size * 0.27)
    doc_y = int(size * 0.2)
    
    draw.rectangle([doc_x, doc_y, doc_x + doc_width, doc_y + doc_height], 
                   fill=doc_color)
    
    # Desenhar linhas de texto
    line_height = int(size * 0.08)
    line_y = doc_y + int(size * 0.05)
    
    for i in range(4):
        y = line_y + i * line_height
        line_width = int(size * 0.2) if i < 2 else int(size * 0.15)
        draw.rectangle([doc_x + int(size * 0.05), y, 
                      doc_x + int(size * 0.05) + line_width, y + int(line_height * 0.6)], 
                     fill=text_color)
    
    # Desenhar ícone de link
    link_center_x = int(size * 0.59)
    link_center_y = int(size * 0.59)
    link_radius = int(size * 0.06)
    
    draw.ellipse([link_center_x - link_radius, link_center_y - link_radius,
                  link_center_x + link_radius, link_center_y + link_radius], 
                 fill=link_color)
    
    # Desenhar cruz no ícone de link
    cross_size = int(size * 0.02)
    draw.line([link_center_x - cross_size, link_center_y, 
               link_center_x + cross_size, link_center_y], 
              fill=(255, 255, 255), width=2)
    draw.line([link_center_x, link_center_y - cross_size, 
               link_center_x, link_center_y + cross_size], 
              fill=(255, 255, 255), width=2)
    
    return img

def main():
    # Criar diretório de ícones se não existir
    os.makedirs('icons', exist_ok=True)
    
    # Criar ícones em diferentes tamanhos
    sizes = [16, 32, 48, 128]
    
    for size in sizes:
        icon = create_icon(size)
        filename = f'icons/icon{size}.png'
        icon.save(filename, 'PNG')
        print(f'✅ Ícone {size}x{size} criado: {filename}')

if __name__ == '__main__':
    main()
