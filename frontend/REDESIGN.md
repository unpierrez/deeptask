# Redesign — Dark Minimal

Guia de implementação do novo layout do DeepTask, inspirado no [init.Habits](https://apps.apple.com/br/app/habit-tracker-init-habits/id6761077074?l=en-GB): monoespaçado, silencioso, escuro.

- **Referência visual (Claude Design):** https://claude.ai/artifact/LgSseJSmr8YMg2X6ctToYK
- **Escopo:** somente layout e estilo. Nenhuma rota, composable, evento, prop, chamada à API ou chave de i18n muda.

---

## 1. Princípios

1. **Um fundo só.** Todo o app usa `--bg`. A sidebar deixa de ser um bloco preto separado e passa a ser só uma linha à direita.
2. **Linhas, não sombras.** Superfícies separadas por bordas de 1 px. Sem `box-shadow`, gradiente ou ícone dentro de círculo colorido.
3. **Mono para a estrutura.** JetBrains Mono em títulos, labels, números, datas, contadores, tags e botões. Geist no conteúdo (título e descrição de tarefa, textos de apoio).
4. **Um destaque só.** `--accent` marca progresso, check, foco, badge e item ativo. Cores de status e prioridade continuam vindo dos dados.
5. **Progresso em blocos.** Barras viram grids de células (1 célula = 1 tarefa). Os dados são os mesmos de hoje.
6. **Ritmo calmo.** Grid de 8 px, raio padrão 8 px (10 px em cards e 12 px em modais), alvos de toque ≥ 38 px no desktop e ≥ 44 px no mobile.

---

## 2. Design tokens

Criar `src/styles/tokens.css` (ou substituir o conteúdo de `src/style.css`):

```css
:root {
  /* superfícies */
  --bg: #0a0a0b;
  --surface: #111113;      /* cards, inputs, modais */
  --raised: #17171a;       /* item ativo, hover */
  --line: #232327;         /* bordas padrão */
  --line-soft: #1c1c1f;    /* divisores de lista */
  --line-strong: #2e2e33;  /* bordas de botão secundário e modal */
  --backdrop: rgba(5, 5, 6, 0.8);

  /* texto */
  --text: #ececee;
  --text-2: #a1a1aa;       /* labels, ícones */
  --muted: #84848d;        /* secundário (contraste ≥ 4.5:1 sobre --bg) */
  --faint: #3a3a40;        /* decorativo apenas: alça de drag, borda do checkbox */

  /* destaque e semânticas */
  --accent: #3ddc84;
  --on-accent: #0a0a0b;
  --danger: #ff7a59;

  /* prioridades */
  --prio-alta: #ff7a59;
  --prio-media: #e5c15c;
  --prio-baixa: #7aa2f7;

  /* botão primário (claro sobre escuro) */
  --primary-bg: #ececee;
  --primary-fg: #0a0a0b;

  /* tipografia */
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
  --font-sans: 'Geist', system-ui, -apple-system, sans-serif;

  /* forma */
  --radius: 8px;
  --radius-card: 10px;
  --radius-modal: 12px;
}
```

Temas alternativos (opcional, depois): basta trocar `--accent` → `#7aa2f7` (Tokyo Night), `#bd93f9` (Dracula), `#e5c15c` (amarelo).

### Mapeamento cor antiga → token

| Hoje | Uso | Novo |
|---|---|---|
| `#141414` / `#0f0f0f` | sidebar, botão primário, texto forte | `--bg` (sidebar) · `--primary-bg` (botão) · `--text` (texto) |
| `#f5f6f8` | fundo do dashboard | `--bg` |
| `#ffffff` | header, cards, auth | `--bg` (header) · `--surface` (cards) |
| `#ebebec` / `#e6e8eb` / `#ecedf0` | bordas | `--line` / `--line-soft` |
| `#9aa3af` / `#9aa0a8` / `#7a828d` | texto secundário | `--muted` |
| `#3a414c` / `#374151` | labels | `--text-2` |
| `#c4c9d0` | placeholder | `--muted` |
| `#f4f5f6` / `#f7f8f9` | fundo de input, hover | `--surface` / `--raised` |
| `#dd5a4b` | prioridade alta, excluir | `--prio-alta` / `--danger` |
| `#d99a2b` | prioridade média | `--prio-media` |
| `#6b9bd1` | prioridade baixa | `--prio-baixa` |
| `rgba(255,255,255,.x)` na sidebar | textos da sidebar | `--text` / `--muted` / `--line` |

> A paleta de status em `useStatusModal.ts` (`COLOR_PALETTE`) **não muda**: são dados do usuário e funcionam bem no escuro.

---

## 3. Base global

### `index.html`
Trocar a fonte:

```html
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

O `<body class="body--dark">` já existe; manter.

### `src/main.ts`
- Importar o `tokens.css`.
- Ativar o dark do Quasar e atualizar o brand:

```ts
.use(Quasar, {
  plugins: { Notify, Loading },
  config: {
    dark: true,
    brand: {
      primary: '#ececee',
      secondary: '#a1a1aa',
      accent: '#3ddc84',
      dark: '#111113',
      'dark-page': '#0a0a0b',
      positive: '#3ddc84',
      negative: '#ff7a59',
      info: '#7aa2f7',
      warning: '#e5c15c',
    },
  },
})
```

### `src/quasar-variables.scss`
Espelhar os mesmos valores (`$dark: #111113; $dark-page: #0a0a0b; ...`).

### `src/style.css`
```css
html, body, #app {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  color-scheme: dark;
}
```

### Overrides globais do Quasar (menus, diálogos, notify)
Os `q-menu` e o `q-dialog` hoje herdam o tema claro. Adicionar em `style.css`:

```css
.q-menu {
  background: var(--surface);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-card);
  box-shadow: none;
  color: var(--text);
}
.q-dialog__backdrop { background: var(--backdrop); }
.q-separator { background: var(--line); }
.q-notification {
  background: var(--primary-bg) !important;
  color: var(--primary-fg) !important;
  font-family: var(--font-mono);
  border-radius: var(--radius);
  box-shadow: none;
}
```

Em `useAppSidebar.ts`, o `$q.notify({ color: 'dark' })` pode continuar; o estilo vem do override.

---

## 4. Mudanças por arquivo

Ordem sugerida: base → componentes `ui/` → layout → tarefas → modais → relatório → auth.

### 4.1 Componentes UI (`src/components/ui/`)

**DtInput.vue**
- Fundo `--surface`, borda 1 px `--line`, raio `--radius`, altura 44 px (era 50).
- Foco: `border-color: var(--accent)`.
- Texto `--text`, placeholder e ícone `--muted`.
- Erro: borda e mensagem em `--danger`.

**DtButton.vue**
- Altura 44 px (era 52), raio `--radius`.
- `background: var(--primary-bg); color: var(--primary-fg)`.
- Fonte `--font-mono`, 14 px, peso 600. Hover: `opacity: .9`. Sem `translateY`.

**DtAlert.vue**
- Fundo `--surface`, borda 1 px na cor semântica, texto na cor semântica (`--danger`, `--accent`, `--prio-baixa`). Sem os fundos pastel.

**AuthLayout.vue**
- Fundo `--bg`. **Remover o card** (borda, sombra, padding 40 px): o formulário fica solto, `max-width: 360px`.
- Pílula PT/EN: borda `--line`, raio 8, ativo `background: var(--line); color: var(--text)`, fonte mono.
- Marca: quadrado 28 px com borda `--line-strong` + `deeptask` em mono e `_` em `--accent`.

**DtLogo.vue / brand**
- A marca está duplicada em `AuthLayout`, `LoginView` e `RegisterView`. Aproveitar para centralizar num componente (ex.: `DtBrand.vue`) usado nos três lugares. Só apresentação: o `hideBrand` pode continuar funcionando igual.

### 4.2 Layout

**DashboardView.vue**
- `.dashboard-layout { background: var(--bg) }`.
- Backdrop mobile: `var(--backdrop)`.

**AppSidebar.vue** (largura 232 px)
- `background: var(--bg); border-right: 1px solid var(--line-soft)`.
- Wordmark: mono 15 px/600, `deeptask` + `_` em `--accent` (logo SVG atual pode ficar ao lado).
- Label `MENU`: mono 11 px, `--muted`, `letter-spacing: .08em`.
- Nav item: altura 40, raio 8, `--muted`; hover `--raised`; ativo `background: var(--raised); color: var(--text)` + quadradinho 6×6 `--accent` à direita.
- **Card de progresso:** borda `--line` (sem fundo), raio 10. Título mono 12 `--muted`; % mono 20/600.
  - Trocar `.sidebar__progress-bar` por **grid de células**: `display: grid; grid-template-columns: repeat(N, 1fr); gap: 3px`, células com altura 14 px e raio 3; preenchidas `--accent`, vazias `--line-soft`. `N = total` (limitar a, p.ex., 20 e escalar acima disso). Os valores `doneCount`/`total`/`donePct` já existem no composable.
- Footer: borda superior `--line-soft`; avatar 32 px mantendo `user.avatarColor`; iniciais em mono.
- Pílula PT/EN igual à do auth.

**AppHeader.vue**
- `background: var(--bg); border-bottom: 1px solid var(--line-soft)`; altura 72; padding 16/32.
- Título mono 18/600; subtítulo mono 12 `--muted`. Remover `text-transform: capitalize` se a data vier em minúsculas (mock usa minúsculas).
- Busca: 240 px, 38 px, fundo `--surface`, borda `--line`, raio 8.
- Sino: botão quadrado 38 px com borda `--line`; badge com fundo `--accent` e texto `--on-accent` (mono 10.5/700).
- Nova tarefa: `--primary-bg`/`--primary-fg`, mono 13/600, raio 8.

### 4.3 Tarefas

**TasksView.vue**
- Toolbar: filtros como **segmented control** (container com borda `--line`, raio 8, padding 3; botão ativo `background: var(--line)`); contagens mono `--muted`.
- Toggle lista/kanban: mesmo segmented com ícones.
- “Recolher tudo”: botão com borda `--line`, mono 12.5.
- “+ Novo status”: borda `1px dashed var(--line-strong)`, mono, `--muted`.
- Conteúdo com `max-width: 1120px` na lista.

**TaskGroup.vue**
- Header: altura 44, sem fundo, `border-bottom: 1px solid var(--line-soft)`.
- Cor do status: quadrado 8×8 raio 2 (era bolinha).
- Título mono 13.5/600; contagem mono 12 `--muted`.
- Ações (editar/adicionar): botões 32 px transparentes, `--muted`.
- “Adicionar tarefa”: linha mono 12.5 `--muted`, alinhada com o texto das tarefas.
- `.drop-indicator`: 2 px `--accent`.

**TaskRow.vue**
- Sem card: linha com `border-bottom: 1px solid var(--line-soft)`, padding 14/4.
- Alça de drag `--faint`; checkbox 18 px, raio 5, borda 1.5 `--faint`; marcado = fundo `--accent` com check `--on-accent`.
- Título Geist 14.5/500; descrição 13 `--muted`.
- **Tags como texto:** `#trabalho` em mono 11.5 `--muted` (sem chip).
- Prioridade: ponto 6 px + rótulo mono 12 na cor da prioridade (larguras fixas para alinhar colunas).
- Prazo: ícone calendário + data mono 12 `--muted`.
- Concluída: título `--muted` + `text-decoration: line-through` opcional.

**KanbanBoard / KanbanColumn.vue**
- Coluna 288 px, sem fundo; header igual ao do TaskGroup.
- Estado vazio e “Adicionar tarefa” em mono `--muted`.
- Coluna “Novo status”: 240×120, borda tracejada `--line-strong`.
- Drag over: borda tracejada `--accent` no corpo da coluna.

**KanbanCard.vue**
- `background: var(--surface); border: 1px solid var(--line); border-radius: 10px; padding: 14px`. Sem sombra.
- Topo: prioridade como **ponto + texto** mono 11.5 (remover o badge com fundo).
- Footer com `border-top: 1px solid var(--line-soft)`: checkbox, prazo, alça.
- Dragging: `opacity: .4`.

### 4.4 Modais e menus

**TaskModal.vue** (520 px)
- Container `--surface`, borda `--line-strong`, raio 12. Header 60 px com título mono 15/600 e `border-bottom: var(--line)`.
- Labels em **mono minúsculo** 12 `--text-2`.
- Inputs: fundo `--bg`, borda `--line`, foco `--accent`.
- Prioridade: segmented de 3 colunas; ativo `background: var(--line)` e texto na cor da prioridade.
- Status: chips com borda `--line`; ativo com borda na cor do status e fundo `color-mix(in srgb, <cor> 12%, var(--surface))`.
- Footer: Excluir (texto `--danger`) · Cancelar (borda `--line-strong`) · Salvar/Criar (`--primary-bg`).
- Mobile (bottom sheet): mesmo visual, raio só no topo.

**StatusModal.vue** (400 px)
- Mesma estrutura. Swatches em grid de 8, quadrados com raio 8; selecionado = anel `0 0 0 2px var(--surface), 0 0 0 4px var(--text)` (sem ícone de check).
- Toggle “Status de conclusão” dentro de um box com borda `--line`; ligado = trilho `--accent` e knob `--bg`.

**NotificationDropdown.vue**
- Container `--surface`, borda `--line-strong`, raio 12, sem sombra.
- Header 52 px; “Marcar todas” em mono `--accent`.
- Itens com divisor `--line-soft`; ícone por tipo pode virar símbolo mono (`!`, `▲`, `✓`, `★`) ou manter o `q-icon` atual com as novas cores.
- Não lida: quadradinho 6×6 `--accent`; lida: mensagem `--text-2`.

**Menu de opções (sidebar)**
- Item ativo/hover `--raised`; “Sair” em `--danger`; separador `--line`.

### 4.5 Relatório

**ReportView.vue**
- **KPIs numa faixa única:** container `--surface` com borda `--line`, raio 12, células separadas por `border-right: var(--line)`. Remover os ícones coloridos.
  - Número mono 30/600; label mono 11.5 `--muted`.
  - Cor só em “concluídas” (`--accent`) e “prioridade alta” (`--prio-alta`).
  - Opcional: primeira célula com anel de progresso usando `report.kpis.donePct` (campo já existe na API, hoje não exibido). SVG: `r=36`, circunferência ≈ 226, `stroke-dasharray: (pct/100*226) 226`.
- **Por status / por prioridade:** trocar `.chart-bar__track` por grid de células (10 colunas, altura 16, gap 3); preencher `round(count / max * 10)` células com a cor, restantes `--line-soft`.
- **Categorias:** chips com borda `--line-strong`, raio 8, `#tag` mono + contagem `--muted`.
- `q-spinner`: cor `--muted`.
- `priorityConfig` (cores) está duplicado em `ReportView.vue`, `useTaskRow.ts` e `useKanbanCard.ts`: centralizar num `src/lib/priority.ts` lendo os tokens. É só refatoração de apresentação; os rótulos continuam vindo do i18n.

### 4.6 Auth

**LoginView.vue**
- Ordem: marca → título “Bem-vindo de volta” (mono 26/600) + subtítulo `--muted` → Google → divisor “ou com e-mail” → campos → lembrar de mim → Entrar → link de cadastro.
  - O título e o subtítulo já existem no i18n (`login.title`/`login.subtitle`) e hoje não aparecem na tela.
- Botão Google: altura 44, fundo `--surface`, borda `--line-strong`, raio 8.
- Divisor: linhas `--line`, texto mono 12 `--muted`.
- Checkbox: `accent-color: var(--accent)` ou o custom atual com fundo `--accent`.
- “Esqueceu a senha?” mono 12 `--muted`; “Criar conta” `--text` sublinhado.

**RegisterView.vue**
- Mesmo padrão. Medidor de força: 4 barras com fundo `--line` (cores de força mantidas, mas ajustar para `--danger`/`--prio-media`/`--prio-baixa`/`--accent`).
- Estado de sucesso: ícone em quadrado 56 px com borda `--line-strong` (sem círculo cinza), botão `--primary-bg`.

**ForgotPasswordView.vue**
- Mesmo padrão; “Voltar” mono 13 `--muted`.

---

## 5. Responsivo (manter comportamentos)

- ≤ 768 px: sidebar vira drawer (`transform`), com fundo `--bg` e borda direita `--line`.
- Header mobile: hambúrguer 44 px, título mono 16, sino e “+” quadrados 40 px.
- Filtros mobile: segmented ocupando a largura toda.
- Kanban continua forçando a lista no mobile.
- TaskModal continua como bottom sheet.

---

## 6. Checklist de funcionalidades (não pode quebrar)

- [ ] Login com e-mail/senha, Google Sign-In (inclui o container oculto `#g-signin-hidden`), lembrar de mim
- [ ] Cadastro com validação e medidor de força; recuperar senha; estados de sucesso
- [ ] Guards e redirecionamentos de rota
- [ ] Troca de idioma PT/EN no auth e na sidebar
- [ ] Filtros Todas/Em aberto/Concluídas com contagem; busca por título e tag
- [ ] Alternância lista/kanban e “Salvar visualização padrão”
- [ ] Recolher/expandir tudo e por grupo
- [ ] Drag and drop entre grupos e colunas, com indicador de drop
- [ ] Concluir/reabrir, editar e excluir pelo menu e pelo checkbox
- [ ] Criar/editar/excluir status, cor e “status de conclusão”
- [ ] Notificações: badge, marcar uma, marcar todas, vazio
- [ ] Relatório: loading, KPIs, por status, por prioridade, por categoria, vazio de categorias
- [ ] Drawer mobile, lista forçada no mobile, modal como bottom sheet
- [ ] Logout

---

## 7. Acessibilidade

- `--muted #84848d` sobre `--bg #0a0a0b` ≈ 5.3:1 (ok para texto). `--faint` só para decoração.
- Manter `:focus-visible` em todos os botões: `outline: 2px solid var(--accent); outline-offset: 2px`.
- Botões só com ícone mantêm `aria-label` (sino, editar status, menu de ações, fechar).
- Prioridades diferem também em luminosidade e sempre vêm com texto.

---

## 8. Plano de execução

1. Tokens + fontes + Quasar dark + overrides globais → o app inteiro já fica escuro.
2. `DtInput`, `DtButton`, `DtAlert`, `AuthLayout` → auth pronto.
3. `DashboardView`, `AppSidebar`, `AppHeader` → moldura pronta.
4. `TasksView`, `TaskGroup`, `TaskRow` → lista.
5. `KanbanColumn`, `KanbanCard`.
6. `TaskModal`, `StatusModal`, `NotificationDropdown`, menu de opções.
7. `ReportView`.
8. Varredura final: `grep -rn "#[0-9a-fA-F]\{6\}" src` → só devem sobrar a paleta de status e os SVGs do Google.
9. `npm run lint && npm run build` e passada manual pelo checklist da seção 6.
