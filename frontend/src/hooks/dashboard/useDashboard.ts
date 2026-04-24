'use client';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { taskService } from '@/src/services/taskService';
import type { Task } from '@/src/types/task';

export function useDashboard() {
  const [tasks,        setTasks]        = useState<Task[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    taskService.list()
      .then(data => { setTasks(data); setLoading(false); })
      .catch(e   => { setError(e instanceof Error ? e.message : 'Erro'); setLoading(false); });
  }, []);

  const now     = useMemo(() => new Date(), []);
  const weekAgo = useMemo(() => new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), [now]);

  const stats = useMemo(() => ({
    emAndamento:      tasks.filter(t => t.status === 'em_andamento').length,
    vencidas:         tasks.filter(t => t.status === 'vencida' || (t.terminoPrevisto && t.terminoPrevisto < now && t.status !== 'concluida')).length,
    disponiveis:      tasks.filter(t => t.status === 'disponivel').length,
    concluidasSemana: tasks.filter(t => t.status === 'concluida' && t.terminadoEm && t.terminadoEm >= weekAgo).length,
  }), [tasks, now, weekAgo]);

  const emAndamento = useMemo(() =>
    tasks.filter(t => t.status === 'em_andamento').slice(0, 5),
    [tasks]);

  const atencao = useMemo(() =>
    tasks
      .filter(t => t.status === 'vencida' || (t.terminoPrevisto && t.terminoPrevisto < now && t.status !== 'concluida'))
      .slice(0, 5),
    [tasks, now]);

  const recentes = useMemo(() =>
    [...tasks].sort((a, b) => b.id - a.id).slice(0, 6),
    [tasks]);

  const handleStatusChange = useCallback(async (taskId: number, newStatus: Task['status']) => {
    await taskService.updateStatus(taskId, newStatus);
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    setSelectedTask(prev => prev?.id === taskId ? { ...prev, status: newStatus } : prev);
  }, []);

  return {
    loading, error,
    stats, emAndamento, atencao, recentes,
    selectedTask,
    isModalOpen: selectedTask !== null,
    openTask:  (task: Task) => setSelectedTask(task),
    closeTask: () => setSelectedTask(null),
    handleStatusChange,
  };
}
