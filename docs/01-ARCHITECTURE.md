# 01 — Arquitetura do EVP Web

> Este documento define **a estrutura técnica** do projeto: pastas, camadas, padrões de código, e como os mocks substituem a API. Leia depois do `CLAUDE.md` e antes do `02-DESIGN-SYSTEM.md`.
>
> O documento `ARQUITETURA.MD` (em letras maiúsculas, na mesma pasta) é o guia genérico que serviu de base — este aqui é a **adaptação específica do EVP Web**, e tem precedência em caso de conflito.

---

## Princípio fundamental

```
lógica   → hooks         (toda regra de negócio, transformação, validação)
render   → componente    (só JSX, sem useState de dados, sem fetch, sem lógica)
api      → services      (abstração — hoje lê de mocks, amanhã chama axios)
texto    → strings.ts    (todo texto visível ao usuário em um único lugar)
visual   → theme/        (todo valor de design como constante nomeada)
contrato → types/        (todos os tipos de domínio em um lugar)
```

---

## Estrutura de pastas — completa

A pasta raiz da aplicação é `frontend/`. **Tudo** mora dentro dela.

```
frontend/
├── app/                                    # Next.js App Router (só wrappers finos)
│   ├── layout.tsx                          # root layout: providers globais, fonts
│   ├── globals.css                         # importa CSS variables dos tokens
│   ├── not-found.tsx
│   ├── page.tsx                            # redirect → /tarefas
│   └── (main)/
│       ├── layout.tsx                      # layout com Header + Sidebar
│       ├── tarefas/
│       │   └── page.tsx                    # → <TasksScreen />
│       ├── scats/
│       │   ├── page.tsx                    # → <ScatsScreen />
│       │   └── [id]/page.tsx               # → <ScatDetailScreen />
│       └── tarefa/
│           └── [id]/page.tsx               # → <TaskDetailScreen />
│
├── src/
│   ├── components/
│   │   ├── ui/                             # primitivos sem domínio
│   │   │   ├── Button/
│   │   │   ├── IconButton/
│   │   │   ├── Input/
│   │   │   ├── Textarea/
│   │   │   ├── Select/
│   │   │   ├── MultiSelect/
│   │   │   ├── Checkbox/
│   │   │   ├── Radio/
│   │   │   ├── Switch/
│   │   │   ├── DatePicker/
│   │   │   ├── DateRangePicker/
│   │   │   ├── Modal/
│   │   │   ├── Drawer/
│   │   │   ├── Tooltip/
│   │   │   ├── Badge/
│   │   │   ├── Chip/
│   │   │   ├── Avatar/
│   │   │   ├── Spinner/
│   │   │   ├── Tabs/
│   │   │   ├── Pagination/
│   │   │   └── Toast/
│   │   │
│   │   ├── tables/                         # tabela genérica (TanStack Table)
│   │   │   ├── DataTable/
│   │   │   ├── ColumnHeader/
│   │   │   ├── ColumnVisibilityMenu/
│   │   │   ├── TablePagination/
│   │   │   └── TableEmptyState/
│   │   │
│   │   ├── kanban/                         # board genérico (dnd-kit)
│   │   │   ├── KanbanBoard/
│   │   │   ├── KanbanColumn/
│   │   │   ├── KanbanCardWrapper/
│   │   │   └── KanbanColumnHeader/
│   │   │
│   │   ├── cards/
│   │   │   ├── entity/
│   │   │   │   ├── TaskCard/
│   │   │   │   └── ScatCard/
│   │   │   ├── skeleton/
│   │   │   │   ├── SkeletonTaskCard/
│   │   │   │   └── SkeletonScatCard/
│   │   │   └── ui/
│   │   │       ├── StatsCard/
│   │   │       └── SectionCard/
│   │   │
│   │   ├── features/
│   │   │   ├── TaskList/
│   │   │   │   ├── TaskList.tsx
│   │   │   │   ├── TaskList.module.css
│   │   │   │   ├── columns.ts
│   │   │   │   ├── components/
│   │   │   │   │   ├── TaskListToolbar/
│   │   │   │   │   └── TaskRowActions/
│   │   │   │   └── index.ts
│   │   │   ├── TaskKanban/
│   │   │   │   ├── TaskKanban.tsx
│   │   │   │   ├── TaskKanban.module.css
│   │   │   │   ├── components/
│   │   │   │   │   └── TaskKanbanToolbar/
│   │   │   │   └── index.ts
│   │   │   ├── TaskFiltersModal/
│   │   │   │   ├── TaskFiltersModal.tsx
│   │   │   │   ├── TaskFiltersModal.module.css
│   │   │   │   ├── components/
│   │   │   │   │   ├── SectorFilter/
│   │   │   │   │   ├── ClientFilter/
│   │   │   │   │   ├── SystemFilter/
│   │   │   │   │   ├── StatusFilter/
│   │   │   │   │   ├── DateRangeFilter/
│   │   │   │   │   └── OriginFilter/
│   │   │   │   └── index.ts
│   │   │   ├── TaskDetailDrawer/
│   │   │   │   ├── TaskDetailDrawer.tsx
│   │   │   │   ├── TaskDetailDrawer.module.css
│   │   │   │   ├── components/
│   │   │   │   │   ├── TaskDetailHeader/
│   │   │   │   │   ├── TaskDetailInfo/
│   │   │   │   │   └── TaskDetailHistory/
│   │   │   │   └── index.ts
│   │   │   └── ScatDetail/
│   │   │       ├── ScatDetail.tsx
│   │   │       └── components/
│   │   │
│   │   ├── shared/
│   │   │   ├── StatusBadge/
│   │   │   ├── ClientBadge/
│   │   │   ├── PriorityBadge/
│   │   │   ├── UserAvatar/
│   │   │   ├── EmptyState/
│   │   │   ├── LoadingState/
│   │   │   ├── ErrorState/
│   │   │   ├── ViewToggle/
│   │   │   ├── FilterChips/
│   │   │   ├── SectionTitle/
│   │   │   └── PageHeader/
│   │   │
│   │   ├── modals/
│   │   │   ├── feedback/
│   │   │   │   ├── ConfirmModal/
│   │   │   │   └── WarningModal/
│   │   │   └── pickers/
│   │   │       ├── ClientPickerModal/
│   │   │       └── UserPickerModal/
│   │   │
│   │   └── layout/
│   │       ├── Header/
│   │       ├── Sidebar/
│   │       └── PageContainer/
│   │
│   ├── screens/
│   │   ├── TasksScreen/
│   │   ├── ScatsScreen/
│   │   ├── ScatDetailScreen/
│   │   └── TaskDetailScreen/
│   │
│   ├── hooks/
│   │   ├── shared/
│   │   │   ├── useDebounce.ts
│   │   │   ├── useAsyncData.ts
│   │   │   ├── useIsMobile.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   └── useUrlState.ts
│   │   ├── tasks/
│   │   │   ├── useTasksScreen.ts
│   │   │   ├── useTasksList.ts
│   │   │   ├── useTasksKanban.ts
│   │   │   ├── useTaskFilters.ts
│   │   │   ├── useTaskColumns.ts
│   │   │   ├── useTaskDetailDrawer.ts
│   │   │   └── useTaskCardData.ts
│   │   └── scats/
│   │       ├── useScatsScreen.ts
│   │       └── useScatDetailScreen.ts
│   │
│   ├── services/                           # FACHADA — hoje delega ao mockApi
│   │   ├── api.ts                          # placeholder axios (não usado ainda)
│   │   ├── mockApi.ts                      # simula latência + filtros
│   │   ├── taskService.ts
│   │   ├── scatService.ts
│   │   ├── clientService.ts
│   │   ├── sectorService.ts
│   │   ├── systemService.ts
│   │   ├── userService.ts
│   │   └── index.ts
│   │
│   ├── types/
│   │   ├── task/index.ts
│   │   ├── scat/index.ts
│   │   ├── client/index.ts
│   │   ├── sector/index.ts
│   │   ├── system/index.ts
│   │   ├── user/index.ts
│   │   └── shared/index.ts
│   │
│   ├── constants/
│   │   ├── strings.ts
│   │   ├── icons.ts
│   │   ├── routes.ts
│   │   ├── taskStatus.ts
│   │   └── taskColumns.ts
│   │
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   ├── typography.ts
│   │   ├── shadows.ts
│   │   ├── radius.ts
│   │   ├── sizing.ts
│   │   ├── animation.ts
│   │   ├── breakpoints.ts
│   │   ├── zIndex.ts
│   │   └── index.ts
│   │
│   ├── utils/
│   │   ├── formatters/
│   │   │   ├── date.ts
│   │   │   ├── duration.ts
│   │   │   └── number.ts
│   │   ├── mappers/
│   │   │   ├── task/
│   │   │   │   ├── taskMapper.ts
│   │   │   │   └── taskCardMapper.ts
│   │   │   └── scat/
│   │   │       └── scatMapper.ts
│   │   ├── filters/
│   │   │   └── applyTaskFilters.ts
│   │   └── errors/
│   │       └── handleError.ts
│   │
│   ├── contexts/
│   │   ├── TaskFiltersContext.tsx
│   │   ├── ViewModeContext.tsx
│   │   └── ToastContext.tsx
│   │
│   ├── lib/
│   │   ├── axios.ts
│   │   └── tanstackTable.ts
│   │
│   └── styles/
│       └── globals.css
│
├── mocks/                                  # SEPARADO de src/ — dados fake
│   ├── data/
│   │   ├── tasks.json
│   │   ├── scats.json
│   │   ├── clients.json
│   │   ├── sectors.json
│   │   ├── systems.json
│   │   ├── users.json
│   │   ├── taskTypes.json
│   │   ├── requestTypes.json
│   │   ├── errorTypes.json
│   │   └── finalizationTypes.json
│   ├── factories/
│   │   ├── taskFactory.ts
│   │   ├── scatFactory.ts
│   │   └── seed.ts
│   └── index.ts
│
├── public/
│   ├── logo-prognum.svg
│   └── favicon.ico
│
├── package.json
├── tsconfig.json
├── next.config.ts
├── eslint.config.mjs
├── .env.local
├── .gitignore
└── README.md
```

