'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, Play, Pause, CheckCircle2, ExternalLink, Timer } from 'lucide-react';
import { TaskStatusBadge } from '@/src/components/shared/StatusBadge';
import { TabDescricao } from './tabs/TabDescricao';
import { TabPrevisao }  from './tabs/TabPrevisao';
import { TabExecucao }  from './tabs/TabExecucao';
import { formatDate } from '@/src/utils/formatters/date';
import { ROUTES } from '@/src/constants/routes';
import type { Task, TaskStatus } from '@/src/types/task';
import styles from './TaskModal.module.css';

type TabId = 'descricao' | 'previsao' | 'execucao';

const TABS: { id: TabId; label: string }[] = [
  { id: 'descricao', label: 'Descrição' },
  { id: 'previsao',  label: 'Previsão' },
  { id: 'execucao',  label: 'Execução' },
];

function fmtTimer(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map(v => String(v).padStart(2, '0')).join(':');
}

interface Props {
  task:            Task | null;
  isOpen:          boolean;
  onClose:         () => void;
  onStatusChange?: (taskId: number, status: TaskStatus) => Promise<void>;
}

export function TaskModal({ task, isOpen, onClose, onStatusChange }: Props) {
  const [activeTab,   setActiveTab]   = useState<TabId>('descricao');
  const [localStatus, setLocalStatus] = useState<TaskStatus | null>(null);
  const [running,     setRunning]     = useState(false);
  const [elapsed,     setElapsed]     = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isOpen && task) {
      setActiveTab('descricao');
      setLocalStatus(task.status);
      setRunning(task.status === 'em_andamento');
      setElapsed(0);
    } else {
      setRunning(false);
    }
  }, [isOpen, task?.id]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed(s => s + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  const status = localStatus ?? task.status;

  async function changeStatus(newStatus: TaskStatus) {
    setLocalStatus(newStatus);
    setRunning(newStatus === 'em_andamento');
    await onStatusChange?.(task!.id, newStatus);
  }

  const canStart  = status === 'disponivel' || status === 'em_pausa' || status === 'vencida';
  const canPause  = status === 'em_andamento';
  const canFinish = status !== 'concluida';
  const isClosed  = status === 'concluida';

  const inicio          = formatDate(task.inicio);
  const terminoPrevisto = formatDate(task.terminoPrevisto);
  const terminadoEm     = formatDate(task.terminadoEm);

  return (
    <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.dialog}>

        {/* ── Header fixo ── */}
        <div className={styles.header}>

          {/* Linha 1: identidade + fechar */}
          <div className={styles.headerTop}>
            <div className={styles.headerMeta}>
              <span className={styles.taskId}>#{task.id}</span>
              <span className={styles.dot}>·</span>
              <span className={styles.scatNum}>{task.scatNumero}</span>
              <Link href={ROUTES.SCAT_DETAIL(task.scatId)} onClick={onClose} className={styles.scatLink}>
                Ver SCAT <ExternalLink size={10} />
              </Link>
            </div>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">
              <X size={15} />
            </button>
          </div>

          {/* Título */}
          <h2 className={styles.title}>{task.descricao}</h2>

          {/* Datas — sempre no header */}
          <div className={styles.datesRow}>
            <span className={styles.dateItem}>
              <span className={styles.dateLabel}>Início</span>
              <span className={styles.dateValue}>{inicio || '—'}</span>
            </span>
            <span className={styles.dateSep} />
            <span className={styles.dateItem}>
              <span className={styles.dateLabel}>Previsão de término</span>
              <span className={styles.dateValue}>{terminoPrevisto || '—'}</span>
            </span>
            <span className={styles.dateSep} />
            <span className={styles.dateItem}>
              <span className={styles.dateLabel}>Concluída em</span>
              <span className={styles.dateValue}>{terminadoEm || '—'}</span>
            </span>
          </div>

          {/* Barra de ações */}
          <div className={styles.actionsBar}>
            <div className={styles.actionsLeft}>
              <TaskStatusBadge status={status} size="sm" />
              {(running || elapsed > 0) && (
                <div className={`${styles.timerPill} ${running ? styles.timerPillActive : ''}`}>
                  <Timer size={12} />
                  <span>{fmtTimer(elapsed)}</span>
                </div>
              )}
            </div>
            {!isClosed && (
              <div className={styles.actionBtns}>
                {canStart && (
                  <button className={`${styles.actionBtn} ${styles.btnStart}`} onClick={() => changeStatus('em_andamento')}>
                    <Play size={13} />
                    {status === 'em_pausa' ? 'Retomar' : 'Iniciar'}
                  </button>
                )}
                {canPause && (
                  <button className={`${styles.actionBtn} ${styles.btnPause}`} onClick={() => changeStatus('em_pausa')}>
                    <Pause size={13} /> Pausar
                  </button>
                )}
                {canFinish && (
                  <button className={`${styles.actionBtn} ${styles.btnFinish}`} onClick={() => changeStatus('concluida')}>
                    <CheckCircle2 size={13} /> Finalizar
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className={styles.tabBar}>
            {TABS.map(t => (
              <button
                key={t.id}
                className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Corpo ── */}
        <div className={styles.body}>
          {activeTab === 'descricao' && <TabDescricao task={task} />}
          {activeTab === 'previsao'  && <TabPrevisao  task={task} />}
          {activeTab === 'execucao'  && <TabExecucao  task={task} />}
        </div>

      </div>
    </div>
  );
}
