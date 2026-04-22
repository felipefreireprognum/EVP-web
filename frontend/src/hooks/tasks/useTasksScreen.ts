'use client';
import { useEffect, useState, useCallback } from 'react';
import { taskService } from '@/src/services/taskService';
import { useTaskFiltersContext } from '@/src/contexts/TaskFiltersContext';
import { useViewMode } from '@/src/contexts/ViewModeContext';
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
  const { filters } = useTaskFiltersContext();
  const { viewMode } = useViewMode();
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

  useEffect(() => { void load(); }, [load]);

  // Recarrega quando muda view mode para garantir dados frescos
  useEffect(() => { void load(); }, [viewMode, load]);

  const handleTaskClick = useCallback((task: Task) => setSelectedTask(task), []);
  const handleDrawerClose = useCallback(() => setSelectedTask(null), []);

  const handleStatusChange = useCallback(async (taskId: number, newStatus: Task['status']) => {
    await taskService.updateStatus(taskId, newStatus);
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    if (selectedTask?.id === taskId) {
      setSelectedTask(prev => prev ? { ...prev, status: newStatus } : null);
    }
  }, [selectedTask]);

  return {
    tasks, loading, error,
    selectedTask,
    isDrawerOpen: selectedTask !== null,
    handleTaskClick,
    handleDrawerClose,
    handleStatusChange,
    reload: load,
  };
}
