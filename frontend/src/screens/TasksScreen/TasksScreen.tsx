'use client';
import { Spinner } from '@/src/components/ui/Spinner';
import { ErrorState } from '@/src/components/shared/ErrorState';
import { TaskList } from '@/src/components/features/TaskList';
import { TaskKanban } from '@/src/components/features/TaskKanban';
import { TaskModal } from '@/src/components/features/TaskModal';
import { TaskFiltersModal } from '@/src/components/features/TaskFiltersModal';
import { useTasksScreen } from '@/src/hooks/tasks/useTasksScreen';
import { useViewMode } from '@/src/contexts/ViewModeContext';
import { STRINGS } from '@/src/constants/strings';
import styles from './TasksScreen.module.css';

export function TasksScreen() {
  const { viewMode } = useViewMode();
  const {
    tasks, loading, error,
    selectedTask, isDrawerOpen,
    handleTaskClick, handleDrawerClose, handleStatusChange, reload,
  } = useTasksScreen();

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
      {viewMode === 'list' ? (
        <TaskList tasks={tasks} onTaskClick={handleTaskClick} />
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
