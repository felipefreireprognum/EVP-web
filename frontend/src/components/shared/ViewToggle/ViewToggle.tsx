'use client';
import { LayoutList, LayoutDashboard } from 'lucide-react';
import { useViewMode } from '@/src/contexts/ViewModeContext';
import { STRINGS } from '@/src/constants/strings';
import styles from './ViewToggle.module.css';

export function ViewToggle() {
  const { viewMode, setViewMode } = useViewMode();
  return (
    <div className={styles.toggle}>
      <button
        className={`${styles.btn} ${viewMode === 'list' ? styles.active : ''}`}
        onClick={() => setViewMode('list')}
        aria-label={STRINGS.tarefas.views.lista}
      >
        <LayoutList size={16} />
        <span>{STRINGS.tarefas.views.lista}</span>
      </button>
      <button
        className={`${styles.btn} ${viewMode === 'kanban' ? styles.active : ''}`}
        onClick={() => setViewMode('kanban')}
        aria-label={STRINGS.tarefas.views.kanban}
      >
        <LayoutDashboard size={16} />
        <span>{STRINGS.tarefas.views.kanban}</span>
      </button>
    </div>
  );
}
