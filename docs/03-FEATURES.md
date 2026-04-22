# 03 — Features do EVP Web

> Este documento define **o que implementar e em que ordem**. Leia depois do `02-DESIGN-SYSTEM.md`. Cada fase produz algo rodando em `npm run dev` antes de avançar para a próxima.

---

## Fases de implementação

| Fase | O que entrega | Critério de conclusão |
|---|---|---|
| **F1** | Scaffold + Design System | `npm run dev` sobe, rotas existem, CSS variables ativas |
| **F2** | Mock data + tipos | `npm run mock:seed` gera JSONs, tipos passam no typecheck |
| **F3** | Layout (Header + Sidebar) | Navegação entre `/tarefas` e `/scats` funciona |
| **F4** | Tela de Tarefas — Lista | Tabela com 14 colunas, sort, pagination, column visibility |
| **F5** | Tela de Tarefas — Kanban | Board com 5 colunas, drag-and-drop move status |
| **F6** | Modal de Filtros | 15+ filtros aplicados a Lista E Kanban |
| **F7** | Drawer de Detalhe de Tarefa | Abre ao clicar numa tarefa, mostra todos os campos |
| **F8** | Tela de SCATs | Lista de solicitações com navegação para detalhe |
| **F9** | Tela de Detalhe da SCAT | Mostra info da SCAT + tarefas vinculadas |
| **F10** | Polish | Skeletons, toasts, empty states, erros, responsivo |

---

## F1 — Scaffold do projeto

### O que criar

```bash
cd frontend
npx create-next-app@latest . --typescript --app --no-tailwind --no-src-dir --import-alias "@/*"
```

Depois ajustar manualmente para a estrutura de pastas do `01-ARCHITECTURE.md`.

### Passos

1. Criar `frontend/` com `create-next-app` (flags acima).
2. Mover conteúdo para respeitar a estrutura de pastas do `01-ARCHITECTURE.md`.
3. Configurar `tsconfig.json`: `"strict": true`, paths `@/*` → `./`.
4. Instalar dependências:
   ```bash
   npm install @tanstack/react-table @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
   npm install date-fns @faker-js/faker lucide-react clsx axios
   npm install --save-dev tsx
   ```
5. Criar `app/globals.css` com todo o conteúdo de CSS variables do `02-DESIGN-SYSTEM.md`.
6. Configurar fonte Inter em `app/layout.tsx`:
   ```typescript
   import { Inter } from 'next/font/google';
   const inter = Inter({ subsets: ['latin'] });
   ```
7. Criar rotas vazias: `/tarefas/page.tsx`, `/scats/page.tsx`, `/scats/[id]/page.tsx`.
8. Criar `src/constants/strings.ts`, `routes.ts`, `icons.ts`, `taskStatus.ts` com conteúdo mínimo.
9. `npm run dev` deve subir sem erros.

### `package.json` — scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "mock:seed": "tsx mocks/factories/seed.ts"
  }
}
```

---

## F2 — Types e Mock Data

### Types — criar em ordem

**`src/types/shared/index.ts`**
```typescript
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
```

**`src/types/user/index.ts`**
```typescript
export interface UserAPI {
  id: number;
  nome: string;
  email: string;
  setor_id: number;
  avatar_url: string | null;
}

export interface User {
  id: number;
  nome: string;
  email: string;
  setorId: number;
  avatarUrl: string | null;
  iniciais: string;   // derivado de nome
}
```

**`src/types/sector/index.ts`**
```typescript
export interface SectorAPI {
  id: number;
  nome: string;
  ativo: boolean;
}

export interface Sector {
  id: number;
  nome: string;
  ativo: boolean;
}
```

**`src/types/client/index.ts`**
```typescript
export interface ClientAPI {
  id: number;
  nome: string;
  codigo: string;
}

export interface Client {
  id: number;
  nome: string;
  codigo: string;
}
```

**`src/types/system/index.ts`**
```typescript
export interface SystemAPI {
  id: number;
  nome: string;
  cliente_id: number;
}

export interface System {
  id: number;
  nome: string;
  clienteId: number;
}
```

**`src/types/task/index.ts`** — definido no `01-ARCHITECTURE.md`, copiar integralmente.

**`src/types/scat/index.ts`**
```typescript
export interface ScatAPI {
  id: number;
  numero: string;              // ex.: "2024/0042"
  titulo: string;
  descricao: string;
  cliente_id: number;
  sistema_id: number;
  setor_id: number;
  solicitante_id: number;
  responsavel_id: number;
  status: 'aberta' | 'em_andamento' | 'aguardando' | 'concluida' | 'cancelada';
  tipo_solicitacao: string;
  prioridade: 'baixa' | 'normal' | 'alta' | 'urgente';
  data_abertura: string;
  data_previsao: string | null;
  data_conclusao: string | null;
  total_tarefas: number;
  tarefas_concluidas: number;
}

