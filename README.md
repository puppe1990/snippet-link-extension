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

1. **Abra o arquivo `create_icons.html` no seu navegador**
2. **Os ícones serão baixados automaticamente** (icon16.png, icon32.png, icon48.png, icon128.png)
3. **Mova os arquivos baixados** para a pasta `icons/` do projeto

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

6. **Selecione a pasta** do projeto `snippet-link-extension`

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
├── manifest.json          # Configuração da extensão
├── popup.html             # Interface do usuário
├── popup.js              # Lógica da aplicação
├── styles.css            # Estilos e design
├── icons/                # Ícones da extensão
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── create_icons.html     # Gerador de ícones
└── README.md            # Este arquivo
```

## 🔒 Permissões

A extensão solicita apenas as permissões mínimas necessárias:
- **storage**: Para salvar seus snippets localmente
- **tabs**: Para abrir links em novas abas

## 💾 Armazenamento

- **Local Storage**: Todos os dados são armazenados localmente no seu navegador
- **Privacidade**: Nenhum dado é enviado para servidores externos
- **Backup**: Os dados ficam salvos até você desinstalar a extensão

## 🐛 Solução de Problemas

### Extensão não carrega
1. Verifique se todos os arquivos estão presentes
2. Confirme se os ícones PNG foram gerados corretamente
3. Recarregue a extensão em `chrome://extensions/`

### Ícones não aparecem
1. Abra `create_icons.html` no navegador
2. Baixe os ícones gerados automaticamente
3. Mova-os para a pasta `icons/`
4. Recarregue a extensão

### Snippets não salvam
1. Verifique as permissões da extensão
2. Tente recarregar a página da extensão
3. Verifique o console do Chrome para erros

## 🚀 Funcionalidades Futuras

- [ ] Sincronização na nuvem
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

**Desenvolvido com ❤️ para facilitar o gerenciamento de links e textos no Chrome!**
