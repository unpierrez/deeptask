# syntax=docker/dockerfile:1

# ---- base ----
FROM node:20-slim AS base
WORKDIR /app
# openssl é usado pelo engine de migrations do Prisma
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

# ---- build: instala tudo, gera o client do Prisma e compila o Nest ----
FROM base AS build
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- migrate: aplica as migrations (docker build --target migrate) ----
FROM build AS migrate
CMD ["npx", "prisma", "migrate", "deploy"]

# ---- runtime: só dependências de produção + build ----
FROM base AS runtime
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist

USER node
ENV PORT=3000
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://localhost:'+process.env.PORT+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "dist/src/main.js"]
