# AI SDK — Chat com inteligência artificial: Buscador de informações no GitHub

## Objetivo do projeto

Este projeto demonstra como construir um chat com inteligência artificial usando Next.js e o AI SDK. Além de conversar, o assistente pode consultar perfis públicos do GitHub e buscar o conteúdo de URLs por meio de ferramentas executadas no servidor.

As respostas aparecem aos poucos, conforme são geradas — comportamento chamado de **streaming** — e são exibidas com formatação Markdown, como títulos, listas e tabelas. Na configuração atual, o chat utiliza o modelo `gpt-4o` da OpenAI.

## Chatbot

![Chat em funcionamento, com uma resposta da IA e um cartão de perfil do GitHub](/docs/portfolio-cover.png)


## Tecnologias utilizadas

| Tecnologia | Papel no projeto |
| --- | --- |
| [Next.js 16](https://nextjs.org/docs) | Organiza as páginas e a rota de API que recebe as mensagens do chat. |
| [React 19](https://react.dev/learn) | Constrói a interface e atualiza as mensagens durante a conversa. |
| [TypeScript](https://www.typescriptlang.org/docs/) | Adiciona tipos ao código para ajudar a identificar erros durante o desenvolvimento. |
| [Tailwind CSS 4](https://tailwindcss.com/docs) | Define cores, espaçamentos e layout da interface. |
| [AI SDK](https://ai-sdk.dev/docs/introduction) | Integra o modelo de IA, as respostas em streaming e a execução de ferramentas. |
| OpenAI e API do GitHub | Fornecem, respectivamente, a geração das respostas e os dados públicos dos perfis. |

## Como baixar e rodar

### 1. Prepare o ambiente

Você vai precisar de:

- **Node.js 22 ou superior**, conforme exigido pelas dependências registradas no `package-lock.json`.
- **npm**, instalado junto com o Node.js.
- **Git**, caso escolha baixar o projeto pelo terminal.
- Uma chave de API da OpenAI com acesso ao modelo configurado.

### 2. Baixe o projeto

Substitua `URL_DO_REPOSITORIO` pelo endereço Git deste projeto:

```bash
git clone URL_DO_REPOSITORIO ai-sdk
cd ai-sdk
```

Você também pode baixar o repositório como ZIP, extrair os arquivos e abrir um terminal na pasta que contém o `package.json`.

### 3. Instale as dependências

```bash
npm ci
```

Esse comando instala as versões registradas no `package-lock.json`.

### 4. Configure a chave da API

Crie um arquivo chamado `.env.local` na raiz do projeto, ao lado do `package.json`, e preencha:

```dotenv
OPENAI_API_KEY=sua_chave_da_openai
```

Se o arquivo já existir, adicione ou atualize essa variável preservando as demais configurações. O `.env.local` já está incluído no `.gitignore`; mantenha sua chave fora do README e do código versionado.

**OpenRouter é opcional:** o projeto contém uma configuração alternativa em `src/ai/open-router.ts`, que usa `OPENROUTER_API_KEY`. Ela não está ativa no chat atual. Para utilizá-la, é necessário trocar o provedor e o modelo na rota `src/app/api/ai/route.ts`; apenas adicionar a variável não altera o provedor.

A consulta de perfis do GitHub funciona sem token na implementação atual.

### 5. Inicie o servidor

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador. Se alterar o `.env.local` com o servidor aberto, reinicie-o para carregar a nova configuração.

### 6. Experimente o chat

Digite uma mensagem e envie com **Ctrl + Enter** no Windows/Linux ou **⌘ + Enter** no macOS. Alguns exemplos:

- “Explique o que é streaming em uma resposta de IA.”
- “Mostre o perfil do usuário octocat no GitHub.”
- “Acesse https://api.github.com/repos/vercel/ai e informe a descrição do repositório.”

O modelo decide quando usar as ferramentas conforme o pedido. Durante uma consulta, a interface exibe um indicador de carregamento. Quando a busca de um perfil termina, apresenta um cartão com avatar, nome e biografia.

As conversas ficam no estado da página e não são salvas em banco de dados; ao recarregar, o histórico é perdido.

### Comandos disponíveis

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento. |
| `npm run build` | Gera a versão de produção da aplicação. |
| `npm run start` | Inicia a versão de produção, depois de executar o build. |

## Principais bibliotecas

### Integração com IA

- **[`ai`](https://ai-sdk.dev/docs/introduction):** coordena a geração de respostas com `streamText` e permite definir ferramentas com `tool`. Na rota do chat, também converte as mensagens recebidas para o formato do modelo.
- **[`@ai-sdk/react`](https://ai-sdk.dev/docs/ai-sdk-ui/chatbot):** fornece o hook `useChat`, usado para manter as mensagens, enviar pedidos e acompanhar o estado da resposta na interface.
- **[`@ai-sdk/openai`](https://ai-sdk.dev/providers/ai-sdk-providers/openai):** conecta o AI SDK aos modelos da OpenAI. É o provedor utilizado atualmente pela rota do chat.
- **[`@openrouter/ai-sdk-provider`](https://github.com/OpenRouterTeam/ai-sdk-provider):** permite acessar modelos por meio do OpenRouter. Está instalado e possui uma configuração alternativa no projeto.

### Ferramentas e validação

- **[`@octokit/rest`](https://github.com/octokit/rest.js):** cliente da API REST do GitHub. A ferramenta `githubProfile` usa `users.getByUsername` para buscar os dados públicos de um usuário.
- **[`zod`](https://zod.dev/):** define e valida os dados de entrada das ferramentas, como o nome de usuário do GitHub e a URL que será consultada.

### Formatação das mensagens e interface

- **[`react-markdown`](https://github.com/remarkjs/react-markdown):** transforma o Markdown das respostas em elementos React para exibição no chat.
- **[`remark-gfm`](https://github.com/remarkjs/remark-gfm):** adiciona suporte a recursos do Markdown usado pelo GitHub, como tabelas, listas de tarefas e texto riscado.
- **[`marked`](https://marked.js.org/):** divide o texto Markdown em blocos. O componente do projeto memoriza esses blocos para reduzir renderizações de trechos que não mudaram durante o streaming.
- **[`lucide-react`](https://lucide.dev/guide/react):** fornece os ícones da interface, como usuário, assistente e envio de mensagem.
- **[`@tailwindcss/typography`](https://github.com/tailwindlabs/tailwindcss-typography):** aplica estilos de leitura ao conteúdo Markdown por meio das classes `prose`.
- **[`tailwind-scrollbar`](https://github.com/adoxography/tailwind-scrollbar):** personaliza a aparência da barra de rolagem do chat.

## Como o projeto está organizado

```text
src/
├── app/
│   ├── api/ai/route.ts        # Recebe mensagens e transmite a resposta da IA
│   ├── components/           # Chat, campo de mensagem, Markdown e cartão do GitHub
│   ├── globals.css           # Estilos globais e plugins do Tailwind CSS
│   ├── layout.tsx            # Estrutura base da página
│   └── page.tsx              # Página inicial que exibe o chat
├── ai/
│   ├── open-router.ts        # Configuração alternativa do OpenRouter
│   └── tools/
│       ├── github-profile.ts # Consulta um perfil público do GitHub
│       ├── http-fetch.ts     # Busca o conteúdo de uma URL como texto
│       └── index.ts          # Reúne as ferramentas e seus tipos
└── lib/
    └── octokit.ts            # Cliente usado para acessar a API do GitHub
```

O fluxo começa no componente `chat.tsx`, que envia as mensagens para `/api/ai`. A rota chama o modelo e disponibiliza as ferramentas. Conforme a resposta chega, a interface atualiza o texto e mostra os resultados das consultas.