export interface Scat {
  id: number;
  numero: string;
  titulo: string;
  descricao: string;
  clienteId: number;
  sistemaId: number;
  setorId: number;
  solicitanteId: number;
  responsavelId: number;
  status: ScatAPI['status'];
  tipoSolicitacao: string;
  prioridade: ScatAPI['prioridade'];
  dataAbertura: Date;
  dataPrevisao: Date | null;
  dataConclusao: Date | null;
  totalTarefas: number;
  tarefasConcluidas: number;
  progresso: number;   // tarefasConcluidas / totalTarefas * 100
}

export interface ScatCardData {
  id: number;
  numero: string;
  titulo: string;
  status: ScatAPI['status'];
  statusLabel: string;
  prioridade: ScatAPI['prioridade'];
  prioridadeLabel: string;
  clienteNome: string;
  sistemaNome: string;
  responsavelNome: string;
  dataAberturaFormatada: string;
  dataPrevisaoFormatada: string;
  totalTarefas: number;
  tarefasConcluidas: number;
  progresso: number;
}

export interface ScatFilters {
  status?: ScatAPI['status'][];
  clienteIds?: number[];
  responsavelIds?: number[];
  dataAberturaDe?: Date;
  dataAberturaAte?: Date;
  search?: string;
}
```

### Mock data — factories

**`mocks/factories/taskFactory.ts`** — conforme `01-ARCHITECTURE.md`.

**`mocks/factories/scatFactory.ts`**
```typescript
import { faker } from '@faker-js/faker/locale/pt_BR';
import type { ScatAPI } from '@/src/types/scat';

const SCAT_STATUSES: ScatAPI['status'][] = ['aberta','em_andamento','aguardando','concluida','cancelada'];
const PRIORIDADES: ScatAPI['prioridade'][] = ['baixa','normal','alta','urgente'];
const TIPOS = ['Melhoria','Correção de Bug','Nova Funcionalidade','Suporte','Documentação','QA'];

export function generateScat(overrides?: Partial<ScatAPI>): ScatAPI {
  const ano = faker.number.int({ min: 2023, max: 2024 });
  const seq = faker.number.int({ min: 1, max: 999 }).toString().padStart(4, '0');
  const totalTarefas = faker.number.int({ min: 1, max: 12 });
  const status = faker.helpers.arrayElement(SCAT_STATUSES);
  return {
    id: faker.number.int({ min: 1, max: 9999 }),
    numero: `${ano}/${seq}`,
    titulo: faker.lorem.sentence({ min: 3, max: 8 }),
    descricao: faker.lorem.paragraph(),
    cliente_id: faker.number.int({ min: 1, max: 10 }),
    sistema_id: faker.number.int({ min: 1, max: 8 }),
    setor_id: faker.number.int({ min: 1, max: 5 }),
    solicitante_id: faker.number.int({ min: 1, max: 15 }),
    responsavel_id: faker.number.int({ min: 1, max: 15 }),
    status,
    tipo_solicitacao: faker.helpers.arrayElement(TIPOS),
    prioridade: faker.helpers.arrayElement(PRIORIDADES),
    data_abertura: faker.date.recent({ days: 90 }).toISOString(),
    data_previsao: faker.helpers.maybe(() => faker.date.soon({ days: 60 }).toISOString(), { probability: 0.7 }) ?? null,
    data_conclusao: status === 'concluida' ? faker.date.recent({ days: 30 }).toISOString() : null,
    total_tarefas: totalTarefas,
    tarefas_concluidas: faker.number.int({ min: 0, max: totalTarefas }),
    ...overrides,
  };
}
```

**`mocks/factories/seed.ts`**
```typescript
import fs from 'fs';
import path from 'path';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { generateTask } from './taskFactory';
import { generateScat } from './scatFactory';
import type { UserAPI } from '@/src/types/user';
import type { SectorAPI } from '@/src/types/sector';
import type { ClientAPI } from '@/src/types/client';
import type { SystemAPI } from '@/src/types/system';

const dataDir = path.join(__dirname, '../data');

// Entidades base (referenciais)
const sectors: SectorAPI[] = [
  { id: 1, nome: 'Desenvolvimento', ativo: true },
  { id: 2, nome: 'QA', ativo: true },
  { id: 3, nome: 'Suporte', ativo: true },
  { id: 4, nome: 'Produto', ativo: true },
  { id: 5, nome: 'Infraestrutura', ativo: false },
];

const clients: ClientAPI[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  nome: faker.company.name(),
  codigo: faker.string.alphanumeric(6).toUpperCase(),
}));

