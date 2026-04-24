'use client';
import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  flexRender, type ColumnDef, type SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { TaskStatusBadge } from '@/src/components/shared/StatusBadge';
import { UserAvatar } from '@/src/components/shared/UserAvatar';
import { EmptyState } from '@/src/components/shared/EmptyState';
import { formatDate, formatHours } from '@/src/utils/formatters/date';
import type { Task } from '@/src/types/task';
import styles from './Tab.module.css';

interface Props {
  tasks:       Task[];
  onTaskClick: (t: Task) => void;
}

export function TabTarefas({ tasks, onTaskClick }: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<Task>[] = [
    { id: 'id', accessorKey: 'id', header: '#', size: 60,
      cell: info => <span className={styles.idCell}>#{info.getValue<number>()}</span> },
    { id: 'descricao', accessorKey: 'descricao', header: 'Descrição',
      cell: info => <span className={styles.descCell}>{info.getValue<string>()}</span> },
    { id: 'status', accessorKey: 'status', header: 'Status', size: 140,
      cell: info => <TaskStatusBadge status={info.getValue<Task['status']>()} size="sm" /> },
    { id: 'responsavel', accessorFn: r => r.responsavel.nome, header: 'Responsável',
      cell: info => {
        const t = info.row.original;
        return <UserAvatar nome={t.responsavel.nome} iniciais={t.responsavel.iniciais} showName size="sm" />;
      }},
    { id: 'setor', accessorFn: r => r.setor.nome, header: 'Setor', size: 130 },
    { id: 'termino', accessorKey: 'terminoPrevisto', header: 'Previsão', size: 100,
      cell: info => formatDate(info.getValue<Date | null>()) },
    { id: 'horas', accessorKey: 'horas', header: 'Horas', size: 80,
      cell: info => formatHours(info.getValue<number>()) },
    { id: 'pontos', accessorKey: 'pontosPrevistos', header: 'PF', size: 60 },
  ];

  const table = useReactTable({
    data: tasks, columns, state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className={styles.root}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Tarefas vinculadas</h2>
          <p className={styles.sectionSub}>{tasks.length} tarefa{tasks.length !== 1 ? 's' : ''} nesta solicitação.</p>
        </div>
      </div>

      {tasks.length === 0 ? (
        <EmptyState title="Nenhuma tarefa vinculada" />
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id}>
                  {hg.headers.map(h => (
                    <th key={h.id} className={styles.th} style={{ width: h.column.columnDef.size }}
                      onClick={h.column.getToggleSortingHandler()}>
                      <span className={styles.thInner}>
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        {h.column.getCanSort() && <ArrowUpDown size={11} className={styles.sortIcon} />}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className={`${styles.tr} ${row.original.comErro ? styles.trErro : ''}`}
                  onClick={() => onTaskClick(row.original)}>
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
  );
}
