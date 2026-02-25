# Task Manager - Frontend

Interface moderna e responsiva para gerenciamento de tarefas, consumindo API Laravel.

## Tecnologias principais

- Next.js 14 / 15 (App Router)
- React 18 + TypeScript
- Tailwind CSS
- shadcn/ui (componentes UI reutilizáveis)
- Lucide React (ícones)
- Sonner (toasts/notificações)
- js-cookie (gerenciamento de token no cookie)
- Fetch API (sem bibliotecas extras como Axios)

## Estrutura principal

src/
├── app/
│   ├── dashboard/            # página principal de tarefas
│   ├── login/                # página de login
│   ├── layout.tsx            # layout raiz
│   └── page.tsx              # home ou redirect
├── components/
│   ├── task-card.tsx         # card de tarefa individual
│   ├── task-form-dialog.tsx  # modal de criar/editar tarefa
│   ├── delete-confirm-dialog.tsx
│   ├── task-pagination.tsx
│   ├── task-filters.tsx
│   ├── stats-cards.tsx
│   └── ui/                   # componentes shadcn (Button, Dialog, Select, etc.)
├── lib/
│   ├── api/
│   │   └── tasks.ts          # funções fetch: fetchAllTasks, createTask, updateTask, deleteTask, logout
│   └── types.ts              # interfaces: Task, TaskStatus, TaskPriority, CreateTaskPayload, etc.
└── styles/                   # globals.css, tailwind.config



## Como rodar o projeto

### Pré-requisitos

- Node.js 22.14.0
- npm / pnpm / yarn

### Passos

```bash
# 1. Clone o repositório
git clone <url-do-seu-repo-frontend>
cd <pasta-do-projeto-frontend>

# 2. Instale as dependências
npm install
# ou pnpm install / yarn install

# 3. Crie um arquivo .env.local na raiz do projeto
.env.local

# 4. Configure a URL da API
# Abra .env.local e ajuste:
NEXT_PUBLIC_API_URL=http://localhost/api

# 5. Rode em desenvolvimento
npm run dev
# ou pnpm dev / yarn dev

A aplicação estará disponível em:
http://localhost:3000

OBS: Rode o Back antes de tentar acessar o front

Login de teste

Email:teste@teste.com
Senha: 12345678

## Fluxo principal

Login → salva token no cookie authToken
Requisições protegidas → envia Authorization: Bearer {token}
CRUD de tarefas → lista paginada, filtros (status/prioridade/busca), criar/editar/excluir
Logout → chama /logout, remove cookie, redireciona para /
Formulário → modal com React Hook Form + Zod (se implementado) ou states simples

## Comandos úteis

# Build para produção
npm run build

# Iniciar em modo produção
npm run start

# Lint e formatação
npm run lint
npm run format

# Limpar cache (se necessário)
npm run clean