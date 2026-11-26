# 💸 MoneyTrack

Aplicação **fullstack em Next.js** para controle de gastos pessoais: registre receitas e despesas,
organize por categorias e acompanhe saldo, gráficos e histórico mês a mês.

Projeto da avaliação da 3ª unidade de **Desenvolvimento Web II**.

---

## ✨ Funcionalidades

- **Cadastro e login** com e-mail e senha (NextAuth.js + JWT), com logout e login automático após o cadastro
- **Dashboard** do mês: saldo, receitas, despesas, gráfico dos últimos 6 meses, gastos por categoria e últimas transações
- **Transações (CRUD completo)**: criar, listar, ver detalhes, editar e excluir receitas/despesas
- **Filtros** por mês, tipo, categoria e busca por texto
- **Categorias (CRUD completo)** com cor personalizada; 12 categorias padrão criadas no cadastro
- **Página de detalhes** de cada transação e de cada categoria (rotas dinâmicas)
- **Tema claro/escuro**, layout **responsivo** (menu lateral no desktop, gaveta + botão flutuante no celular)
- Feedback imediato: toasts, spinners, esqueletos de carregamento e exclusão otimista

## 🧰 Tecnologias

| Camada | Tecnologia |
| --- | --- |
| Framework | **Next.js 16** (App Router, Turbopack, Server Components, Server Actions, Route Handlers) |
| Linguagem | **TypeScript** (modo `strict`) |
| Banco de dados | **MongoDB Atlas** + **Mongoose** |
| Autenticação | **NextAuth.js v4** (Credentials Provider, sessão JWT) + **bcryptjs** |
| Dados no cliente | **TanStack Query (React Query) v5** |
| Estado de UI | **Zustand** |
| Validação | **Zod** (mesmos schemas no servidor e nos tipos) |
| UI | **Tailwind CSS v4** + **shadcn/ui** (Radix UI) + **lucide-react** |
| Gráficos | **Recharts** |
| Notificações / tema | **sonner** / **next-themes** |

---

## 🚀 Como executar localmente

### Pré-requisitos

- **Node.js 20.9+** (testado com Node 24)
- Uma conta gratuita no **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)**

### 1. Instalar as dependências

```bash
npm install
```

### 2. Configurar as variáveis de ambiente

Copie o arquivo de exemplo e preencha os valores:

```bash
cp .env.example .env.local
```

| Variável | Descrição |
| --- | --- |
| `MONGODB_URI` | String de conexão do Atlas (*Database → Connect → Drivers*). Ex.: `mongodb+srv://usuario:senha@cluster.xxxxx.mongodb.net/moneytrack` |
| `NEXTAUTH_SECRET` | Chave aleatória que assina o JWT. Gere com `npx auth secret` ou `openssl rand -base64 32` |
| `NEXTAUTH_URL` | URL da aplicação. Local: `http://localhost:3000` |

> No Atlas, em **Network Access**, libere o seu IP (ou `0.0.0.0/0` para testes/Vercel).

### 3. Rodar em modo desenvolvimento

```bash
npm run dev
```

Acesse **http://localhost:3000**, crie uma conta e comece a lançar suas transações.

### Outros scripts

```bash
npm run build   # build de produção
npm run start   # executa o build de produção
npm run lint    # ESLint
```

---

## ✅ Como cada critério da avaliação foi atendido

### 1. Arquitetura Fullstack e Integração de Dados

- **Singleton do MongoDB** — [`src/lib/db.ts`](src/lib/db.ts): a conexão e a *promise* em andamento ficam em `global.mongooseCache`, então o Hot Reload e as funções serverless reaproveitam **uma única conexão** por processo. Os models usam `models.X || model(...)` para não serem recompilados.
- **CRUD funcional** — Transações via **API Routes** (`GET/POST /api/transactions`, `GET/PUT/DELETE /api/transactions/[id]`) e Categorias via **Server Actions** (`src/actions/category.actions.ts`). A lógica de banco fica na camada de serviço (`src/services`), e **toda consulta filtra pelo `userId` da sessão**.
- **Gerenciamento assíncrono e cache** — duas estratégias, cada uma onde faz mais sentido:
  - **React Query** na listagem de transações ([`src/hooks/use-transactions.ts`](src/hooks/use-transactions.ts)): `useQuery` com cache por filtro, `keepPreviousData`, `useMutation` com `invalidateQueries` e **exclusão otimista** com rollback em caso de erro.
  - **`revalidatePath`** nas Server Actions de categorias e nas API Routes, que mantém os Server Components (dashboard, categorias, detalhes) atualizados.
  - **`React.cache`** para deduplicar leituras (`getTransaction`, `getCategory`, sessão) entre `generateMetadata` e a página.
  - Nenhum dado é buscado com `useEffect` + `useState`.

### 2. Segurança e Controle de Acesso

- **NextAuth.js** — [`src/lib/auth.ts`](src/lib/auth.ts): Credentials Provider, `session.strategy = "jwt"`, callbacks `jwt`/`session` que adicionam o `id` do usuário, página de login customizada e logout com `signOut()` (menu do usuário).
- **Proteção de rotas em camadas**:
  1. **Proxy** ([`src/proxy.ts`](src/proxy.ts), o antigo *middleware* do Next 16): sem JWT válido → redireciona para `/login?callbackUrl=...`; logado em `/login` → vai para `/dashboard`.
  2. **Server Components**: o layout `src/app/(app)/layout.tsx` e as páginas chamam `requireUser()`.
  3. **API Routes**: o wrapper `withAuth` ([`src/lib/api-handler.ts`](src/lib/api-handler.ts)) responde **401** sem sessão.
  4. **Server Actions**: `requireUserId()` antes de qualquer escrita.
  5. **Autorização por dono**: recursos de outro usuário retornam 404.