---

## As 3 camadas de uma tela

```
app/feature/page.tsx        → wrapper fino. ~5 linhas. Zero lógica.
screens/FeatureScreen/      → busca dados via hook, exibe skeleton/error/conteúdo.
components/features/...     → UI pura. Recebe props. Zero fetch. Zero router.
```

```typescript
// CAMADA 1 — app/(main)/tarefas/page.tsx
import TasksScreen from '@/src/screens/TasksScreen';
export default function TarefasPage() {
  return <TasksScreen />;
}

// CAMADA 2 — src/screens/TasksScreen/TasksScreen.tsx
'use client';
import { useTasksScreen } from '@/src/hooks/tasks/useTasksScreen';
import { TaskList } from '@/src/components/features/TaskList';
import { TaskKanban } from '@/src/components/features/TaskKanban';
import { LoadingState, ErrorState } from '@/src/components/shared';

export default function TasksScreen() {
  const { tasks, viewMode, loading, error, ...rest } = useTasksScreen();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return viewMode === 'list'
    ? <TaskList tasks={tasks} {...rest} />
    : <TaskKanban tasks={tasks} {...rest} />;
}

// CAMADA 3 — src/components/features/TaskList/TaskList.tsx
'use client';
import type { Task } from '@/src/types/task';
import { DataTable } from '@/src/components/tables/DataTable';
import { taskColumns } from './columns';

interface TaskListProps {
  tasks: Task[];
  onRowClick: (task: Task) => void;
}

export function TaskList({ tasks, onRowClick }: TaskListProps) {
  return <DataTable data={tasks} columns={taskColumns} onRowClick={onRowClick} />;
}
```

