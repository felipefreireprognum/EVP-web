import { mockApi } from './mockApi';
import { mapTask } from '@/src/utils/mappers/task/taskMapper';
import type { Task, TaskFilters } from '@/src/types/task';

export const taskService = {
  list: async (filters?: TaskFilters): Promise<Task[]> => {
    const [apiTasks, users, sectors, clients, systems] = await Promise.all([
      mockApi.getTasks(filters),
      Promise.resolve(mockApi.refs.users),
      Promise.resolve(mockApi.refs.sectors),
      Promise.resolve(mockApi.refs.clients),
      Promise.resolve(mockApi.refs.systems),
    ]);
    return apiTasks.map(t => mapTask(t, { users, sectors, clients, systems }));
  },

  getById: async (id: number): Promise<Task> => {
    const apiTask = await mockApi.getTaskById(id);
    const { users, sectors, clients, systems } = mockApi.refs;
    return mapTask(apiTask, { users, sectors, clients, systems });
  },

  getByScatId: async (scatId: number): Promise<Task[]> => {
    const apiTasks = await mockApi.getTasksByScatId(scatId);
    const { users, sectors, clients, systems } = mockApi.refs;
    return apiTasks.map(t => mapTask(t, { users, sectors, clients, systems }));
  },

  updateStatus: async (id: number, status: Task['status']): Promise<void> => {
    await mockApi.updateTaskStatus(id, status);
  },

  saveExecution: async (id: number, data: { resultado: string; tipoFinalizacao: string; descricao: string }): Promise<void> => {
    await mockApi.saveTaskExecution(id, data);
  },

  logTimerEvent: (taskId: number, type: 'iniciar' | 'pausar' | 'finalizar'): void => {
    mockApi.logTimerEvent(taskId, type);
  },

  getTimerEvents: (taskId: number) => mockApi.getTimerEvents(taskId),
};