- **Senhas com bcrypt** — [`src/actions/auth.actions.ts`](src/actions/auth.actions.ts): `bcrypt.hash(senha, 12)`; o campo `password` tem `select: false` no schema e nunca sai do servidor.

### 3. Estrutura e Estado da Aplicação

- **App Router com layouts aninhados e rotas dinâmicas**: grupos `(auth)` e `(app)` com layouts próprios; rotas dinâmicas `transacoes/[id]` e `categorias/[id]` e a rota *catch-all* `api/auth/[...nextauth]`.
- **Clean Architecture e tipagem**: pastas separadas por responsabilidade (veja abaixo), tipos de domínio em `src/types`, DTOs (`services/mappers.ts`) convertendo documentos do Mongoose em objetos serializáveis, tipos inferidos dos schemas Zod e *module augmentation* do NextAuth (`types/next-auth.d.ts`).
- **Zustand para estado de UI** ([`src/store`](src/store)): modal global de transação, filtros da listagem (persistem ao navegar entre páginas) e menu mobile. Usa seletores e `useShallow` para evitar re-renderizações.
- **`loading.tsx` e `error.tsx`**: esqueletos específicos para dashboard, transações, detalhe e categorias; *error boundaries* na raiz e na área logada; `not-found.tsx` global e para as rotas dinâmicas.

### 4. Componentização e Estilização Moderna

- **shadcn/ui** (estratégia copy-paste) em `src/components/ui` sobre **Tailwind CSS v4**, com tema próprio (verde-esmeralda) e modo escuro.
- **Responsividade e usabilidade**: grid adaptável, menu em gaveta (*Sheet*) e botão flutuante no celular, toasts de sucesso/erro, botões com spinner, validação campo a campo, diálogos de confirmação, estados vazios e foco/ARIA acessíveis. As cores do gráfico foram validadas para daltonismo.

### 5. Otimizações Nativas e Performance

- **`next/image`**: logo e ilustração importadas estaticamente (dimensões conhecidas, `placeholder="blur"`, `sizes`, `priority` e conversão automática para AVIF/WebP).
- **`next/link`** em toda a navegação, com prefetch; a troca de mês do dashboard usa só `<Link>`, sem JavaScript no cliente.
- **`next/font`** (Geist) servida localmente e **`app/icon.png`** como favicon.
- **Server Components por padrão**: páginas, cards de resumo, gastos por categoria e listas são renderizados no servidor. `"use client"` fica restrito às **folhas interativas**: formulários, botões, filtros, gráfico (Recharts) e menus.

### 6. Deploy

O deploy na Vercel ainda não foi feito. Quando for fazer:

1. Suba o projeto para o GitHub.
2. Na Vercel: **Add New → Project**, importe o repositório.
3. Em **Settings → Environment Variables** cadastre `MONGODB_URI`, `NEXTAUTH_SECRET` e `NEXTAUTH_URL` (com a URL `https://...vercel.app`).
4. No Atlas, libere o acesso de rede para a Vercel (`0.0.0.0/0`).

---

## 🗂️ Estrutura de pastas

```
src/
├── actions/            # Server Actions (cadastro, categorias)
├── app/
│   ├── (auth)/         # Grupo público: layout próprio + /login e /cadastro
│   ├── (app)/          # Grupo privado: layout com menu + loading/error
│   │   ├── dashboard/
│   │   ├── transacoes/
│   │   │   └── [id]/   # Rota dinâmica: detalhe da transação
│   │   └── categorias/
│   │       └── [id]/   # Rota dinâmica: detalhe da categoria
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   ├── transactions/ (+ [id])
│   │   └── categories/
│   ├── layout.tsx      # Root layout (fontes, providers)
│   ├── page.tsx        # Landing page
│   ├── loading.tsx · error.tsx · not-found.tsx · icon.png
├── assets/             # Imagens importadas pelo <Image>
├── components/
│   ├── ui/             # Componentes shadcn/ui
│   ├── auth/ · categories/ · dashboard/ · layout/ · shared/ · transactions/
│   └── providers.tsx   # React Query, tema, toasts
├── hooks/              # Hooks do React Query
├── lib/                # db (singleton), auth, sessão, validações, formatação, erros, api-client
├── models/             # Schemas Mongoose (User, Category, Transaction)
├── services/           # Regras de negócio e acesso ao banco
├── store/              # Stores Zustand (estado de UI)
├── types/              # Tipos TypeScript do domínio
└── proxy.ts            # Proteção de rotas (antigo middleware)
```

## 🔌 API

Todas as rotas exigem sessão (401 sem login) e só acessam dados do usuário logado.

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/api/transactions?month=YYYY-MM&type=&categoryId=` | Lista transações com filtros |
| `POST` | `/api/transactions` | Cria transação |
| `GET` | `/api/transactions/:id` | Detalha uma transação |
| `PUT` | `/api/transactions/:id` | Atualiza uma transação |
| `DELETE` | `/api/transactions/:id` | Exclui uma transação |
| `GET` | `/api/categories?type=` | Lista categorias |

Categorias são criadas, editadas e excluídas por **Server Actions** (`src/actions/category.actions.ts`).
