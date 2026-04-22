'use client';
import { useEffect, useState, useCallback } from 'react';
import { scatService } from '@/src/services/scatService';
import { taskService } from '@/src/services/taskService';
import type { Scat } from '@/src/types/scat';
import type { Task } from '@/src/types/task';

export function useScatDetailScreen(id: number) {
  const [scat, setScat] = useState<Scat | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, t] = await Promise.all([
        scatService.getById(id),
        taskService.getByScatId(id),
      ]);
      setScat(s);
      setTasks(t);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { void load(); }, [load]);

  return {
    scat, tasks, loading, error,
    selectedTask,
    isDrawerOpen: selectedTask !== null,
    handleTaskClick: (t: Task) => setSelectedTask(t),
    handleDrawerClose: () => setSelectedTask(null),
    reload: load,
  };
}