**Regra:** cada camada tem uma e somente uma responsabilidade.

---

## Mocks — como funciona o "sem API"

### Fluxo

```
hook (useTasksScreen)
  ↓ chama
taskService.list(filters)            ← src/services/taskService.ts
  ↓ delega pra
mockApi.get('/tasks', { params })    ← src/services/mockApi.ts
  ↓ que aplica filtros sobre
mocks/data/tasks.json                ← raw data
```

### `mockApi.ts` — simula uma API

```typescript
// src/services/mockApi.ts
import tasksData from '../../mocks/data/tasks.json';
import scatsData from '../../mocks/data/scats.json';
// ... outros imports
import { applyTaskFilters } from '@/src/utils/filters/applyTaskFilters';
import type { TaskFilters } from '@/src/types/task';

const LATENCY_MS = 400; // simula rede

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export const mockApi = {
  async getTasks(filters?: TaskFilters) {
    await sleep(LATENCY_MS);
    return applyTaskFilters(tasksData, filters);
  },

  async getTaskById(id: number) {
    await sleep(LATENCY_MS);
    const task = tasksData.find(t => t.id === id);
    if (!task) throw new Error('Tarefa não encontrada');
    return task;
  },

  async updateTaskStatus(id: number, status: string) {
    await sleep(LATENCY_MS);
    // mutação em memória — em produção seria PATCH
    const task = tasksData.find(t => t.id === id);
    if (task) task.status = status;
    return task;
  },

  async getScats(filters?: any) {
    await sleep(LATENCY_MS);
    return scatsData;
  },

  // ... outros endpoints
};
```

