# DeepTask — API

Backend REST em NestJS com PostgreSQL via Prisma.

---

## Stack

| Tecnologia          | Versão   | Papel                                 |
|---------------------|----------|---------------------------------------|
| NestJS              | ^11.0    | Framework principal                   |
| TypeScript          | ^5.7     | Linguagem                             |
| Prisma              | ^7.8     | ORM e migrations                      |
| PostgreSQL          | 14+      | Banco de dados                        |
| Passport.js         | ^0.7     | Estratégias de autenticação           |
| @nestjs/jwt         | ^11.0    | Geração e verificação de JWT          |
| google-auth-library | ^10.7    | Verificação de tokens Google OAuth2   |
| bcrypt              | ^6.0     | Hash de senhas                        |
| class-validator     | ^0.15    | Validação de DTOs                     |
| Helmet              | ^8.2     | Headers de segurança HTTP             |
| @nestjs/throttler   | ^6.5     | Rate limiting                         |

---

## Estrutura de pastas

```
api/
├── src/
│   ├── main.ts                  # Bootstrap, global pipes, CORS, Helmet
│   ├── app.module.ts            # Módulo raiz
│   ├── auth/                    # Autenticação (JWT + Google)
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── decorators/
│   │   │   └── current-user.decorator.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── jwt-refresh.guard.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   └── jwt-refresh.strategy.ts
│   │   └── dtos/
│   │       ├── signin.dto.ts
│   │       ├── signup.dto.ts
│   │       └── google-signin.dto.ts
│   ├── tasks/                   # Tarefas
│   │   ├── tasks.controller.ts
│   │   ├── tasks.service.ts
│   │   ├── tasks.module.ts
│   │   └── dtos/
│   │       ├── create-task.dto.ts
│   │       ├── update-task.dto.ts
│   │       ├── query-tasks.dto.ts
│   │       └── reorder-tasks.dto.ts
│   ├── statuses/                # Colunas do Kanban
│   ├── notifications/           # Notificações
│   ├── report/                  # Relatórios
│   ├── me/                      # Preferências do usuário autenticado
│   ├── users/                   # Serviço interno de usuários
│   └── prisma/                  # Módulo do cliente Prisma
├── prisma/
│   ├── schema.prisma            # Modelos do banco
│   └── migrations/              # Histórico de migrations SQL
├── prisma.config.ts
├── .env                         # Variáveis locais (não versionar)
├── .env.example
└── nest-cli.json
```

---

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/taskmanager?schema=public"
JWT_SECRET="segredo_access_token_minimo_32_chars"
JWT_REFRESH_SECRET="segredo_refresh_token_minimo_32_chars"
GOOGLE_CLIENT_ID="seu_google_client_id.apps.googleusercontent.com"
```

---

## Comandos

```bash
# Instalar dependências
npm install

# Desenvolvimento (hot-reload)
npm run start:dev

# Desenvolvimento com debug
npm run start:debug

# Build de produção
npm run build

# Iniciar em produção
npm run start:prod

# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov

# Lint com correção automática
npm run lint

# Formatar código
npm run format
```

---

## Banco de dados

### Migrations

```bash
# Criar e aplicar nova migration (desenvolvimento)
npx prisma migrate dev --name nome_da_migration

# Aplicar migrations existentes (produção/CI)
npx prisma migrate deploy

# Sincronizar schema sem migration (apenas dev)
npx prisma db push

# Regenerar o client Prisma
npx prisma generate

