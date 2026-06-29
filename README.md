# DeepTask

Monorepo de gerenciamento de tarefas estilo Kanban. Composto por uma API REST em NestJS e uma SPA em Vue 3 + Quasar.

```
deeptask-workspace/
├── api/          # Backend NestJS
└── frontend/     # Frontend Vue 3 + Quasar
```

---

## Stack geral

| Camada      | Tecnologia                              |
|-------------|----------------------------------------|
| Backend     | NestJS 11, TypeScript 5.7              |
| Banco       | PostgreSQL + Prisma 7.8                |
| Frontend    | Vue 3.5, Quasar 2.19, Vite 8          |
| Auth        | JWT (access + refresh) + Google OAuth2 |
| Validação   | class-validator (API), Zod (frontend)  |

---

## Pré-requisitos

- Node.js 20+
- PostgreSQL 14+ rodando em `localhost:5432`
- npm

---

## Setup rápido

### 1. Banco de dados

Crie o banco `taskmanager` no PostgreSQL:

```sql
CREATE DATABASE taskmanager;
```

### 2. API

```bash
cd api
cp .env.example .env   # preencha as variáveis
npm install
npx prisma migrate deploy
npm run start:dev
```

Rodando em: `http://localhost:3000`

### 3. Frontend

```bash
cd frontend
cp .env.example .env   # preencha as variáveis
npm install
npm run dev
```

Rodando em: `http://localhost:5173`

---

## Variáveis de ambiente

### API (`api/.env`)

| Variável              | Descrição                            | Exemplo                                              |
|-----------------------|--------------------------------------|------------------------------------------------------|
| `DATABASE_URL`        | String de conexão PostgreSQL         | `postgresql://postgres:postgres@localhost:5432/taskmanager?schema=public` |
| `JWT_SECRET`          | Segredo do access token (32+ chars)  | `meu_segredo_jwt_muito_seguro_aqui`                  |
| `JWT_REFRESH_SECRET`  | Segredo do refresh token (32+ chars) | `meu_segredo_refresh_muito_seguro_aqui`              |
| `GOOGLE_CLIENT_ID`    | Client ID do Google OAuth2           | `619995750443-xxx.apps.googleusercontent.com`        |

### Frontend (`frontend/.env`)

| Variável               | Descrição                        | Exemplo                              |
|------------------------|----------------------------------|--------------------------------------|
| `VITE_API_URL`         | URL base da API                  | `http://localhost:3000`              |
| `VITE_GOOGLE_CLIENT_ID`| Client ID do Google OAuth2       | `619995750443-xxx.apps.googleusercontent.com` |

---

## Funcionalidades

- Autenticação com e-mail/senha e Google OAuth2
- Quadro Kanban com drag-and-drop
- Status (colunas) personalizáveis por usuário
- Tarefas com título, descrição, prioridade, tags, prazo e posição
- Notificações in-app
- Relatórios por status, prioridade e tags
- Preferências de usuário (idioma, cores, notificações)
- Suporte a PT-BR e EN

---

## Documentação detalhada

- [API — backend](./api/README.md)
- [Frontend](./frontend/README.md)