### `taskService.ts` — fachada estável

```typescript
// src/services/taskService.ts
import { mockApi } from './mockApi';
import { mapTask } from '@/src/utils/mappers/task/taskMapper';
import type { Task, TaskFilters } from '@/src/types/task';

export const taskService = {
  list: async (filters?: TaskFilters): Promise<Task[]> => {
    const apiTasks = await mockApi.getTasks(filters);
    return apiTasks.map(mapTask);
  },

  getById: async (id: number): Promise<Task> => {
    const apiTask = await mockApi.getTaskById(id);
    return mapTask(apiTask);
  },

  updateStatus: async (id: number, status: Task['status']): Promise<void> => {
    await mockApi.updateTaskStatus(id, status);
  },
};
```

**Quando a API real chegar:** apague `mockApi.ts`, troque os imports do `taskService.ts` para `api` (axios), e os hooks/componentes não mudam nada.

### Geração de mocks com faker

```typescript
// mocks/factories/taskFactory.ts
import { faker } from '@faker-js/faker/locale/pt_BR';
import type { TaskAPI } from '@/src/types/task';

const STATUSES = ['disponivel', 'em_andamento', 'em_pausa', 'vencida', 'concluida'] as const;

export function generateTask(overrides?: Partial<TaskAPI>): TaskAPI {
  const status = faker.helpers.arrayElement(STATUSES);
  return {
    id: faker.number.int({ min: 1, max: 100000 }),
    scat_id: faker.number.int({ min: 1, max: 50 }),
    descricao: faker.lorem.sentence({ min: 4, max: 10 }),
    status,
    responsavel_id: faker.number.int({ min: 1, max: 15 }),
    setor_id: faker.number.int({ min: 1, max: 5 }),
    sistema_id: faker.number.int({ min: 1, max: 8 }),
    cliente_id: faker.number.int({ min: 1, max: 10 }),
    horas: faker.number.float({ min: 0.5, max: 40, fractionDigits: 1 }),
    pontos_previstos: faker.number.int({ min: 1, max: 13 }),
    inicio: faker.date.recent({ days: 30 }).toISOString(),
    termino_previsto: faker.date.soon({ days: 30 }).toISOString(),
    terminado_em: status === 'concluida' ? faker.date.recent({ days: 10 }).toISOString() : null,
    expectativa_fornecedor: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }) ?? null,
    tipo_tarefa: faker.helpers.arrayElement(['Produto', 'Suporte', 'QA', 'Documentação']),
    tipo_finalizacao: null,
    com_erro: faker.datatype.boolean({ probability: 0.15 }),
    excluida: false,
    origem: faker.helpers.arrayElement(['interna', 'externa']),
    ...overrides,
  };
}

// mocks/factories/seed.ts
import fs from 'fs';
import path from 'path';
import { generateTask } from './taskFactory';
import { generateScat } from './scatFactory';

const tasks = Array.from({ length: 50 }, () => generateTask());
const scats = Array.from({ length: 20 }, () => generateScat());

const dataDir = path.join(__dirname, '../data');
fs.writeFileSync(path.join(dataDir, 'tasks.json'), JSON.stringify(tasks, null, 2));
fs.writeFileSync(path.join(dataDir, 'scats.json'), JSON.stringify(scats, null, 2));
console.log('✓ Mocks regenerated');
```

Adicione no `package.json`:
```json
"scripts": {
  "mock:seed": "tsx mocks/factories/seed.ts"
}
```

---

## Hooks — o cérebro da aplicação

### Nomenclatura por responsabilidade

| Sufixo | O que faz | Exemplo |
|---|---|---|
| `useXxxScreen` | Orquestra dados + estado UI de uma tela | `useTasksScreen` |
| `useXxxList` / `useXxxKanban` | Estado de uma view específica | `useTasksList` |
| `useXxxFilters` | Estado de filtros + ações | `useTaskFilters` |
| `useXxxData` | Só carrega dados, sem ações | `useTaskCardData` |
| `useXxxModal` / `useXxxDrawer` | Estado de abertura + conteúdo | `useTaskDetailDrawer` |

