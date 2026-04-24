'use client';
import { useMemo } from 'react';
import { Spinner } from '@/src/components/ui/Spinner';
import { ErrorState } from '@/src/components/shared/ErrorState';
import { TaskList } from '@/src/components/features/TaskList';
import { TaskKanban } from '@/src/components/features/TaskKanban';
import { TaskModal } from '@/src/components/features/TaskModal';
import { TaskFiltersModal } from '@/src/components/features/TaskFiltersModal';
import { useTasksScreen } from '@/src/hooks/tasks/useTasksScreen';
import { useViewMode } from '@/src/contexts/ViewModeContext';
import { STRINGS } from '@/src/constants/strings';
import type { Task } from '@/src/types/task';
import styles from './TasksScreen.module.css';

const STATUS_LABELS: { key: Task['status']; label: string; style: string }[] = [
  { key: 'disponivel',   label: 'Disponíveis',   style: styles.statDisponivel },
  { key: 'em_andamento', label: 'Em andamento',  style: styles.statAndamento },
  { key: 'em_pausa',     label: 'Em pausa',      style: styles.statPausa },
  { key: 'vencida',      label: 'Vencidas',      style: styles.statVencida },
  { key: 'concluida',    label: 'Concluídas',    style: styles.statConcluida },
];

export function TasksScreen() {
  const { viewMode } = useViewMode();
  const {
    tasks, loading, error,
    selectedTask, isDrawerOpen,
    handleTaskClick, handleDrawerClose, handleStatusChange, reload,
  } = useTasksScreen();

  const stats = useMemo(() => {
    const counts: Record<Task['status'], number> = {
      disponivel: 0, em_andamento: 0, em_pausa: 0, vencida: 0, concluida: 0,
    };
    tasks.forEach(t => { counts[t.status] = (counts[t.status] ?? 0) + 1; });
    return counts;
  }, [tasks]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spinner size={32} />
        <p className={styles.loadingText}>{STRINGS.actions.loading}</p>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={reload} />;
  }

  return (
    <div className={styles.root}>

      {/* Barra de métricas */}
      <div className={styles.statsBar}>
        {STATUS_LABELS.map(({ key, label, style }) => (
          <div key={key} className={`${styles.statItem} ${style}`}>
            <span className={styles.statCount}>{stats[key]}</span>
            <span className={styles.statLabel}>{label}</span>
          </div>
        ))}
      </div>

      {viewMode === 'list' ? (
        <TaskList tasks={tasks} onTaskClick={handleTaskClick} onStatusChange={handleStatusChange} />
      ) : (
        <TaskKanban tasks={tasks} onTaskClick={handleTaskClick} onStatusChange={handleStatusChange} />
      )}

      <TaskModal
        task={selectedTask}
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        onStatusChange={handleStatusChange}
      />

      <TaskFiltersModal />
    </div>
  );
}
