# DeepTask — Frontend

SPA de gerenciamento de tarefas estilo Kanban construída com Vue 3, Quasar e Vite.

---

## Stack

| Tecnologia      | Versão   | Papel                                      |
|-----------------|----------|--------------------------------------------|
| Vue 3           | ^3.5     | Framework reativo (Composition API)        |
| Quasar          | ^2.19    | UI framework (componentes + plugins)       |
| Vite            | ^8.0     | Build tool e dev server                    |
| TypeScript      | ~6.0     | Linguagem                                  |
| Vue Router      | ^4.6     | Roteamento SPA                             |
| Vue i18n        | ^11.4    | Internacionalização (PT-BR / EN)           |
| Vee-Validate    | ^4.15    | Validação de formulários                   |
| Zod             | ^4.3     | Schema de validação                        |
| Supabase JS     | ^2.104   | Client Supabase (auth auxiliar)            |
| SCSS / Sass     | ^1.99    | Pré-processador CSS                        |

---

## Estrutura de pastas

```
frontend/
├── public/
│   ├── favicon.svg              # Ícone do app
│   └── icons.svg
├── src/
│   ├── main.ts                  # Bootstrap Vue, Quasar, Router, i18n
│   ├── App.vue                  # Componente raiz
│   ├── style.css                # Estilos globais
│   ├── quasar-variables.scss    # Customização de tema Quasar
│   │
│   ├── assets/                  # Imagens e arquivos estáticos
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppHeader.vue    # Cabeçalho (busca, filtros, notificações)
│   │   │   └── AppSidebar.vue   # Menu lateral (nav, progresso, perfil)
│   │   ├── task/
│   │   │   ├── KanbanBoard.vue  # Quadro Kanban com colunas
│   │   │   ├── KanbanColumn.vue # Coluna individual com drop zone
│   │   │   ├── KanbanCard.vue   # Card de tarefa no Kanban
│   │   │   ├── TaskGroup.vue    # Grupo de tarefas na visão lista
│   │   │   ├── TaskRow.vue      # Linha de tarefa na visão lista
│   │   │   └── TaskModal.vue    # Modal de criação/edição de tarefa
│   │   ├── status/
│   │   │   └── StatusModal.vue  # Modal de criação/edição de status
│   │   ├── notifications/
│   │   │   └── NotificationDropdown.vue
│   │   └── ui/                  # Componentes base reutilizáveis
│   │       ├── DtButton/
│   │       ├── DtInput/
│   │       ├── DtCard/
│   │       ├── DtAlert/
│   │       ├── DtLogo/
│   │       └── AuthLayout/
│   │
│   ├── composables/             # Lógica reutilizável (Vue Composition API)
│   │   ├── useTasks.ts          # Estado e operações de tarefas
│   │   ├── useStatuses.ts       # Estado e operações de status
│   │   ├── useNotifications.ts  # Estado de notificações
│   │   ├── useReport.ts         # Dados de relatório
│   │   ├── useDragDrop.ts       # Drag-and-drop nativo HTML5
│   │   └── useViewPreference.ts # Preferência de visão (kanban/lista)
│   │
│   ├── lib/
│   │   ├── api.ts               # HTTP client (fetch + token refresh)
│   │   ├── auth.ts              # Estado de autenticação (localStorage)
│   │   └── supabase.ts          # Client Supabase
│   │
│   ├── i18n/
│   │   ├── index.ts
│   │   └── locales/
│   │       ├── en.ts            # Inglês
│   │       └── pt-BR.ts         # Português (Brasil)
│   │
│   ├── router/
│   │   └── index.ts             # Rotas + guards de autenticação
│   │
│   ├── types/
│   │   ├── index.ts             # Tipos principais (User, Task, Status…)
│   │   └── google.d.ts          # Tipos do Google OAuth
│   │
│   └── views/
│       ├── LoginView/
│       ├── RegisterView/
│       ├── ForgotPasswordView/
│       ├── DashboardView.vue    # Layout principal (sidebar + header)
│       ├── TasksView/           # Kanban / lista de tarefas
│       └── ReportView/          # Relatórios e KPIs
│
├── vite.config.ts
├── tsconfig.json
├── .env
└── .env.example
```

---

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

```env
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=seu_google_client_id.apps.googleusercontent.com
```

> Variáveis com prefixo `VITE_` são expostas ao código do browser em tempo de build.

