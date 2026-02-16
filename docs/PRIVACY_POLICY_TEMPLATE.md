# Politica de Privacidade - Template

Ultima atualizacao: 16 de fevereiro de 2026

## 1. Quem somos
Esta Politica de Privacidade descreve como o `Snippet Link Manager` coleta, usa e protege informacoes quando voce utiliza:
- a extensao Chrome `Snippet Link Manager`;
- o mini app web/PWA relacionado (quando disponivel).

Controlador: `[SEU_NOME_OU_EMPRESA]`  
Contato: `[SEU_EMAIL_DE_SUPORTE]`  
Site: `[SEU_DOMINIO]`

## 2. Dados que coletamos
### 2.1 Dados fornecidos por voce
- Conteudo salvo por voce (links, textos, snippets, tags, favoritos, arquivos).
- Dados de autenticacao, quando o recurso de nuvem estiver ativado (email e senha para login/cadastro).

### 2.2 Dados tecnicos minimos
- Informacoes necessarias para manter sessao autenticada (token de sessao).
- Metadados tecnicos basicos para funcionamento da sincronizacao (ex.: timestamps de atualizacao).

## 3. Como os dados sao armazenados
- Por padrao, os snippets sao armazenados localmente no navegador (`chrome.storage.local`).
- Se a sincronizacao em nuvem for ativada por voce, os dados sao enviados para infraestrutura configurada por `[SEU_NOME_OU_EMPRESA]` (ex.: Netlify Functions + banco Turso).

## 4. Uso de servicos de terceiros
Alguns recursos opcionais (como preview e resumo de links) podem consultar servicos externos para processar URLs e retornar metadados/resumos.

Exemplos de servicos que podem ser utilizados pela extensao:
- allorigins
- codetabs
- noembed
- YouTube
- Perplexity
- ChatGPT

Essas consultas so ocorrem quando necessarias para o recurso solicitado por voce.

## 5. Finalidade do tratamento
Utilizamos os dados para:
- permitir salvar, editar, excluir e organizar snippets;
- sincronizar snippets entre dispositivos quando ativado;
- exibir previews/resumos de links quando esse recurso estiver ativo;
- melhorar estabilidade e seguranca do servico.

Nao vendemos seus dados pessoais.

## 6. Base legal (LGPD)
Quando aplicavel, tratamos dados com base em:
- execucao de servico solicitado por voce;
- consentimento (para funcionalidades opcionais);
- legitimo interesse para seguranca e funcionamento da aplicacao.

## 7. Compartilhamento de dados
Nao compartilhamos dados para publicidade comportamental.
Podemos compartilhar apenas com provedores necessarios para operar o produto (hospedagem, banco de dados e APIs utilizadas pelas funcionalidades).

## 8. Retencao e exclusao
- Dados locais permanecem no navegador ate remocao manual por voce ou desinstalacao.
- Dados em nuvem permanecem enquanto a conta estiver ativa ou ate solicitacao de exclusao.
- Exclusoes podem usar "soft delete" para evitar perda acidental, com remocao definitiva conforme politica interna.

## 9. Seguranca
Adotamos medidas tecnicas razoaveis para proteger dados contra acesso nao autorizado, alteracao ou vazamento.
Nenhum sistema e 100% imune a riscos.

## 10. Seus direitos
Voce pode solicitar, quando aplicavel:
- confirmacao de tratamento;
- acesso, correcao e atualizacao de dados;
- exclusao de dados da conta em nuvem;
- revogacao de consentimento para recursos opcionais.

Para exercer direitos, contate: `[SEU_EMAIL_DE_SUPORTE]`.

## 11. Menores de idade
O servico nao e direcionado a menores de 13 anos. Se identificar uso indevido, contate-nos para remocao dos dados.

## 12. Alteracoes desta politica
Podemos atualizar esta politica periodicamente. A data da ultima atualizacao sera ajustada no topo deste documento.

## 13. Contato
Responsavel: `[SEU_NOME_OU_EMPRESA]`  
Email: `[SEU_EMAIL_DE_SUPORTE]`  
Endereco (opcional): `[SEU_ENDERECO_COMERCIAL]`

---

## Checklist antes de publicar
- Substituir todos os placeholders `[ ... ]`.
- Publicar em URL publica HTTPS.
- Incluir o link na Chrome Web Store.
- Garantir alinhamento com permissoes reais do `manifest.json`.
