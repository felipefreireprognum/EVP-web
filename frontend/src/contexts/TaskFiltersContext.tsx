'use client';
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { TaskFilters } from '@/src/types/task';

interface TaskFiltersContextValue {
  filters: TaskFilters;
  activeFiltersCount: number;
  setFilter: <K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) => void;
  setFilters: (f: TaskFilters) => void;
  clearFilters: () => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const TaskFiltersContext = createContext<TaskFiltersContextValue | null>(null);

const DEFAULT_FILTERS: TaskFilters = {};

function countActive(f: TaskFilters): number {
  let n = 0;
  if (f.setorIds?.length)          n++;
  if (f.status?.length)            n++;
  if (f.clienteIds?.length)        n++;
  if (f.sistemaIds?.length)        n++;
  if (f.numeroSolicitacao)         n++;
  if (f.origem && f.origem !== 'todas') n++;
  if (f.comErro !== null && f.comErro !== undefined) n++;
  if (f.previsaoTerminoDe)         n++;
  if (f.previsaoTerminoAte)        n++;
  if (f.exibirExcluidas)           n++;
  if (f.search)                    n++;
  return n;
}

export function TaskFiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<TaskFilters>(DEFAULT_FILTERS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const setFilter = useCallback(<K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);
  const openModal    = useCallback(() => setIsModalOpen(true), []);
  const closeModal   = useCallback(() => setIsModalOpen(false), []);

  return (
    <TaskFiltersContext.Provider value={{
      filters,
      activeFiltersCount: countActive(filters),
      setFilter,
      setFilters,
      clearFilters,
      isModalOpen,
      openModal,
      closeModal,
    }}>
      {children}
    </TaskFiltersContext.Provider>
  );
}

export function useTaskFiltersContext(): TaskFiltersContextValue {
  const ctx = useContext(TaskFiltersContext);
  if (!ctx) throw new Error('useTaskFiltersContext must be inside TaskFiltersProvider');
  return ctx;
}