# Abrir o Prisma Studio (interface visual)
npx prisma studio
```

### Schema — modelos principais

**User**
```
id, name, email (unique), passwordHash?, googleId? (unique),
avatarColor, accountType, createdAt, updatedAt
→ tem: refreshTokens, statuses, tasks, notifications, preferences
```

**UserPreferences** (1-para-1 com User)
```
userId (PK/FK), accentColor, locale,
notifyDueSoon, notifyHighPrio, notifyCompleted, notifyAchievement
```

**Status** (coluna do Kanban)
```
id, userId (FK), title, color, isDone, position, createdAt
```

**Task**
```
id, userId (FK), statusId (FK), prevStatusId? (FK),
title, description?, priority (alta|media|baixa),
dueDate?, position, createdAt, updatedAt, completedAt?
→ tem: tags[], notifications[]
```

**TaskTag** (PK composta: taskId + label)
```
taskId (FK, cascade), label
```

**Notification**
```
id, userId (FK), type, message, relatedTaskId? (FK SetNull),
isRead, createdAt
```

**RefreshToken**
```
id, tokenHash (unique), userId (FK, cascade), expiresAt, createdAt
```

---

## Autenticação

**Dois tokens JWT:**
- **Access token** — expira em 15 minutos, enviado no header `Authorization: Bearer <token>`
- **Refresh token** — expira em 7 dias, armazenado (hash SHA-256) no banco

**Fluxo:**
1. Login → recebe `accessToken` + `refreshToken`
2. Requisições autenticadas usam `accessToken`
3. Quando o `accessToken` expira, o cliente chama `POST /auth/refresh` com o `refreshToken`
4. Logout invalida todos os refresh tokens do usuário

**Google OAuth2:** recebe o `credential` (Google ID token) do frontend, verifica com `google-auth-library`, cria ou vincula a conta.

---

## Endpoints

Porta padrão: **3000**

### Auth — `/auth`

| Método | Rota            | Descrição                      | Auth |
|--------|-----------------|--------------------------------|------|
| POST   | `/auth/signup`  | Cadastro com e-mail/senha      | —    |
| POST   | `/auth/signin`  | Login com e-mail/senha         | —    |
| POST   | `/auth/google`  | Login com Google               | —    |
| GET    | `/auth/me`      | Dados do usuário autenticado   | JWT  |
| POST   | `/auth/refresh` | Renovar access token           | Refresh JWT |
| POST   | `/auth/signout` | Logout (invalida refresh tokens) | JWT |

Rate limit de auth: **5 requisições por 60 segundos**.

### Tasks — `/tasks`

| Método | Rota                  | Descrição                       | Auth |
|--------|-----------------------|---------------------------------|------|
| GET    | `/tasks`              | Listar tarefas (com filtros)    | JWT  |
| POST   | `/tasks`              | Criar tarefa                    | JWT  |
| PATCH  | `/tasks/reorder`      | Reordenar tarefas em lote       | JWT  |
| PATCH  | `/tasks/:id`          | Atualizar tarefa                | JWT  |
| POST   | `/tasks/:id/complete` | Marcar como concluída           | JWT  |
| POST   | `/tasks/:id/reopen`   | Reabrir tarefa                  | JWT  |
| DELETE | `/tasks/:id`          | Excluir tarefa                  | JWT  |

**Query params de GET /tasks:** `status`, `priority`, `q` (busca), `filter` (all|active|done)

### Statuses — `/statuses`

| Método | Rota                 | Descrição                   | Auth |
|--------|----------------------|-----------------------------|------|
| GET    | `/statuses`          | Listar status               | JWT  |
| POST   | `/statuses`          | Criar status                | JWT  |
| PATCH  | `/statuses/reorder`  | Reordenar status            | JWT  |
| PATCH  | `/statuses/:id`      | Atualizar status            | JWT  |
| DELETE | `/statuses/:id`      | Excluir status              | JWT  |

### Notifications — `/notifications`

| Método | Rota                           | Descrição               | Auth |
|--------|--------------------------------|-------------------------|------|
| GET    | `/notifications`               | Listar notificações     | JWT  |
| POST   | `/notifications/read-all`      | Marcar todas como lidas | JWT  |
| PATCH  | `/notifications/:id/read`      | Marcar uma como lida    | JWT  |

### Me — `/me`

| Método | Rota              | Descrição                    | Auth |
|--------|-------------------|------------------------------|------|
| PATCH  | `/me/preferences` | Atualizar preferências       | JWT  |

### Report — `/report`

| Método | Rota      | Descrição                             | Auth |
|--------|-----------|---------------------------------------|------|
| GET    | `/report` | KPIs + breakdown por status/prioridade/tag | JWT |

---

## Segurança

- **Helmet** — headers de segurança em todas as respostas
- **CORS** — habilitado globalmente
- **Rate limiting global** — 100 requisições por 60 segundos
- **ValidationPipe global** — `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`
- **Row-level security** — todas as queries filtram por `userId`; acesso cruzado retorna 404

---

## Configuração TypeScript / ESLint

- TypeScript em modo strict (`strictNullChecks`)
- Prettier com `singleQuote: true` e `trailingComma: all`
- ESLint 9 com typescript-eslint e prettier integrado
- Build gera para `dist/`, source maps habilitados

---

## Dependências completas

### Runtime

| Pacote                   | Versão   |
|--------------------------|----------|
| @nestjs/common           | ^11.0.1  |
| @nestjs/config           | ^4.0.4   |
| @nestjs/core             | ^11.0.1  |
| @nestjs/jwt              | ^11.0.2  |
| @nestjs/passport         | ^11.0.5  |
| @nestjs/platform-express | ^11.0.1  |
| @nestjs/throttler        | ^6.5.0   |
| @prisma/adapter-pg       | ^7.8.0   |
| @prisma/client           | ^7.8.0   |
| bcrypt                   | ^6.0.0   |
| class-transformer        | ^0.5.1   |
| class-validator          | ^0.15.1  |
| dotenv                   | ^17.4.2  |
| google-auth-library      | ^10.7.0  |
| helmet                   | ^8.2.0   |
| passport                 | ^0.7.0   |
| passport-jwt             | ^4.0.1   |
| pg                       | ^8.21.0  |
| reflect-metadata         | ^0.2.2   |
| rxjs                     | ^7.8.1   |

### Dev

| Pacote              | Versão   |
|---------------------|----------|
| @nestjs/cli         | ^11.0.0  |
| @nestjs/testing     | ^11.0.1  |
| @types/bcrypt       | ^6.0.0   |
| @types/node         | ^24.0.0  |
| @types/passport-jwt | ^4.0.1   |
| eslint              | ^9.18.0  |
| jest                | ^30.0.0  |
| prettier            | ^3.4.2   |
| prisma              | ^7.8.0   |
| ts-jest             | ^29.2.5  |
| ts-node             | ^10.9.2  |
| typescript          | ^5.7.3   |