---

## Comandos

```bash
# Instalar dependências
npm install

# Desenvolvimento (hot-reload em localhost:5173)
npm run dev

# Build de produção (valida tipos + build)
npm run build

# Preview do build de produção
npm run preview
```

---

## Roteamento

| Rota                  | Componente           | Auth necessária |
|-----------------------|----------------------|-----------------|
| `/login`              | LoginView            | Não             |
| `/register`           | RegisterView         | Não             |
| `/forgot-password`    | ForgotPasswordView   | Não             |
| `/dashboard/tasks`    | TasksView            | Sim             |
| `/dashboard/report`   | ReportView           | Sim             |

Usuário não autenticado em rota protegida → redireciona para `/login`.  
Usuário autenticado acessando `/login` → redireciona para `/dashboard/tasks`.

---

## Comunicação com a API

**`src/lib/api.ts`** — wrapper de `fetch` com:
- Base URL definida por `VITE_API_URL`
- Header `Authorization: Bearer <token>` automático
- Renovação automática do token em respostas 401

**Métodos disponíveis:**
```typescript
apiGet<T>(path, token?)
apiPost<T>(path, body, token?)
apiPatch<T>(path, body, token?)
apiDelete<T>(path, token?)
```

---

## Autenticação

**`src/lib/auth.ts`** — estado em `localStorage` (chave: `deepTask_auth`):

```typescript
login(email, password)         // POST /auth/signin
register(name, email, password) // POST /auth/signup
loginWithGoogle(credential)    // POST /auth/google
logout()                       // limpa localStorage
getToken()                     // retorna accessToken atual
isAuthenticated()              // boolean
refreshTokens()                // chamado automaticamente pelo api.ts
```

---

## Tipos principais

```typescript
type Priority = 'alta' | 'media' | 'baixa'
type TaskFilter = 'all' | 'active' | 'done'
type Locale = 'pt' | 'en'

interface Task {
  id: string
  statusId: string
  prevStatusId: string | null
  title: string
  description: string | null
  priority: Priority
  tags: string[]
  dueDate: string | null
  position: number
  createdAt: string
  updatedAt: string
  completedAt: string | null
}

interface Status {
  id: string
  userId: string
  title: string
  color: string
  isDone: boolean
  position: number
  createdAt: string
}

interface User {
  id: string
  name: string
  email: string
  avatarColor: string
  accountType: string
  createdAt: string
  updatedAt: string
  preferences: UserPreferences | null
}
```

---

## Quasar — configuração de tema

Cores definidas em `src/main.ts`:

| Token       | Valor     | Uso                     |
|-------------|-----------|-------------------------|
| `primary`   | `#0f0f0f` | Botões principais       |
| `secondary` | `#374151` | Elementos secundários   |
| `positive`  | `#16a34a` | Sucesso                 |
| `negative`  | `#dc2626` | Erros                   |
| `info`      | `#0284c7` | Informação              |
| `warning`   | `#f97316` | Alertas                 |

Plugins Quasar ativos: `Notify`, `Loading`

---

## Drag-and-drop

Implementado com HTML5 nativo (`draggable`, `dragstart`, `dragover`, `drop`) via `useDragDrop.ts`. Estado compartilhado em módulo (não Pinia/Vuex) para funcionar entre Kanban e Lista.

---

## Dependências completas

### Runtime

| Pacote              | Versão   |
|---------------------|----------|
| @quasar/extras      | ^1.18.0  |
| @supabase/supabase-js | ^2.104.0 |
| @vee-validate/zod   | ^4.15.1  |
| quasar              | ^2.19.3  |
| vee-validate        | ^4.15.1  |
| vue                 | ^3.5.32  |
| vue-i18n            | ^11.4.0  |
| vue-router          | ^4.6.4   |
| zod                 | ^4.3.6   |

### Dev

| Pacote              | Versão   |
|---------------------|----------|
| @quasar/vite-plugin | ^1.11.0  |
| @types/node         | ^24.12.2 |
| @vitejs/plugin-vue  | ^6.0.6   |
| @vue/tsconfig       | ^0.9.1   |
| sass                | ^1.99.0  |
| sass-embedded       | ^1.99.0  |
| typescript          | ~6.0.2   |
| vite                | ^8.0.9   |
| vue-tsc             | ^3.2.7   |
