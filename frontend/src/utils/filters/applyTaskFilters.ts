import type { TaskAPI, TaskFilters } from '@/src/types/task';

export function applyTaskFilters(tasks: TaskAPI[], filters?: TaskFilters): TaskAPI[] {
  if (!filters) return tasks;

  return tasks.filter(task => {
    if (!filters.exibirExcluidas && task.excluida) return false;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!task.descricao.toLowerCase().includes(q) && !task.scat_numero.toLowerCase().includes(q)) return false;
    }

    if (filters.numeroSolicitacao) {
      if (!task.scat_numero.toLowerCase().includes(filters.numeroSolicitacao.toLowerCase())) return false;
    }

    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(task.status)) return false;
    }

    if (filters.setorIds && filters.setorIds.length > 0) {
      if (!filters.setorIds.includes(task.setor_id)) return false;
    }

    if (filters.clienteIds && filters.clienteIds.length > 0) {
      if (!filters.clienteIds.includes(task.cliente_id)) return false;
    }

    if (filters.sistemaIds && filters.sistemaIds.length > 0) {
      if (!filters.sistemaIds.includes(task.sistema_id)) return false;
    }

    if (filters.origem && filters.origem !== 'todas') {
      if (task.origem !== filters.origem) return false;
    }

    if (filters.comErro !== null && filters.comErro !== undefined) {
      if (task.com_erro !== filters.comErro) return false;
    }

    if (filters.previsaoTerminoDe && task.termino_previsto) {
      if (new Date(task.termino_previsto) < filters.previsaoTerminoDe) return false;
    }

    if (filters.previsaoTerminoAte && task.termino_previsto) {
      if (new Date(task.termino_previsto) > filters.previsaoTerminoAte) return false;
    }

    return true;
  });
}
