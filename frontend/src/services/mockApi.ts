import tasksRaw from '@/mocks/data/tasks.json';
import scatsRaw from '@/mocks/data/scats.json';
import usersRaw from '@/mocks/data/users.json';
import sectorsRaw from '@/mocks/data/sectors.json';
import clientsRaw from '@/mocks/data/clients.json';
import systemsRaw from '@/mocks/data/systems.json';
import taskTypesRaw from '@/mocks/data/taskTypes.json';
import requestTypesRaw from '@/mocks/data/requestTypes.json';
import finalizationTypesRaw from '@/mocks/data/finalizationTypes.json';
import errorTypesRaw from '@/mocks/data/errorTypes.json';

import type { TaskAPI, TaskFilters } from '@/src/types/task';
import type { ScatAPI, ScatFilters } from '@/src/types/scat';
import type { UserAPI } from '@/src/types/user';
import type { SectorAPI } from '@/src/types/sector';
import type { ClientAPI } from '@/src/types/client';
import type { SystemAPI } from '@/src/types/system';
import { applyTaskFilters } from '@/src/utils/filters/applyTaskFilters';

const LATENCY_MS = 500;
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const tasks: TaskAPI[] = tasksRaw as TaskAPI[];
const scats: ScatAPI[] = scatsRaw as ScatAPI[];
const users: UserAPI[] = usersRaw as UserAPI[];
const sectors: SectorAPI[] = sectorsRaw as SectorAPI[];
const clients: ClientAPI[] = clientsRaw as ClientAPI[];
const systems: SystemAPI[] = systemsRaw as SystemAPI[];

const taskStatusMemo = new Map<number, TaskAPI['status']>();

export const mockApi = {
  // Refs
  getUsers:   async () => { await sleep(LATENCY_MS); return users; },
  getSectors: async () => { await sleep(LATENCY_MS); return sectors; },
  getClients: async () => { await sleep(LATENCY_MS); return clients; },
  getSystems: async () => { await sleep(LATENCY_MS); return systems; },
  getTaskTypes:         async () => { await sleep(LATENCY_MS); return taskTypesRaw; },
  getRequestTypes:      async () => { await sleep(LATENCY_MS); return requestTypesRaw; },
  getFinalizationTypes: async () => { await sleep(LATENCY_MS); return finalizationTypesRaw; },
  getErrorTypes:        async () => { await sleep(LATENCY_MS); return errorTypesRaw; },

  // Tasks
  getTasks: async (filters?: TaskFilters): Promise<TaskAPI[]> => {
    await sleep(LATENCY_MS);
    const withOverrides = tasks.map(t => ({
      ...t,
      status: taskStatusMemo.get(t.id) ?? t.status,
    }));
    return applyTaskFilters(withOverrides, filters);
  },

  getTaskById: async (id: number): Promise<TaskAPI> => {
    await sleep(LATENCY_MS);
    const task = tasks.find(t => t.id === id);
    if (!task) throw new Error('Tarefa não encontrada');
    return { ...task, status: taskStatusMemo.get(task.id) ?? task.status };
  },

  getTasksByScatId: async (scatId: number): Promise<TaskAPI[]> => {
    await sleep(LATENCY_MS);
    return tasks
      .filter(t => t.scat_id === scatId)
      .map(t => ({ ...t, status: taskStatusMemo.get(t.id) ?? t.status }));
  },

  updateTaskStatus: async (id: number, status: TaskAPI['status']): Promise<void> => {
    await sleep(200);
    taskStatusMemo.set(id, status);
  },

  // Scats
  getScats: async (filters?: ScatFilters): Promise<ScatAPI[]> => {
    await sleep(LATENCY_MS);
    let result = [...scats];
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(s => s.titulo.toLowerCase().includes(q) || s.numero.toLowerCase().includes(q));
    }
    if (filters?.status && filters.status.length > 0) {
      result = result.filter(s => filters.status!.includes(s.status));
    }
    if (filters?.clienteIds && filters.clienteIds.length > 0) {
      result = result.filter(s => filters.clienteIds!.includes(s.cliente_id));
    }
    return result;
  },

  getScatById: async (id: number): Promise<ScatAPI> => {
    await sleep(LATENCY_MS);
    const scat = scats.find(s => s.id === id);
    if (!scat) throw new Error('SCAT não encontrada');
    return scat;
  },

  // Raw refs (sem sleep para uso interno)
  refs: { users, sectors, clients, systems },
};
