'use client';
import { useState, useEffect } from 'react';
import { X, ClipboardList, Clock } from 'lucide-react';
import { TaskStatusBadge } from '@/src/components/shared/StatusBadge';
import { TabDetalhes } from './tabs/TabDetalhes';
import { TabTimesheet } from './tabs/TabTimesheet';
import type { Task } from '@/src/types/task';
import styles from './TaskModal.module.css';

type TabId = 'detalhes' | 'timesheet';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'detalhes',   label: 'Detalhes',   icon: <ClipboardList size={14} /> },
  { id: 'timesheet',  label: 'Timesheet',  icon: <Clock size={14} /> },
];

interface Props {
  task:    Task | null;
  isOpen:  boolean;
  onClose: () => void;
}

export function TaskModal({ task, isOpen, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('detalhes');

  useEffect(() => {
    if (isOpen) setActiveTab('detalhes');
  }, [isOpen, task?.id]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  return (
    <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.dialog}>

        {/* Cabeçalho */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.headerMeta}>
              <span className={styles.taskId}>#{task.id}</span>
              <span className={styles.scatBadge}>{task.scatNumero}</span>
              <TaskStatusBadge status={task.status} size="sm" />
            </div>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">
              <X size={16} />
            </button>
          </div>
          <h2 className={styles.title}>{task.descricao}</h2>

          {/* Tab bar */}
          <div className={styles.tabBar}>
            {TABS.map(t => (
              <button
                key={t.id}
                className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(t.id)}
              >
                <span className={styles.tabIcon}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo da tab */}
        <div className={styles.body}>
          {activeTab === 'detalhes'  && <TabDetalhes  task={task} />}
          {activeTab === 'timesheet' && <TabTimesheet task={task} />}
        </div>

      </div>
    </div>
  );
}
