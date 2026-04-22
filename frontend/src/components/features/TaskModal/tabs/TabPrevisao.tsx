'use client';
import { formatDate, formatHours } from '@/src/utils/formatters/date';
import type { Task } from '@/src/types/task';
import styles from './TabPrevisao.module.css';

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>{label}</span>
      <div className={styles.infoValue}>{children}</div>
    </div>
  );
}

interface Props { task: Task; }

export function TabPrevisao({ task }: Props) {
  const isConcluida  = task.status === 'concluida';
  const isVencida    = task.status === 'vencida';
  const diasRestantes = task.terminoPrevisto
    ? Math.ceil((task.terminoPrevisto.getTime() - Date.now()) / 86400000)
    : null;

  const prazoLabel =
    diasRestantes === null  ? '—'
    : isConcluida           ? 'Concluída'
    : diasRestantes < 0     ? `${Math.abs(diasRestantes)} dia(s) em atraso`
    : diasRestantes === 0   ? 'Vence hoje'
    :                         `${diasRestantes} dia(s) restante(s)`;

  return (
    <div className={styles.root}>

      {/* Cards de resumo */}
      <div className={styles.cards}>
        <div className={styles.card}>
          <span className={styles.cardValue}>{formatHours(task.horas)}</span>
          <span className={styles.cardLabel}>Horas previstas</span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardValue}>{task.pontosPrevistos}</span>
          <span className={styles.cardLabel}>Pontos previstos</span>
        </div>
        <div className={`${styles.card} ${isVencida ? styles.cardDanger : isConcluida ? styles.cardDone : ''}`}>
          <span className={styles.cardValue}>{prazoLabel}</span>
          <span className={styles.cardLabel}>Prazo</span>
        </div>
      </div>

      {/* Datas */}
      <section className={styles.section}>
        <span className={styles.sectionTitle}>Datas</span>
        <div className={styles.infoList}>
          <InfoRow label="Iniciada em">
            <span>{formatDate(task.inicio) || '—'}</span>
          </InfoRow>
          <InfoRow label="Previsão de término">
            <span>{formatDate(task.terminoPrevisto) || '—'}</span>
          </InfoRow>
          <InfoRow label="Concluída em">
            <span>{formatDate(task.terminadoEm) || '—'}</span>
          </InfoRow>
        </div>
      </section>

      {/* Planejamento */}
      <section className={styles.section}>
        <span className={styles.sectionTitle}>Planejamento</span>
        <div className={styles.infoList}>
          <InfoRow label="Tipo de tarefa">
            <span>{task.tipoTarefa || '—'}</span>
          </InfoRow>
          <InfoRow label="Tipo de finalização previsto">
            <span>{task.tipoFinalizacao || '—'}</span>
          </InfoRow>
          <InfoRow label="Origem">
            <span>{task.origem === 'interna' ? 'Interna' : 'Externa'}</span>
          </InfoRow>
        </div>
      </section>

      {task.expectativaFornecedor && (
        <section className={styles.section}>
          <span className={styles.sectionTitle}>Expectativa do fornecedor</span>
          <p className={styles.expectText}>{task.expectativaFornecedor}</p>
        </section>
      )}

    </div>
  );
}
