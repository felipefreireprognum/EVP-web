'use client';
import Link from 'next/link';
import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  flexRender, type ColumnDef,
} from '@tanstack/react-table';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Spinner } from '@/src/components/ui/Spinner';
import { ScatStatusBadge, PriorityBadge, TaskStatusBadge } from '@/src/components/shared/StatusBadge';
import { UserAvatar } from '@/src/components/shared/UserAvatar';
import { EmptyState } from '@/src/components/shared/EmptyState';
import { ErrorState } from '@/src/components/shared/ErrorState';
import { TaskModal } from '@/src/components/features/TaskModal';
import { useScatDetailScreen } from '@/src/hooks/scats/useScatDetailScreen';
import { mockApi } from '@/src/services/mockApi';
import { formatDate, formatHours } from '@/src/utils/formatters/date';
import { STRINGS } from '@/src/constants/strings';
import { ROUTES } from '@/src/constants/routes';
import { SCAT_STATUS_CONFIG, PRIORIDADE_CONFIG } from '@/src/constants/taskStatus';
import type { Task } from '@/src/types/task';
import styles from './ScatDetailScreen.module.css';

interface ScatDetailScreenProps { id: number; }

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className={styles.infoItem}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{value ?? STRINGS.scats.detalhe.semValor}</span>
    </div>
  );
}

function ProgressBar({ value, total, done }: { value: number; total: number; done: number }) {
  return (
    <div className={styles.progWrap}>
      <div className={styles.progBar}>
        <div className={styles.progFill} style={{ width: `${value}%` }} />
      </div>
      <span className={styles.progLabel}>{done}/{total} tarefas · {value}%</span>
    </div>
  );
}

export function ScatDetailScreen({ id }: ScatDetailScreenProps) {
  const {
    scat, tasks, loading, error, reload,
    selectedTask, isDrawerOpen, handleTaskClick, handleDrawerClose,
  } = useScatDetailScreen(id);

  const refs = mockApi.refs;

  const columns: ColumnDef<Task>[] = [
    { id: 'id', accessorKey: 'id', header: '#', size: 60,
      cell: info => <span className={styles.idCell}>#{info.getValue<number>()}</span> },
    { id: 'descricao', accessorKey: 'descricao', header: 'Descrição',
      cell: info => <span className={styles.descCell}>{info.getValue<string>()}</span> },
    { id: 'status', accessorKey: 'status', header: 'Status', size: 130,
      cell: info => <TaskStatusBadge status={info.getValue<Task['status']>()} size="sm" /> },
    { id: 'responsavel', accessorFn: r => r.responsavel.nome, header: 'Responsável',
      cell: info => {
        const t = info.row.original;
        return <UserAvatar nome={t.responsavel.nome} iniciais={t.responsavel.iniciais} showName size="sm" />;
      }},
    { id: 'setor', accessorFn: r => r.setor.nome, header: 'Setor', size: 120 },
    { id: 'termino', accessorKey: 'terminoPrevisto', header: 'Previsão', size: 100,
      cell: info => formatDate(info.getValue<Date | null>()) },
    { id: 'horas', accessorKey: 'horas', header: 'Horas', size: 80,
      cell: info => formatHours(info.getValue<number>()) },
    { id: 'pontos', accessorKey: 'pontosPrevistos', header: 'Pontos', size: 70 },
  ];

  const table = useReactTable({
    data: tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (loading) {
    return <div className={styles.loading}><Spinner size={32} /><p>{STRINGS.actions.loading}</p></div>;
  }
  if (error || !scat) {
    return <ErrorState message={error ?? STRINGS.scats.detalhe.semValor} onRetry={reload} />;
  }

  const responsavel = refs.users.find(u => u.id === scat.responsavelId);
  const solicitante = refs.users.find(u => u.id === scat.solicitanteId);
  const cliente = refs.clients.find(c => c.id === scat.clienteId);
  const sistema = refs.systems.find(s => s.id === scat.sistemaId);
  const setor = refs.sectors.find(s => s.id === scat.setorId);

  const S = STRINGS.scats.detalhe;
  const statusCfg = SCAT_STATUS_CONFIG[scat.status];
  const prioCfg = PRIORIDADE_CONFIG[scat.prioridade];

  return (
    <div className={styles.root}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link href={ROUTES.SCATS}>
          <Button variant="ghost" size="sm" iconLeft={<ChevronLeft size={14} />}>
            {STRINGS.actions.back}
          </Button>
        </Link>
        <span className={styles.breadcrumbSep}>/</span>
        <span className={styles.breadcrumbCurrent}>{scat.numero}</span>
      </div>

      <div className={styles.content}>
        {/* Header da SCAT */}
        <div className={styles.scatHeader}>
          <div className={styles.scatHeaderTop}>
            <div className={styles.scatBadges}>
              <ScatStatusBadge status={scat.status} />
              <PriorityBadge prioridade={scat.prioridade} />
            </div>
            <span className={styles.scatNumero}>{scat.numero}</span>
          </div>
          <h1 className={styles.scatTitulo}>{scat.titulo}</h1>
          <p className={styles.scatDesc}>{scat.descricao}</p>
          <ProgressBar value={scat.progresso} total={scat.totalTarefas} done={scat.tarefasConcluidas} />
        </div>

        {/* Info grid */}
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <h3 className={styles.infoCardTitle}>Informações</h3>
            {cliente && <InfoItem label={S.cliente} value={cliente.nome} />}
            {sistema && <InfoItem label={S.sistema} value={sistema.nome} />}
            {setor   && <InfoItem label={S.setor}   value={setor.nome} />}
            <InfoItem label={S.tipoSolicitacao} value={scat.tipoSolicitacao} />
          </div>
          <div className={styles.infoCard}>
            <h3 className={styles.infoCardTitle}>Responsáveis</h3>
            {responsavel && (
              <InfoItem label={S.responsavel} value={
                <UserAvatar
                  nome={responsavel.nome}
                  iniciais={responsavel.nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                  showName size="sm"
                />
              } />
            )}
            {solicitante && (
              <InfoItem label={S.solicitante} value={solicitante.nome} />
            )}
          </div>
          <div className={styles.infoCard}>
            <h3 className={styles.infoCardTitle}>Datas</h3>
            <InfoItem label={S.abertura}  value={formatDate(scat.dataAbertura)} />
            <InfoItem label={S.previsao}  value={formatDate(scat.dataPrevisao)} />
            {scat.dataConclusao && (
              <InfoItem label={S.conclusao} value={formatDate(scat.dataConclusao)} />
            )}
          </div>
        </div>

        {/* Tarefas */}
        <div className={styles.tarefasSection}>
          <div className={styles.tarefasSectionHeader}>
            <h2 className={styles.tarefasSectionTitle}>{S.tarefas}</h2>
            <span className={styles.tarefasCount}>{tasks.length} tarefa{tasks.length !== 1 ? 's' : ''}</span>
          </div>

          {tasks.length === 0 ? (
            <EmptyState title={S.semTarefas} />
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  {table.getHeaderGroups().map(hg => (
                    <tr key={hg.id}>
                      {hg.headers.map(h => (
                        <th key={h.id} className={styles.th} style={{ width: h.column.columnDef.size }}>
                          {flexRender(h.column.columnDef.header, h.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id} className={`${styles.tr} ${row.original.comErro ? styles.trErro : ''}`}
                      onClick={() => handleTaskClick(row.original)}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className={styles.td}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <TaskModal task={selectedTask} isOpen={isDrawerOpen} onClose={handleDrawerClose} />
    </div>
  );
}
