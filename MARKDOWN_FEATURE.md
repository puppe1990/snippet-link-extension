# Funcionalidade Markdown - Snippet Link Manager

## Visão Geral

A extensão Snippet Link Manager agora suporta snippets em formato Markdown! Esta funcionalidade permite criar, editar e visualizar conteúdo formatado usando a sintaxe Markdown.

## Como Usar

### 1. Criar um Snippet Markdown

1. Clique no botão **"+ Novo"** na extensão
2. Selecione **"📄 Markdown"** no campo **Tipo**
3. Digite seu conteúdo em Markdown no campo **Conteúdo**
4. Adicione um título opcional e tags
5. Clique em **"Salvar"**

### 2. Visualizar Snippets Markdown

- Snippets do tipo Markdown são automaticamente renderizados com formatação
- Use a aba **"📄 Markdown"** para filtrar apenas snippets markdown
- O conteúdo é renderizado em tempo real com estilos apropriados

## Sintaxe Markdown Suportada

### Títulos
```markdown
# Título Principal
## Subtítulo
### Sub-subtítulo
```

### Formatação de Texto
```markdown
**texto em negrito**
*texto em itálico*
`código inline`
```

### Listas
```markdown
- Item da lista
- Outro item

1. Item numerado
2. Segundo item
```

### Citações
```markdown
> Esta é uma citação
```

### Código
```markdown
```
bloco de código
```
```

### Links
```markdown
[Texto do link](https://example.com)
```

### Tabelas
```markdown
| Coluna 1 | Coluna 2 |
|----------|----------|
| Dados 1  | Dados 2  |
```

### Linhas Horizontais
```markdown
---
```

## Recursos Técnicos

- **Biblioteca**: Utiliza [marked.js](https://marked.js.org/) para renderização
- **Estilos**: CSS customizado para uma apresentação elegante
- **Compatibilidade**: Suporte completo ao GitHub Flavored Markdown (GFM)
- **Segurança**: Renderização segura com sanitização apropriada

## Limitações

- O conteúdo markdown é limitado a 200px de altura com scroll automático
- Links dentro do markdown são renderizados mas não são clicáveis (por segurança da extensão)
- Imagens não são suportadas (limitação da extensão)

## Exemplos de Uso

### Documentação de Projeto
```markdown
# Projeto X

## Descrição
Este é um projeto importante que...

## Tarefas
- [x] Configurar ambiente
- [ ] Implementar funcionalidade A
- [ ] Testes unitários

## Links Úteis
- [Documentação](https://docs.example.com)
- [Repositório](https://github.com/user/project)
```

### Notas de Reunião
```markdown
# Reunião - 15/01/2024

## Participantes
- João Silva
- Maria Santos
- Pedro Costa

## Tópicos Discutidos
1. **Prioridades do Q1**
   - Finalizar módulo de autenticação
   - Implementar dashboard

2. **Próximos Passos**
   - Revisar código até sexta
   - Agendar próxima reunião
```

### Lista de Recursos
```markdown
# Recursos de Desenvolvimento

## Documentação
- [MDN Web Docs](https://developer.mozilla.org/)
- [Stack Overflow](https://stackoverflow.com/)

## Ferramentas
- VS Code
- Chrome DevTools
- Git

## Comandos Úteis
```bash
npm install
npm run dev
npm test
```
```

## Atualizações Futuras

Possíveis melhorias futuras:
- Editor visual de markdown
- Suporte a imagens
- Exportação para PDF
- Templates pré-definidos
- Sincronização com serviços de nuvem