const systems: SystemAPI[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  nome: faker.helpers.arrayElement(['ERP', 'CRM', 'Portal', 'App', 'API', 'BI', 'Integração', 'Admin']) + ` v${faker.number.int({min:1,max:5})}`,
  cliente_id: faker.number.int({ min: 1, max: 10 }),
}));

const users: UserAPI[] = Array.from({ length: 15 }, (_, i) => {
  const nome = faker.person.fullName();
  return {
    id: i + 1,
    nome,
    email: faker.internet.email({ firstName: nome.split(' ')[0] }).toLowerCase(),
    setor_id: faker.number.int({ min: 1, max: 5 }),
    avatar_url: null,
  };
});

const scats = Array.from({ length: 20 }, () => generateScat());
const tasks = Array.from({ length: 50 }, () => generateTask());

// Dados extras: tipos de tarefa, solicitação, finalização, erro
const taskTypes = ['Produto','Suporte','QA','Documentação','Infraestrutura','Deploy','Code Review'];
const requestTypes = ['Melhoria','Correção de Bug','Nova Funcionalidade','Suporte','Documentação','QA','Integração'];
const finalizationTypes = ['Entregue','Cancelado','Suspenso','Incorporado na Versão'];
const errorTypes = ['Erro de Sistema','Erro de Processo','Erro de Dados','Erro de Interface','Erro de Integração'];

const write = (name: string, data: unknown) =>
  fs.writeFileSync(path.join(dataDir, name), JSON.stringify(data, null, 2));

write('tasks.json',            tasks);
write('scats.json',            scats);
write('users.json',            users);
write('sectors.json',          sectors);
write('clients.json',          clients);
write('systems.json',          systems);
write('taskTypes.json',        taskTypes.map((nome, i) => ({ id: i+1, nome })));
write('requestTypes.json',     requestTypes.map((nome, i) => ({ id: i+1, nome })));
write('finalizationTypes.json', finalizationTypes.map((nome, i) => ({ id: i+1, nome })));
write('errorTypes.json',       errorTypes.map((nome, i) => ({ id: i+1, nome })));

