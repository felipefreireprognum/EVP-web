'use client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Play, Pause, CheckCircle2, AlertTriangle, Clock, CheckCheck, ListTodo, Activity } from 'lucide-react';
import { TaskStatusBadge } from '@/src/components/shared/StatusBadge';
import { UserAvatar } from '@/src/components/shared/UserAvatar';
import { TaskModal } from '@/src/components/features/TaskModal';
import { Spinner } from '@/src/components/ui/Spinner';
import { ErrorState } from '@/src/components/shared/ErrorState';
import { useAuth } from '@/src/contexts/AuthContext';
import { useDashboard } from '@/src/hooks/dashboard/useDashboard';
import { formatDate } from '@/src/utils/formatters/date';
import type { Task } from '@/src/types/task';
import styles from './DashboardScreen.module.css';

/* ── helpers ── */
function firstNome(full: string) {
  return full.split(' ')[0];
}

function saudacao() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

/* ── Mini task row (usado nos painéis) ── */
function TaskRow({
  task,
  onOpen,
  onStatus,
}: {
  task: Task;
  onOpen: (t: Task) => void;
  onStatus: (id: number, s: Task['status']) => Promise<void>;
}) {
  const canStart  = task.status === 'disponivel' || task.status === 'em_pausa' || task.status === 'vencida';
  const canPause  = task.status === 'em_andamento';
  const canFinish = task.status !== 'concluida';

  return (
    <div className={styles.taskRow} onClick={() => onOpen(task)}>
      <div className={styles.taskRowLeft}>
        <span className={styles.taskRowId}>#{task.id}</span>
        <div className={styles.taskRowMeta}>
          <span className={styles.taskRowDesc}>{task.descricao}</span>
          <div className={styles.taskRowSub}>
            <span className={styles.taskRowScat}>{task.scatNumero}</span>
            {task.terminoPrevisto && (
              <span className={styles.taskRowDate}>{formatDate(task.terminoPrevisto)}</span>
            )}
          </div>
        </div>
      </div>
      <div className={styles.taskRowRight}>
        <UserAvatar nome={task.responsavel.nome} iniciais={task.responsavel.iniciais} size="sm" />
        <TaskStatusBadge status={task.status} size="sm" />
        <div className={styles.taskRowBtns} onClick={e => e.stopPropagation()}>
          {canStart && (
            <button className={`${styles.qBtn} ${styles.qBtnPlay}`} title="Iniciar"
              onClick={() => onStatus(task.id, 'em_andamento')}>
              <Play size={11} />
            </button>
          )}
          {canPause && (
            <button className={`${styles.qBtn} ${styles.qBtnPause}`} title="Pausar"
              onClick={() => onStatus(task.id, 'em_pausa')}>
              <Pause size={11} />
            </button>
          )}
          {canFinish && (
            <button className={`${styles.qBtn} ${styles.qBtnFinish}`} title="Finalizar"
              onClick={() => onStatus(task.id, 'concluida')}>
              <CheckCircle2 size={11} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Recent task card ── */
function RecentCard({ task, onOpen }: { task: Task; onOpen: (t: Task) => void }) {
  return (
    <div className={styles.recentCard} onClick={() => onOpen(task)}>
      <div className={styles.recentCardTop}>
        <span className={styles.recentCardId}>#{task.id}</span>
        <TaskStatusBadge status={task.status} size="sm" />
      </div>
      <p className={styles.recentCardDesc}>{task.descricao}</p>
      <div className={styles.recentCardFooter}>
        <UserAvatar nome={task.responsavel.nome} iniciais={task.responsavel.iniciais} size="sm" />
        <span className={styles.recentCardScat}>{task.scatNumero}</span>
      </div>
    </div>
  );
}

/* ── Main ── */
export function DashboardScreen() {
  const { username } = useAuth();
  const {
    loading, error,
    stats, emAndamento, atencao, recentes,
    selectedTask, isModalOpen, openTask, closeTask, handleStatusChange,
  } = useDashboard();

  const hoje = format(new Date(), "EEEE',' d 'de' MMMM", { locale: ptBR });

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spinner size={32} />
        <p className={styles.loadingText}>Carregando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  const STAT_CARDS = [
    { label: 'Em andamento',      value: stats.emAndamento,      icon: Activity,   cls: styles.cardAndamento },
    { label: 'Disponíveis',       value: stats.disponiveis,      icon: ListTodo,   cls: styles.cardDisponivel },
    { label: 'Vencidas',          value: stats.vencidas,         icon: AlertTriangle, cls: styles.cardVencida },
    { label: 'Concluídas / semana', value: stats.concluidasSemana, icon: CheckCheck, cls: styles.cardConcluida },
  ];

  return (
    <div className={styles.root}>

      {/* ── Greeting ── */}
      <div className={styles.greeting}>
        <div>
          <h1 className={styles.greetingTitle}>
            {saudacao()}, {firstNome(username)}!
          </h1>
          <p className={styles.greetingDate}>{hoje}</p>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className={styles.statsGrid}>
        {STAT_CARDS.map(({ label, value, icon: Icon, cls }) => (
          <div key={label} className={`${styles.statCard} ${cls}`}>
            <div className={styles.statCardIcon}><Icon size={20} /></div>
            <div className={styles.statCardBody}>
              <span className={styles.statCardValue}>{value}</span>
              <span className={styles.statCardLabel}>{label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Panels ── */}
      <div className={styles.panels}>

        {/* Em andamento */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <Clock size={15} className={styles.panelIcon} />
            <h2 className={styles.panelTitle}>Em andamento agora</h2>
            <span className={styles.panelCount}>{stats.emAndamento}</span>
          </div>
          <div className={styles.panelBody}>
            {emAndamento.length === 0 ? (
              <p className={styles.panelEmpty}>Nenhuma tarefa em andamento no momento.</p>
            ) : (
              emAndamento.map(t => (
                <TaskRow key={t.id} task={t} onOpen={openTask} onStatus={handleStatusChange} />
              ))
            )}
          </div>
        </div>

        {/* Atenção */}
        <div className={`${styles.panel} ${styles.panelAtencao}`}>
          <div className={styles.panelHeader}>
            <AlertTriangle size={15} className={`${styles.panelIcon} ${styles.panelIconWarn}`} />
            <h2 className={styles.panelTitle}>Atenção — Vencidas</h2>
            <span className={`${styles.panelCount} ${styles.panelCountWarn}`}>{stats.vencidas}</span>
          </div>
          <div className={styles.panelBody}>
            {atencao.length === 0 ? (
              <p className={styles.panelEmpty}>Nenhuma tarefa vencida.</p>
            ) : (
              atencao.map(t => (
                <TaskRow key={t.id} task={t} onOpen={openTask} onStatus={handleStatusChange} />
              ))
            )}
          </div>
        </div>

      </div>

      {/* ── Acesso rápido ── */}
      <div className={styles.recentSection}>
        <h2 className={styles.sectionTitle}>Acesso rápido — últimas tarefas</h2>
        <div className={styles.recentGrid}>
          {recentes.map(t => (
            <RecentCard key={t.id} task={t} onOpen={openTask} />
          ))}
        </div>
      </div>

      {/* Modal compartilhado */}
      <TaskModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={closeTask}
        onStatusChange={handleStatusChange}
      />

    </div>
  );
}