### Interface padrão

```typescript
// hooks/tasks/useTasksScreen.ts
'use client';
import { useEffect, useState, useCallback } from 'react';
import { taskService } from '@/src/services/taskService';
import { useTaskFilters } from './useTaskFilters';
import type { Task } from '@/src/types/task';

export interface UseTasksScreenReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  selectedTask: Task | null;
  isDrawerOpen: boolean;
  handleTaskClick: (task: Task) => void;
  handleDrawerClose: () => void;
  handleStatusChange: (taskId: number, newStatus: Task['status']) => Promise<void>;
  reload: () => Promise<void>;
}

export function useTasksScreen(): UseTasksScreenReturn {
  const { filters } = useTaskFilters();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.list(filters);
      setTasks(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const handleTaskClick = (task: Task) => setSelectedTask(task);
  const handleDrawerClose = () => setSelectedTask(null);

  const handleStatusChange = async (taskId: number, newStatus: Task['status']) => {
    await taskService.updateStatus(taskId, newStatus);
    await load();
  };

  return {
    tasks,
    loading,
    error,
    selectedTask,
    isDrawerOpen: selectedTask !== null,
    handleTaskClick,
    handleDrawerClose,
    handleStatusChange,
    reload: load,
  };
}
```

### O que vai no hook vs o que fica no componente

| No hook | No componente |
|---|---|
| `useState` de dados/formulário | JSX |
| `useEffect` de fetch | Styles |
| `useMemo` de filtros/transformação | Navegação (router.push) |
| Handlers (`handleSave`, `handleDelete`) | Feedback visual (animações, toast trigger) |
| Mappers (form → payload) | Modais (chamar `open()` do hook) |
| Estado de UI compartilhado | Estado UI puramente local (hover, focus) |

---

## Types — 3 níveis por entidade

```typescript
// src/types/task/index.ts

// Nível 1: shape do mock/API (snake_case, como vem do backend)
export interface TaskAPI {
  id: number;
  scat_id: number;
  descricao: string;
  status: 'disponivel' | 'em_andamento' | 'em_pausa' | 'vencida' | 'concluida';
  responsavel_id: number;
  setor_id: number;
  sistema_id: number;
  cliente_id: number;
  horas: number;
  pontos_previstos: number;
  inicio: string | null;
  termino_previsto: string | null;
  terminado_em: string | null;
  expectativa_fornecedor: string | null;
  tipo_tarefa: string;
  tipo_finalizacao: string | null;
  com_erro: boolean;
  excluida: boolean;
  origem: 'interna' | 'externa';
}

// Nível 2: tipo interno (camelCase, datas como Date, FK resolvidas)
export interface Task {
  id: number;
  scatId: number;
  descricao: string;
  status: TaskStatus;
  responsavel: User;
  setor: Sector;
  sistema: System;
  cliente: Client;
  horas: number;
  pontosPrevistos: number;
  inicio: Date | null;
  terminoPrevisto: Date | null;
  terminadoEm: Date | null;
  expectativaFornecedor: string | null;
  tipoTarefa: string;
  tipoFinalizacao: string | null;
  comErro: boolean;
  excluida: boolean;
  origem: 'interna' | 'externa';
}

export type TaskStatus = TaskAPI['status'];

// Nível 3: tipo de display (o que cards/tabela mostram)
export interface TaskCardData {
  id: number;
  scatId: number;
  numeroSolicitacao: string;
  titulo: string;        // descricao truncada
  status: TaskStatus;
  statusLabel: string;
  statusColor: string;
  responsavelNome: string;
  responsavelAvatar: string;
  clienteNome: string;
  setorNome: string;
  inicioFormatado: string;
  terminoFormatado: string;
  horasFormatadas: string;
  pontos: number;
  comErro: boolean;
}

// Filtros (estado do modal)
export interface TaskFilters {
  setorIds?: number[];
  exibirSetoresInativos?: boolean;
  numeroSolicitacao?: string;
  tipoErroIds?: number[];
  sistemaIds?: number[];
  clienteIds?: number[];
  tipoSolicitacaoIds?: number[];
  previsaoTerminoDe?: Date;
  previsaoTerminoAte?: Date;
  inicioDe?: Date;
  inicioAte?: Date;
  fimDe?: Date;
  fimAte?: Date;
  status?: TaskStatus[];
  exibirExcluidas?: boolean;
  origem?: 'interna' | 'externa' | 'todas';
  tipoTarefaIds?: number[];
  tipoFinalizacaoIds?: number[];
  comErro?: boolean | null;  // true=só com erro, false=só sem erro, null=todas
}
```