console.log('✓ Mocks gerados');
```

Após criar os arquivos, executar:
```bash
npm run mock:seed
```

---

## F3 — Layout (Header + Sidebar)

### Estrutura de rotas

```typescript
// app/(main)/layout.tsx
'use client';
import { Header } from '@/src/components/layout/Header';
import { Sidebar } from '@/src/components/layout/Sidebar';
import { PageContainer } from '@/src/components/layout/PageContainer';
import styles from './layout.module.css';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.root}>
      <Header />
      <div className={styles.body}>
        <Sidebar />
        <PageContainer>{children}</PageContainer>
      </div>
    </div>
  );
}
```

```css
/* app/(main)/layout.module.css */
.root {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.body {
  display: flex;
  flex: 1;
  overflow: hidden;
}
```

### Header

Campos a mostrar:
- Logo da Prognum (SVG — pode ser texto "EVP" estilizado até ter o SVG real)
- Nome do sistema: "EVP — Gestão de Tarefas"
- Avatar do usuário mockado (ex.: "Felipe Freire", iniciais "FF")

### Sidebar

Itens de navegação (usar `ROUTES` de `src/constants/routes.ts`):

| Ícone | Label | Rota |
|---|---|---|
| `ICONS.task` | Tarefas | `/tarefas` |
| `ICONS.scat` | SCATs | `/scats` |

Sidebar não precisa de collapse na F3 — versão expandida fixa.

### `src/constants/routes.ts`

```typescript
export const ROUTES = {
  HOME:         '/',
  TAREFAS:      '/tarefas',
  SCATS:        '/scats',
  SCAT_DETAIL:  (id: number | string) => `/scats/${id}`,
  TAREFA_DETAIL:(id: number | string) => `/tarefa/${id}`,
} as const;
```

---

## F4 — Tela de Tarefas — Lista

### As 14 colunas da tabela

| # | Chave | Header | Tipo | Ordenável | Visível por padrão |
|---|---|---|---|---|---|
| 1 | `id` | `#` | number | Sim | Sim |
| 2 | `scatNumero` | `SCAT` | string | Sim | Sim |
| 3 | `descricao` | `Descrição` | string (truncado 60 chars) | Sim | Sim |
| 4 | `status` | `Status` | StatusBadge | Sim | Sim |
| 5 | `responsavelNome` | `Responsável` | Avatar + nome | Sim | Sim |
| 6 | `setorNome` | `Setor` | string | Sim | Sim |
| 7 | `clienteNome` | `Cliente` | string | Sim | Sim |
| 8 | `sistemaNome` | `Sistema` | string | Sim | Não |
| 9 | `tipoTarefa` | `Tipo` | string | Sim | Sim |
| 10 | `inicioFormatado` | `Início` | date string | Sim | Não |
| 11 | `terminoFormatado` | `Previsão` | date string | Sim | Sim |
| 12 | `terminadoEmFormatado` | `Concluído em` | date string | Sim | Não |
| 13 | `horasFormatadas` | `Horas` | string | Sim | Sim |
| 14 | `pontos` | `Pontos` | number | Sim | Não |

Coluna extra (sempre visível, não ordenável): `acoes` — menu com "Ver detalhe" e "Abrir SCAT".

### TaskCardData — mapeamento

O mapper `taskCardMapper.ts` deve resolver FKs consultando os JSONs de `users`, `sectors`, `clients`, `systems` carregados em memória. O `mockApi` recebe as tarefas já com FKs resolvidas (dados desnormalizados no seed), ou o mapper faz o lookup nas listas em memória.

**Estratégia:** o seed já coloca as FKs como IDs. O mapper `mapTask` (level API→App) mantém os IDs. O mapper `mapTaskCardData` (level App→Display) recebe listas de referência via parâmetro ou context:

```typescript
export function mapTaskCardData(
  task: Task,
  refs: { users: User[]; sectors: Sector[]; clients: Client[]; systems: System[] }
): TaskCardData
```

### `src/components/features/TaskList/columns.ts`

Define as colunas usando `@tanstack/react-table` `createColumnHelper`. Cada coluna:
- `id`: string único
- `header`: string de `STRINGS.tarefas.colunas.*`
- `cell`: função que retorna JSX (só elementos simples, sem lógica)
- `enableSorting`: boolean
- `enableHiding`: boolean

### TaskListToolbar

```
[Busca rápida por descrição]  [Filtros]  [Colunas]  [...]
                              ^badge de  ^visibilidade
                              filtros ativos
```

- Campo de busca: `debounce(300ms)`, filtra apenas localmente pelo campo `descricao`.
- Botão Filtros: abre `TaskFiltersModal`. Badge mostra contagem de filtros ativos.
- Botão Colunas: dropdown `ColumnVisibilityMenu` com checkboxes.

### Pagination

- Página 1 com 20 tarefas por default.
- Navegação: `[<]  Página X de Y  [>]`, selector de pageSize (10 / 20 / 50).

---

## F5 — Tela de Tarefas — Kanban

### Toggle Lista / Kanban

```typescript
// src/contexts/ViewModeContext.tsx
type ViewMode = 'list' | 'kanban';
```

O toggle fica no `TaskListToolbar` / `TaskKanbanToolbar` (mesmo componente `ViewToggle` importado):
```
[☰ Lista]  [⊞ Kanban]
```

O estado de `viewMode` persiste em `localStorage` via `useLocalStorage`.

### Colunas do Kanban

As 5 colunas correspondem aos 5 status de `TASK_STATUS_ORDER`:

| Coluna | Status | Cor de borda do header |
|---|---|---|
| Disponível | `disponivel` | `--color-status-disponivel-border` |
| Em Andamento | `em_andamento` | `--color-status-em-andamento-border` |
| Em Pausa | `em_pausa` | `--color-status-em-pausa-border` |
| Vencida | `vencida` | `--color-status-vencida-border` |
| Concluída | `concluida` | `--color-status-concluida-border` |

### TaskCard (Kanban)

Conteúdo do card:
```
┌──────────────────────────────────────────────────────┐
│ #1234 · SCAT 2024/0042                   [com_erro?] │
│ Descrição da tarefa truncada em 2 linhas...           │
│ ────────────────────────────────────────             │
│ [Avatar] João Silva         ⏱ 4.5h   📅 15/02/2025  │
│ [Badge: Setor]  [Badge: Cliente]                      │
└──────────────────────────────────────────────────────┘
```

- Ícone de erro: `ICONS.warning` em `--color-error` quando `comErro === true`
- Clique no card: abre `TaskDetailDrawer`
- Drag: muda status visualmente, chama `taskService.updateStatus` ao soltar, exibe toast

### Drag-and-drop com dnd-kit

```typescript
// useTasksKanban.ts
import { DndContext, DragEndEvent, closestCorners } from '@dnd-kit/core';

function handleDragEnd(event: DragEndEvent) {
  const { active, over } = event;
  if (!over) return;

  const taskId = active.id as number;
  const newStatus = over.id as TaskStatus;  // o id do droppable é o status da coluna

  if (newStatus !== getTaskStatus(taskId)) {
    optimisticUpdate(taskId, newStatus);       // atualiza estado local imediatamente
    taskService.updateStatus(taskId, newStatus)
      .then(() => toast.success(STRINGS.tarefas.kanban.statusAtualizado))
      .catch(() => { rollback(taskId); toast.error(STRINGS.errors.generic); });
  }
}
```

---

## F6 — Modal de Filtros

O `TaskFiltersModal` é compartilhado entre Lista e Kanban — os filtros vivem no `TaskFiltersContext`, acima de ambos.

### Os 15+ filtros

| # | Campo | Tipo de controle | Source |
|---|---|---|---|
| 1 | Setor | MultiSelect | `sectors.json` |
| 2 | Exibir setores inativos | Switch | — |
| 3 | Número da SCAT | Input texto | — |
| 4 | Tipo de erro | MultiSelect | `errorTypes.json` |
| 5 | Sistema | MultiSelect | `systems.json` |
| 6 | Cliente | MultiSelect | `clients.json` |
| 7 | Tipo de solicitação | MultiSelect | `requestTypes.json` |
| 8 | Previsão de término — De | DatePicker | — |
| 9 | Previsão de término — Até | DatePicker | — |
| 10 | Início — De | DatePicker | — |
| 11 | Início — Até | DatePicker | — |
| 12 | Fim — De | DatePicker | — |
| 13 | Fim — Até | DatePicker | — |
| 14 | Status | Checkboxes (5 opções) | `TASK_STATUS_CONFIG` |
| 15 | Exibir excluídas | Switch | — |
| 16 | Origem | Radio group (Interna / Externa / Todas) | — |
| 17 | Tipo de tarefa | MultiSelect | `taskTypes.json` |
| 18 | Tipo de finalização | MultiSelect | `finalizationTypes.json` |
| 19 | Com erro | Radio group (Todas / Só com erro / Só sem erro) | — |

### Layout do modal

```
┌──────────────────────────────────────────┐
│ Filtros de Tarefas                [✕]   │
├──────────────────────────────────────────┤
│ [Scrollable body — 2 colunas no desktop] │
│                                          │
│ Setor             Sistema               │
│ [MultiSelect]     [MultiSelect]          │
│                                          │
│ Cliente           Tipo de Solicitação    │
│ ...               ...                    │
│                                          │
│ Previsão de Término                      │
│ De [date]    Até [date]                 │
│                                          │
│ ...                                      │
├──────────────────────────────────────────┤
│ [Limpar filtros]        [Aplicar (N)]   │
└──────────────────────────────────────────┘
```

- Largura: `--filters-modal-width` (640px)
- Body scrollável
- "Aplicar" fecha o modal e recarrega dados
- "Limpar filtros" zera todos e fecha
- Badge no botão "Aplicar" mostra contagem de filtros ativos

### `TaskFiltersContext`

```typescript
interface TaskFiltersContextValue {
  filters: TaskFilters;
  activeFiltersCount: number;
  setFilter: <K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) => void;
  clearFilters: () => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}
```

### `applyTaskFilters.ts`

Função pura que recebe `tasks: TaskAPI[]` e `filters: TaskFilters` e retorna as tarefas filtradas. Implementar filtro para cada campo — usar `&&` (AND entre filtros diferentes, OR dentro do mesmo multi-select).

---

## F7 — Drawer de Detalhe de Tarefa

Abre pela direita ao clicar numa tarefa (lista ou kanban). Não navega para outra URL — é um overlay.

### Conteúdo do drawer

**Header:**
```
[✕]  Tarefa #1234              [Abrir SCAT →]
     Status: [badge]
```

**Seção: Informações Gerais**

| Campo | Valor |
|---|---|
| SCAT | 2024/0042 (link clicável) |
| Responsável | Avatar + nome completo |
| Setor | nome |
| Cliente | nome |
| Sistema | nome |
| Tipo de tarefa | valor |

**Seção: Datas e Horas**

| Campo | Valor |
|---|---|
| Início | dd/MM/yyyy |
| Previsão de término | dd/MM/yyyy |
| Concluído em | dd/MM/yyyy ou "—" |
| Horas trabalhadas | X,Xh |
| Pontos previstos | N |

**Seção: Informações Adicionais**

| Campo | Valor |
|---|---|
| Origem | Interna / Externa |
| Tipo de finalização | valor ou "—" |
| Expectativa do fornecedor | texto ou "—" |
| Com erro | Sim / Não (badge colorido) |

**Seção: Histórico** (opcional na F7, pode ser stub)
- Placeholder "Histórico não disponível nesta versão"

### Estado do drawer

Gerenciado em `useTasksScreen` (ou `useTaskDetailDrawer` extraído dele):
```typescript
const [selectedTask, setSelectedTask] = useState<Task | null>(null);
const isDrawerOpen = selectedTask !== null;
```

Fechar: botão ✕, tecla Escape, ou clicar no overlay.

---

## F8 — Tela de SCATs

Rota: `/scats`

### ScatsScreen

Exibe lista de SCATs em formato de tabela ou cards. Preferência: tabela compacta.

### Colunas da tabela de SCATs

| # | Campo | Header | Ordenável |
|---|---|---|---|
| 1 | `numero` | `Nº SCAT` | Sim |
| 2 | `titulo` | `Título` | Sim |
| 3 | `status` | `Status` | Sim |
| 4 | `prioridade` | `Prioridade` | Sim |
| 5 | `clienteNome` | `Cliente` | Sim |
| 6 | `sistemaNome` | `Sistema` | Sim |
| 7 | `responsavelNome` | `Responsável` | Sim |
| 8 | `dataAberturaFormatada` | `Abertura` | Sim |
| 9 | `dataPrevisaoFormatada` | `Previsão` | Sim |
| 10 | `progresso` | `Progresso` | Sim (numérico) |

Coluna progresso: barra de progresso simples `tarefasConcluidas / totalTarefas`.

### Status dos SCATs — cores

| Status | BG | Text |
|---|---|---|
| `aberta` | `--color-status-disponivel-bg` | `--color-status-disponivel-text` |
| `em_andamento` | `--color-status-em-andamento-bg` | `--color-status-em-andamento-text` |
| `aguardando` | `--color-status-em-pausa-bg` | `--color-status-em-pausa-text` |
| `concluida` | `--color-status-concluida-bg` | `--color-status-concluida-text` |
| `cancelada` | `--color-gray-100` | `--color-gray-500` |

### Prioridade — cores

| Prioridade | BG | Text |
|---|---|---|
| `baixa` | `--color-gray-100` | `--color-gray-500` |
| `normal` | `--color-status-disponivel-bg` | `--color-status-disponivel-text` |
| `alta` | `--color-status-em-andamento-bg` | `--color-status-em-andamento-text` |
| `urgente` | `--color-status-vencida-bg` | `--color-status-vencida-text` |

### Toolbar da tela de SCATs

```
[Busca por título/número]  [Filtros básicos: status, cliente]
```

Filtros de SCAT são mais simples — apenas status (checkboxes), cliente (multi-select) e período de abertura. Não precisa de modal — pode ser inline no toolbar ou um popover simples.

---

## F9 — Tela de Detalhe da SCAT

Rota: `/scats/[id]`

### ScatDetailScreen

```
← Voltar para SCATs

╔═══════════════════════════════════════════════════╗
║  SCAT 2024/0042 — [Status]                        ║
║  Título da solicitação                            ║
╠═══════════════════════════════════════════════════╣
║  Descrição completa                               ║
╠══════════════╦════════════════════════════════════╣
║ Cliente      ║ Sistema                            ║
║ Setor        ║ Responsável                        ║
║ Solicitante  ║ Tipo de Solicitação                ║
║ Prioridade   ║ Abertura / Previsão / Conclusão    ║
╠═══════════════════════════════════════════════════╣
║  Tarefas dessa SCAT                  [N tarefas] ║
║  ┌──────────────────────────────────────────┐    ║
║  │ Tabela de tarefas (versão compacta —     │    ║
║  │ 8 colunas, sem filtros, sem pagination   │    ║
║  │ exceto se > 15 tarefas)                  │    ║
║  └──────────────────────────────────────────┘    ║
╚═══════════════════════════════════════════════════╝
```

### Colunas da tabela de tarefas na SCAT

| # | Campo | Header |
|---|---|---|
| 1 | `id` | `#` |
| 2 | `descricao` | `Descrição` |
| 3 | `status` | `Status` |
| 4 | `responsavelNome` | `Responsável` |
| 5 | `setorNome` | `Setor` |
| 6 | `terminoFormatado` | `Previsão` |
| 7 | `horasFormatadas` | `Horas` |
| 8 | `pontos` | `Pontos` |

Clique na tarefa: abre o `TaskDetailDrawer` (mesmo componente da tela de tarefas).

### Hook `useScatDetailScreen`

```typescript
interface UseScatDetailScreenReturn {
  scat: Scat | null;
  tasks: Task[];
  loading: boolean;
  error: string | null;
  selectedTask: Task | null;
  isDrawerOpen: boolean;
  handleTaskClick: (task: Task) => void;
  handleDrawerClose: () => void;
}
```

Carrega a SCAT pelo `id` da rota (`useParams()`) e as tarefas filtradas por `scatId`.

---

## F10 — Polish

### Skeletons

- `SkeletonTaskCard`: card kanban com shimmer em 3 blocos.
- `SkeletonTaskRow`: linha de tabela com 8 células shimmer.
- Exibir 8 linhas skeleton enquanto `loading === true` na tabela.
- Exibir 3 colunas × 3 cards skeleton no kanban.

### Empty states

- Tabela sem tarefas: ilustração simples + `STRINGS.tarefas.lista.empty`.
- Filtros sem resultados: ícone filtro + "Nenhuma tarefa encontrada com os filtros aplicados" + botão "Limpar filtros".
- SCAT sem tarefas: "Esta SCAT não possui tarefas cadastradas."

### Error states

- Erro de carga: `ErrorState` com mensagem + botão "Tentar novamente" que chama `reload()`.

### Toast

O `ToastContext` expõe:
```typescript
interface ToastContextValue {
  toast: {
    success: (message: string) => void;
    error:   (message: string) => void;
    info:    (message: string) => void;
  };
}
```

Toasts que devem aparecer:
- Drag-and-drop concluído: "Status atualizado para [status]"
- Erro no drag: "Erro ao atualizar status"

### Responsividade básica

- Mobile (≤768px): sidebar some, botão de menu aparece no header, kanban rola horizontalmente.
- Drawer ocupa 100% da largura no mobile.
- Modal de filtros ocupa 90vw no mobile.

---

## Strings (`src/constants/strings.ts`) — estrutura completa

```typescript
export const STRINGS = {
  actions: {
    save:         'Salvar',
    cancel:       'Cancelar',
    close:        'Fechar',
    back:         'Voltar',
    apply:        'Aplicar',
    clear:        'Limpar filtros',
    retry:        'Tentar novamente',
    loading:      'Carregando...',
    viewDetail:   'Ver detalhe',
  },

  nav: {
    tarefas: 'Tarefas',
    scats:   'SCATs',
  },

  tarefas: {
    titulo: 'Tarefas',
    views: {
      lista:   'Lista',
      kanban:  'Kanban',
    },
    toolbar: {
      busca:    'Buscar por descrição...',
      filtros:  'Filtros',
      colunas:  'Colunas',
    },
    colunas: {
      id:              '#',
      scat:            'SCAT',
      descricao:       'Descrição',
      status:          'Status',
      responsavel:     'Responsável',
      setor:           'Setor',
      cliente:         'Cliente',
      sistema:         'Sistema',
      tipo:            'Tipo',
      inicio:          'Início',
      termino:         'Previsão',
      terminadoEm:     'Concluído em',
      horas:           'Horas',
      pontos:          'Pontos',
      acoes:           'Ações',
    },
    lista: {
      empty:           'Nenhuma tarefa encontrada',
      emptyFiltros:    'Nenhuma tarefa encontrada com os filtros aplicados',
    },
    kanban: {
      statusAtualizado:  (status: string) => `Status atualizado para "${status}"`,
      erroAtualizar:     'Erro ao atualizar status da tarefa',
    },
    filtros: {
      titulo:            'Filtros de Tarefas',
      setor:             'Setor',
      setoresInativos:   'Exibir setores inativos',
      numeroSolicitacao: 'Número da Solicitação',
      tipoErro:          'Tipo de Erro',
      sistema:           'Sistema',
      cliente:           'Cliente',
      tipoSolicitacao:   'Tipo de Solicitação',
      previsaoTermino:   'Previsão de Término',
      inicio:            'Início',
      fim:               'Fim',
      de:                'De',
      ate:               'Até',
      status:            'Status',
      excluidas:         'Exibir excluídas',
      origem:            'Origem',
      origemInterna:     'Interna',
      origemExterna:     'Externa',
      origemTodas:       'Todas',
      tipoTarefa:        'Tipo de Tarefa',
      tipoFinalizacao:   'Tipo de Finalização',
      comErro:           'Com erro',
      comErroTodas:      'Todas',
      comErroSo:         'Só com erro',
      comErroSem:        'Só sem erro',
    },
    detalhe: {
      titulo:             'Detalhe da Tarefa',
      scat:               'SCAT',
      responsavel:        'Responsável',
      setor:              'Setor',
      cliente:            'Cliente',
      sistema:            'Sistema',
      tipoTarefa:         'Tipo de Tarefa',
      inicio:             'Início',
      previsao:           'Previsão de Término',
      terminadoEm:        'Concluído em',
      horas:              'Horas Trabalhadas',
      pontos:             'Pontos Previstos',
      origem:             'Origem',
      tipoFinalizacao:    'Tipo de Finalização',
      expectativa:        'Expectativa do Fornecedor',
      comErro:            'Com Erro',
      sim:                'Sim',
      nao:                'Não',
      semValor:           '—',
      abrirScat:          'Abrir SCAT',
    },
  },

  scats: {
    titulo: 'SCATs',
    toolbar: {
      busca: 'Buscar por título ou número...',
    },
    colunas: {
      numero:      'Nº SCAT',
      titulo:      'Título',
      status:      'Status',
      prioridade:  'Prioridade',
      cliente:     'Cliente',
      sistema:     'Sistema',
      responsavel: 'Responsável',
      abertura:    'Abertura',
      previsao:    'Previsão',
      progresso:   'Progresso',
    },
    empty:      'Nenhuma SCAT encontrada',
    detalhe: {
      titulo:         'Detalhe da SCAT',
      descricao:      'Descrição',
      cliente:        'Cliente',
      sistema:        'Sistema',
      setor:          'Setor',
      responsavel:    'Responsável',
      solicitante:    'Solicitante',
      tipoSolicitacao:'Tipo de Solicitação',
      prioridade:     'Prioridade',
      abertura:       'Data de Abertura',
      previsao:       'Previsão',
      conclusao:      'Conclusão',
      tarefas:        'Tarefas',
      semTarefas:     'Esta SCAT não possui tarefas cadastradas.',
    },
  },

  errors: {
    generic:          'Algo deu errado. Tente novamente.',
    notFound:         'Página não encontrada.',
    taskNotFound:     'Tarefa não encontrada.',
    scatNotFound:     'SCAT não encontrada.',
    network:          'Sem conexão. Verifique sua internet.',
  },

  status: {
    disponivel:   'Disponível',
    em_andamento: 'Em Andamento',
    em_pausa:     'Em Pausa',
    vencida:      'Vencida',
    concluida:    'Concluída',
  },

  scatStatus: {
    aberta:       'Aberta',
    em_andamento: 'Em Andamento',
    aguardando:   'Aguardando',
    concluida:    'Concluída',
    cancelada:    'Cancelada',
  },

  prioridade: {
    baixa:    'Baixa',
    normal:   'Normal',
    alta:     'Alta',
    urgente:  'Urgente',
  },
} as const;
```

---

## Checklist de conclusão por fase

### F1 — Scaffold
- [ ] `npm run dev` sobe em http://localhost:3000
- [ ] Redirecionamento `/` → `/tarefas` funciona
- [ ] CSS variables visíveis no DevTools
- [ ] TypeScript strict sem erros
- [ ] Fonte Inter carregada

### F2 — Types + Mocks
- [ ] `npm run mock:seed` gera todos os JSONs em `mocks/data/`
- [ ] `npm run typecheck` passa
- [ ] Types de todos os domínios definidos (3 níveis cada)

### F3 — Layout
- [ ] Header azul Prognum aparece em todas as telas
- [ ] Sidebar escura com Tarefas e SCATs
- [ ] Navegação entre `/tarefas` e `/scats` funciona
- [ ] Item ativo na sidebar destacado com borda amarela

### F4 — Lista de Tarefas
- [ ] Tabela renderiza com os 50 mocks
- [ ] Todas as 14 colunas presentes
- [ ] Sort funciona em todas as colunas ordenáveis
- [ ] Column visibility funciona (hide/show colunas)
- [ ] Pagination funciona (página 1 de X, botões de nav, selector de pageSize)
- [ ] Skeleton aparece por ~600ms no carregamento inicial
- [ ] Linha de tarefa com erro tem borda vermelha

### F5 — Kanban
- [ ] Toggle Lista/Kanban funciona (persiste em localStorage)
- [ ] 5 colunas de status renderizadas
- [ ] Cards aparecem na coluna correta
- [ ] Drag-and-drop move card para outra coluna
- [ ] Toast de confirmação ao soltar
- [ ] Estado atualizado em memória após drag

### F6 — Filtros
- [ ] Modal de filtros abre pelo botão Filtros
- [ ] Todos os 15+ campos presentes
- [ ] Aplicar filtros recarrega dados (Lista e Kanban)
- [ ] Badge mostra contagem de filtros ativos
- [ ] Limpar filtros zera tudo

### F7 — Drawer de Detalhe
- [ ] Clicar em tarefa (lista ou kanban) abre drawer pela direita
- [ ] Todos os campos de info exibidos
- [ ] Fechar: botão ✕, Escape, clique fora
- [ ] Link "Abrir SCAT" navega para `/scats/[scatId]`

### F8 — Tela de SCATs
- [ ] Tabela com 10 colunas e ~20 SCATs mockados
- [ ] Sort funciona
- [ ] Busca por título/número funciona
- [ ] Clicar numa SCAT navega para `/scats/[id]`

### F9 — Detalhe da SCAT
- [ ] Info da SCAT exibida no topo
- [ ] Tabela de tarefas da SCAT (filtradas por `scatId`)
- [ ] Clicar numa tarefa abre o `TaskDetailDrawer`
- [ ] Botão "Voltar" retorna para `/scats`

### F10 — Polish
- [ ] Skeletons em todas as telas
- [ ] Empty states em tabelas e kanban
- [ ] Error state com botão de retry
- [ ] Toasts de drag-and-drop
- [ ] Layout responsivo básico no mobile

---

## Critérios finais de "está pronto"

- [ ] `npm install && npm run dev` sobe sem erros
- [ ] `npm run build` passa
- [ ] `npm run typecheck` passa (zero `any`, zero `@ts-ignore`)
- [ ] `npm run lint` passa
- [ ] Todas as fases F1–F10 com checklists marcados
