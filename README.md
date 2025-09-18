# Link Manager - Extensão do Chrome

Uma extensão moderna e elegante para gerenciar seus links favoritos com facilidade.

## 🚀 Funcionalidades

- ✅ **Adicionar Links**: Salve links com título personalizado
- ✅ **Editar Links**: Modifique títulos e URLs existentes
- ✅ **Excluir Links**: Remova links desnecessários
- ✅ **Copiar Links**: Copie URLs para a área de transferência com um clique
- ✅ **Ordenação**: Ordene por título, data ou URL
- ✅ **Design Moderno**: Interface limpa e responsiva com Tailwind CSS
- ✅ **Armazenamento Local**: Seus links ficam salvos localmente
- ✅ **Abrir Links**: Abra links diretamente em novas abas

## 🎨 Design

- Interface moderna com gradientes e animações suaves
- Design responsivo que se adapta a diferentes tamanhos
- Ícones intuitivos para cada ação
- Notificações visuais para feedback do usuário
- Tema claro e profissional

## 📦 Instalação

### Método 1: Carregamento Manual (Desenvolvimento)

1. **Baixe ou clone este repositório**
   ```bash
   git clone <url-do-repositorio>
   cd snippet-link-extension
   ```

2. **Abra o Chrome e vá para Extensões**
   - Digite `chrome://extensions/` na barra de endereços
   - Ou vá em Menu → Mais ferramentas → Extensões

3. **Ative o Modo Desenvolvedor**
   - Clique no botão "Modo do desenvolvedor" no canto superior direito

4. **Carregue a extensão**
   - Clique em "Carregar sem compactação"
   - Selecione a pasta do projeto (`snippet-link-extension`)
   - A extensão aparecerá na lista

5. **Adicione ao Chrome**
   - Clique no ícone de quebra-cabeça na barra de ferramentas
   - Clique no pin ao lado da extensão "Link Manager"

### Método 2: Instalação via Chrome Web Store (Futuro)

*Esta extensão ainda não está disponível na Chrome Web Store. Use o método manual para instalação.*

## 🎯 Como Usar

1. **Adicionar um Link**
   - Clique no ícone da extensão na barra de ferramentas
   - Digite o título e a URL do link
   - Clique em "Adicionar Link"

2. **Gerenciar Links**
   - **Abrir**: Clique no ícone de link externo (azul)
   - **Copiar**: Clique no ícone de cópia (verde)
   - **Editar**: Clique no ícone de lápis (amarelo)
   - **Excluir**: Clique no ícone de lixeira (vermelho)

3. **Ordenar Links**
   - Use o menu suspenso "Ordenar por" para escolher:
     - **Título**: Ordem alfabética
     - **Data**: Mais recentes primeiro
     - **URL**: Ordem alfabética da URL

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura da interface
- **CSS3 + Tailwind CSS**: Estilização moderna e responsiva
- **JavaScript ES6+**: Lógica da aplicação
- **Chrome Extensions API**: Integração com o navegador
- **Chrome Storage API**: Persistência de dados

## 📁 Estrutura do Projeto

```
snippet-link-extension/
├── manifest.json          # Configuração da extensão
├── popup.html            # Interface principal
├── popup.js              # Lógica da aplicação
├── styles.css            # Estilos customizados
├── icons/                # Ícones da extensão
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # Este arquivo
```

## 🔧 Desenvolvimento

### Pré-requisitos
- Google Chrome (versão 88+)
- Conhecimento básico de HTML, CSS e JavaScript

### Estrutura do Código

- **`LinkManager`**: Classe principal que gerencia toda a funcionalidade
- **CRUD Operations**: Métodos para criar, ler, atualizar e deletar links
- **Storage**: Integração com Chrome Storage API para persistência
- **UI Management**: Renderização dinâmica e gerenciamento de eventos

### Personalização

Você pode personalizar a extensão modificando:

- **Cores**: Edite as classes Tailwind no `popup.html`
- **Ícones**: Substitua os SVGs por seus próprios ícones
- **Funcionalidades**: Adicione novos recursos no `popup.js`

## 🐛 Solução de Problemas

### A extensão não aparece
- Verifique se o "Modo do desenvolvedor" está ativado
- Recarregue a extensão clicando no ícone de atualização
- Verifique se não há erros no console (F12)

### Links não são salvos
- Verifique se a extensão tem permissões de armazenamento
- Limpe o cache do Chrome se necessário

### Interface não carrega
- Verifique se o Tailwind CSS está carregando corretamente
- Verifique a conexão com a internet (Tailwind é carregado via CDN)

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature
3. Fazer commit das mudanças
4. Fazer push para a branch
5. Abrir um Pull Request

## 📞 Suporte

Se você encontrar algum problema ou tiver sugestões, por favor:

- Abra uma issue no GitHub
- Descreva o problema detalhadamente
- Inclua screenshots se necessário

---

**Desenvolvido com ❤️ para facilitar o gerenciamento de links no Chrome**