---

## Componentes — estrutura obrigatória

Todo componente segue a mesma estrutura:

```
ComponentName/
├── ComponentName.tsx
├── ComponentName.module.css
├── ComponentName.types.ts          # opcional, só se 5+ interfaces
└── index.ts                        # barrel export
```

```typescript
// index.ts
export { ComponentName } from './ComponentName';
// ou
export { default } from './ComponentName';
```

**Ordem de imports** (ESLint vai cuidar disso, mas siga manualmente):
```typescript
// 1. React
import { useState, useEffect } from 'react';

// 2. Bibliotecas externas
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

// 3. Componentes UI internos
import { Button } from '@/src/components/ui/Button';
import { Modal } from '@/src/components/ui/Modal';

// 4. Contexts
import { useTaskFilters } from '@/src/contexts/TaskFiltersContext';

// 5. Hooks
import { useDebounce } from '@/src/hooks/shared/useDebounce';

// 6. Types (sempre `import type`)
import type { Task } from '@/src/types/task';

// 7. Locais
import styles from './TaskCard.module.css';
import { ICONS } from '@/src/constants/icons';
```

---

## Path alias

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

Imports ficam: `@/src/components/...`, `@/mocks/data/tasks.json`, etc.

---

## Workflow para adicionar uma feature nova

1. **Tipos** primeiro: defina `XxxAPI`, `Xxx`, `XxxCardData` em `src/types/xxx/`.
2. **Mock data**: adicione JSON em `mocks/data/` ou factory em `mocks/factories/`.
3. **mockApi**: adicione handler em `src/services/mockApi.ts`.
4. **Service**: crie `src/services/xxxService.ts` consumindo o mockApi.
5. **Strings**: adicione textos em `src/constants/strings.ts` no domínio correto.
6. **Hook(s)**: crie `useXxxScreen`, etc., em `src/hooks/xxx/`.
7. **Componentes UI** (se faltar primitivo): adicione em `src/components/ui/`.
8. **Componente de domínio**: crie em `src/components/features/Xxx/`.
9. **Screen**: crie em `src/screens/XxxScreen/`.
10. **Rota**: crie wrapper em `app/(main)/xxx/page.tsx`.
11. **Adicione na sidebar** (se aplicável).

---

## Checklist antes de considerar uma fase pronta

### Componente
- [ ] Zero `useState` de dados (só UI state — modal open, tab ativa)
- [ ] Zero `useEffect` de fetch
- [ ] Zero `handleSave`/validação/transformação
- [ ] Tem `index.ts` com barrel export
- [ ] Styles em `.module.css` separado

### Hook
- [ ] Toda lógica de negócio está aqui
- [ ] Retorna dados + handlers + estado de loading
- [ ] Usa service para "API"
- [ ] Tem interface `UseXxxReturn` tipada

### Service
- [ ] Zero `fetch()` direto fora daqui
- [ ] Aplica mappers (API → App) antes de retornar

### Strings
- [ ] Zero texto literal em JSX
- [ ] Tudo vem de `STRINGS.dominio.chave`

### Visual
- [ ] Zero valores hardcoded (cores, spacing, radius, font-size)
- [ ] Tudo via CSS variables

### TypeScript
- [ ] Zero `any`, zero `@ts-ignore`
- [ ] `npm run typecheck` passa

---

## Princípios resumidos

1. **Componente não pensa** — só renderiza
2. **Hook é o cérebro** — toda lógica
3. **Service é o canal** — toda "API" passa por aqui
4. **Strings são constantes** — todo texto em um lugar
5. **Tokens são lei** — nenhum valor visual hardcoded
6. **Types por domínio** — 3 níveis: API / App / Display
7. **Barrel exports em tudo** — imports limpos
8. **Hierarquia de 3 camadas** — Rota → Screen → View
9. **Mocks são descartáveis** — `mocks/` separado de `src/`, só `mockApi` toca
10. **Decisões pequenas, PRs pequenos** — uma fase por vez
