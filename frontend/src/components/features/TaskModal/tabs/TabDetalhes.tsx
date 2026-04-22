'use client';
import { AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { TaskStatusBadge } from '@/src/components/shared/StatusBadge';
import { UserAvatar } from '@/src/components/shared/UserAvatar';
import { formatDate, formatHours } from '@/src/utils/formatters/date';
import type { Task } from '@/src/types/task';
import styles from './TabDetalhes.module.css';

function Field({ label, value, full }: { label: string; value: React.ReactNode; full?: boolean }) {
  const isEmpty = value === null || value === undefined || value === '' || value === '—';
  return (
    <div className={`${styles.field} ${full ? styles.gridFull : ''}`}>
      <span className={styles.fieldLabel}>{label}</span>
      <span className={`${styles.fieldValue} ${isEmpty ? styles.fieldEmpty : ''}`}>
        {isEmpty ? '—' : value}
      </span>
    </div>
  );
}

interface Props { task: Task; }

export function TabDetalhes({ task }: Props) {
  return (
    <div className={styles.root}>

      {/* ── Identificação ── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Identificação</h3>
        <div className={styles.grid}>
          <Field label="Status" value={<TaskStatusBadge status={task.status} size="sm" />} />
          <Field label="SCAT" value={task.scatNumero} />
          <Field label="Responsável" value={
            <UserAvatar nome={task.responsavel.nome} iniciais={task.responsavel.iniciais} showName size="sm" />
          } />
          <Field label="Setor" value={task.setor.nome} />
          <Field label="Cliente" value={task.cliente.nome} />
          <Field label="Sistema" value={task.sistema.nome} />
        </div>
      </div>

      {/* ── Métricas ── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Métricas</h3>
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <span className={styles.metricValue}>{formatHours(task.horas)}</span>
            <span className={styles.metricLabel}>Horas</span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricValue}>{task.pontosPrevistos}</span>
            <span className={styles.metricLabel}>Pontos</span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricValue}>{task.origem === 'interna' ? 'Int.' : 'Ext.'}</span>
            <span className={styles.metricLabel}>Origem</span>
          </div>
        </div>
      </div>

      {/* ── Datas ── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Datas</h3>
        <div className={styles.grid}>
          <Field label="Início"              value={formatDate(task.inicio)} />
          <Field label="Previsão de Término" value={formatDate(task.terminoPrevisto)} />
          <Field label="Concluído em"        value={formatDate(task.terminadoEm)} />
        </div>
      </div>

      {/* ── Classificação ── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Classificação</h3>
        <div className={styles.grid}>
          <Field label="Tipo de Tarefa"    value={task.tipoTarefa} />
          <Field label="Tipo de Finalização" value={task.tipoFinalizacao} />
          <Field label="Expectativa Fornecedor" full value={task.expectativaFornecedor} />
        </div>
        <div className={styles.tagsRow}>
          {task.comErro ? (
            <span className={`${styles.tag} ${styles.tagErro}`}>
              <AlertCircle size={11} /> Com erro
            </span>
          ) : (
            <span className={`${styles.tag} ${styles.tagOk}`}>
              <CheckCircle size={11} /> Sem erro
            </span>
          )}
          <span className={`${styles.tag} ${styles.tagOrigem}`}>
            Origem {task.origem}
          </span>
          {task.excluida && (
            <span className={`${styles.tag} ${styles.tagExcluida}`}>Excluída</span>
          )}
        </div>
      </div>

    </div>
  );
}
