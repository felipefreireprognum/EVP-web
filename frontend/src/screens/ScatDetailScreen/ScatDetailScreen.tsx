'use client';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Spinner } from '@/src/components/ui/Spinner';
import { ErrorState } from '@/src/components/shared/ErrorState';
import { ScatStatusBadge, PriorityBadge } from '@/src/components/shared/StatusBadge';
import { TaskModal } from '@/src/components/features/TaskModal';
import { TabIdentificacao } from './tabs/TabIdentificacao';
import { TabRelato }        from './tabs/TabRelato';
import { TabTarefas }       from './tabs/TabTarefas';
import { TabPontosFuncao }  from './tabs/TabPontosFuncao';
import { TabPlanoTestes }   from './tabs/TabPlanoTestes';
import { TabAtivos }        from './tabs/TabAtivos';
import { useScatDetailScreen } from '@/src/hooks/scats/useScatDetailScreen';
import { mockApi } from '@/src/services/mockApi';
import { ROUTES } from '@/src/constants/routes';
import { useState } from 'react';
import styles from './ScatDetailScreen.module.css';

type TabId = 'identificacao' | 'relato' | 'tarefas' | 'pf' | 'testes' | 'ativos';

const TABS: { id: TabId; label: string }[] = [
  { id: 'identificacao', label: 'Identificação' },
  { id: 'relato',        label: 'Relato do Cliente' },
  { id: 'tarefas',       label: 'Tarefas' },
  { id: 'pf',            label: 'Pontos de Função' },
  { id: 'testes',        label: 'Plano de Testes' },
  { id: 'ativos',        label: 'Ativos' },
];

interface ScatDetailScreenProps { id: number; }

function ProgressBar({ value, total, done }: { value: number; total: number; done: number }) {
  return (
    <div className={styles.progRow}>
      <div className={styles.progBar}>
        <div className={styles.progFill} style={{ width: `${value}%` }} />
      </div>
      <span className={styles.progLabel}>{done}/{total} tarefas · {value}%</span>
    </div>
  );
}

export function ScatDetailScreen({ id }: ScatDetailScreenProps) {
  const [activeTab, setActiveTab] = useState<TabId>('identificacao');

  const {
    scat, tasks, loading, error, reload,
    selectedTask, isDrawerOpen, handleTaskClick, handleDrawerClose,
  } = useScatDetailScreen(id);

  if (loading) {
    return <div className={styles.loadingState}><Spinner size={32} /><p>Carregando...</p></div>;
  }
  if (error || !scat) {
    return <ErrorState message={error ?? 'SCAT não encontrada'} onRetry={reload} />;
  }

  const refs = mockApi.refs;

  return (
    <div className={styles.root}>

      {/* ── Header fixo ── */}
      <div className={styles.header}>

        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link href={ROUTES.SCATS} className={styles.backLink}>
            <ChevronLeft size={14} />
            Solicitações
          </Link>
          <span className={styles.breadSep}>/</span>
          <span className={styles.breadCurrent}>{scat.numero}</span>
        </div>

        {/* SCAT identity */}
        <div className={styles.identity}>
          <div className={styles.identityLeft}>
            <div className={styles.badges}>
              <ScatStatusBadge status={scat.status} />
              <PriorityBadge prioridade={scat.prioridade} />
              <span className={styles.numero}>{scat.numero}</span>
            </div>
            <h1 className={styles.titulo}>{scat.titulo}</h1>
            <ProgressBar value={scat.progresso} total={scat.totalTarefas} done={scat.tarefasConcluidas} />
          </div>
        </div>

        {/* Tab strip */}
        <div className={styles.tabStrip}>
          {TABS.map(t => (
            <button
              key={t.id}
              className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
              {t.id === 'tarefas' && tasks.length > 0 && (
                <span className={styles.tabBadge}>{tasks.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab body ── */}
      <div className={styles.tabBody}>
        {activeTab === 'identificacao' && <TabIdentificacao scat={scat} refs={refs} />}
        {activeTab === 'relato'        && <TabRelato        scat={scat} />}
        {activeTab === 'tarefas'       && <TabTarefas       tasks={tasks} onTaskClick={handleTaskClick} />}
        {activeTab === 'pf'            && <TabPontosFuncao  scatId={scat.id} />}
        {activeTab === 'testes'        && <TabPlanoTestes   scatId={scat.id} />}
        {activeTab === 'ativos'        && <TabAtivos        scatId={scat.id} />}
      </div>

      <TaskModal task={selectedTask} isOpen={isDrawerOpen} onClose={handleDrawerClose} />
    </div>
  );
}
