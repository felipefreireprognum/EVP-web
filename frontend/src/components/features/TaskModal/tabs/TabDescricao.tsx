'use client';
import { UserAvatar } from '@/src/components/shared/UserAvatar';
import { formatHours } from '@/src/utils/formatters/date';
import type { Task } from '@/src/types/task';
import styles from './TabDescricao.module.css';

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>{label}</span>
      <div className={styles.infoValue}>{children}</div>
    </div>
  );
}

interface Props { task: Task; }

export function TabDescricao({ task }: Props) {
  return (
    <div className={styles.root}>

      {/* Descrição */}
      <section className={styles.section}>
        <span className={styles.sectionTitle}>Descrição</span>
        <p className={styles.descText}>{task.descricao}</p>
      </section>

      {/* Informações */}
      <section className={styles.section}>
        <span className={styles.sectionTitle}>Informações</span>
        <div className={styles.infoList}>
          <InfoRow label="Responsável">
            <UserAvatar nome={task.responsavel.nome} iniciais={task.responsavel.iniciais} showName size="sm" />
          </InfoRow>
          <InfoRow label="Setor"><span>{task.setor.nome}</span></InfoRow>
          <InfoRow label="Cliente"><span>{task.cliente.nome}</span></InfoRow>
          <InfoRow label="Sistema"><span>{task.sistema.nome}</span></InfoRow>
          <InfoRow label="Tipo de tarefa"><span>{task.tipoTarefa}</span></InfoRow>
          <InfoRow label="Origem"><span>{task.origem === 'interna' ? 'Interna' : 'Externa'}</span></InfoRow>
          <InfoRow label="Horas previstas"><span>{formatHours(task.horas)}</span></InfoRow>
          <InfoRow label="Pontos previstos"><span>{task.pontosPrevistos}</span></InfoRow>
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
