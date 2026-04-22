'use client';
import Link from 'next/link';
import { ExternalLink, AlertTriangle } from 'lucide-react';
import { Drawer } from '@/src/components/ui/Drawer';
import { Button } from '@/src/components/ui/Button';
import { TaskStatusBadge } from '@/src/components/shared/StatusBadge';
import { UserAvatar } from '@/src/components/shared/UserAvatar';
import { STRINGS } from '@/src/constants/strings';
import { ROUTES } from '@/src/constants/routes';
import { formatDate, formatHours } from '@/src/utils/formatters/date';
import type { Task } from '@/src/types/task';
import styles from './TaskDetailDrawer.module.css';

interface TaskDetailDrawerProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{value ?? STRINGS.tarefas.detalhe.semValor}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <div className={styles.sectionBody}>{children}</div>
    </div>
  );
}

export function TaskDetailDrawer({ task, isOpen, onClose }: TaskDetailDrawerProps) {
  if (!task) return null;

  const S = STRINGS.tarefas.detalhe;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Tarefa #${task.id}`}
      subtitle={task.scatNumero}
      headerActions={
        <Link href={ROUTES.SCAT_DETAIL(task.scatId)} onClick={onClose}>
          <Button variant="ghost" size="sm" iconLeft={<ExternalLink size={14} />}>
            {S.abrirScat}
          </Button>
        </Link>
      }
    >
      {/* Status */}
      <div className={styles.statusRow}>
        <TaskStatusBadge status={task.status} size="md" />
        {task.comErro && (
          <span className={styles.erroTag}>
            <AlertTriangle size={12} /> Com Erro
          </span>
        )}
        {task.excluida && (
          <span className={styles.excluidaTag}>Excluída</span>
        )}
      </div>

      {/* Descrição */}
      <div className={styles.descricao}>{task.descricao}</div>

      <Section title={S.infoGeral}>
        <InfoRow label={S.responsavel} value={
          <UserAvatar nome={task.responsavel.nome} iniciais={task.responsavel.iniciais} showName />
        } />
        <InfoRow label={S.setor}   value={task.setor.nome} />
        <InfoRow label={S.cliente} value={task.cliente.nome} />
        <InfoRow label={S.sistema} value={task.sistema.nome} />
        <InfoRow label={S.tipoTarefa} value={task.tipoTarefa} />
        <InfoRow label={S.origem} value={task.origem === 'interna' ? S.interna : S.externa} />
      </Section>

      <Section title={S.datas}>
        <InfoRow label={S.inicio}      value={formatDate(task.inicio)} />
        <InfoRow label={S.previsao}    value={formatDate(task.terminoPrevisto)} />
        <InfoRow label={S.terminadoEm} value={formatDate(task.terminadoEm)} />
        <InfoRow label={S.horas}       value={formatHours(task.horas)} />
        <InfoRow label={S.pontos}      value={`${task.pontosPrevistos} pts`} />
      </Section>

      <Section title={S.adicional}>
        <InfoRow label={S.tipoFinalizacao} value={task.tipoFinalizacao} />
        <InfoRow label={S.comErro} value={task.comErro ? S.sim : S.nao} />
        {task.expectativaFornecedor && (
          <InfoRow label={S.expectativa} value={task.expectativaFornecedor} />
        )}
      </Section>
    </Drawer>
  );
}
