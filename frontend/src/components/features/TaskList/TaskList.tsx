'use client';
import { useState, useMemo, useRef } from 'react';
import {
  useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel,
  flexRender, type ColumnDef, type SortingState, type VisibilityState,
} from '@tanstack/react-table';
import { Search, Filter, Columns3, ChevronUp, ChevronDown, ChevronsUpDown,
  ChevronLeft, ChevronRight, AlertTriangle, Play, Pause, CheckCircle2 } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { TaskStatusBadge } from '@/src/components/shared/StatusBadge';
import { UserAvatar } from '@/src/components/shared/UserAvatar';
import { ViewToggle } from '@/src/components/shared/ViewToggle';
import { EmptyState } from '@/src/components/shared/EmptyState';
import { useTaskFiltersContext } from '@/src/contexts/TaskFiltersContext';
import { useDebounce } from '@/src/hooks/shared/useDebounce';
import { useIsMobile } from '@/src/hooks/shared/useIsMobile';
import { formatDate, formatHours } from '@/src/utils/formatters/date';
import { STRINGS } from '@/src/constants/strings';
import type { Task } from '@/src/types/task';
import styles from './TaskList.module.css';

interface TaskListProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onStatusChange?: (taskId: number, status: Task['status']) => Promise<void>;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export function TaskList({ tasks, onTaskClick, onStatusChange }: TaskListProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    sistema: false, inicio: false, terminadoEm: false, pontos: false,
  });
  const onStatusChangeRef = useRef(onStatusChange);
  onStatusChangeRef.current = onStatusChange;
  const [showColMenu, setShowColMenu] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const { activeFiltersCount, openModal } = useTaskFiltersContext();
  const isMobile = useIsMobile();

  const filtered = useMemo(() =>
    debouncedSearch
      ? tasks.filter(t => t.descricao.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          t.scatNumero.toLowerCase().includes(debouncedSearch.toLowerCase()))
      : tasks,
    [tasks, debouncedSearch]
  );

  const columns = useMemo((): ColumnDef<Task>[] => [
    { id: 'id', accessorKey: 'id', header: STRINGS.tarefas.colunas.id, size: 60,
      cell: info => <span className={styles.idCell}>#{info.getValue<number>()}</span> },
    { id: 'scat', accessorKey: 'scatNumero', header: STRINGS.tarefas.colunas.scat, size: 110,
      cell: info => <span className={styles.scatCell}>{info.getValue<string>()}</span> },
    { id: 'descricao', accessorKey: 'descricao', header: STRINGS.tarefas.colunas.descricao,
      cell: info => <span className={styles.descCell}>{info.getValue<string>()}</span> },
    { id: 'status', accessorKey: 'status', header: STRINGS.tarefas.colunas.status, size: 130,
      cell: info => <TaskStatusBadge status={info.getValue<Task['status']>()} size="sm" /> },
    { id: 'responsavel', accessorFn: r => r.responsavel.nome, header: STRINGS.tarefas.colunas.responsavel,
      cell: info => {
        const task = info.row.original;
        return <UserAvatar nome={task.responsavel.nome} iniciais={task.responsavel.iniciais} showName size="sm" />;
      }},
    { id: 'setor', accessorFn: r => r.setor.nome, header: STRINGS.tarefas.colunas.setor, size: 120 },
    { id: 'cliente', accessorFn: r => r.cliente.nome, header: STRINGS.tarefas.colunas.cliente, size: 160 },
    { id: 'sistema', accessorFn: r => r.sistema.nome, header: STRINGS.tarefas.colunas.sistema, size: 140 },
    { id: 'tipo', accessorKey: 'tipoTarefa', header: STRINGS.tarefas.colunas.tipo, size: 110 },
    { id: 'inicio', accessorKey: 'inicio', header: STRINGS.tarefas.colunas.inicio, size: 100,
      cell: info => formatDate(info.getValue<Date | null>()) },
    { id: 'termino', accessorKey: 'terminoPrevisto', header: STRINGS.tarefas.colunas.termino, size: 100,
      cell: info => formatDate(info.getValue<Date | null>()) },
    { id: 'terminadoEm', accessorKey: 'terminadoEm', header: STRINGS.tarefas.colunas.terminadoEm, size: 110,
      cell: info => formatDate(info.getValue<Date | null>()) },
    { id: 'horas', accessorKey: 'horas', header: STRINGS.tarefas.colunas.horas, size: 80,
      cell: info => formatHours(info.getValue<number>()) },
    { id: 'pontos', accessorKey: 'pontosPrevistos', header: STRINGS.tarefas.colunas.pontos, size: 70 },
    { id: 'acoes', header: '', size: 90, enableSorting: false,
      cell: info => {
        const t = info.row.original;
        const canStart  = t.status === 'disponivel' || t.status === 'em_pausa' || t.status === 'vencida';
        const canPause  = t.status === 'em_andamento';
        const canFinish = t.status !== 'concluida';
        return (
          <div className={styles.actionsCell} onClick={e => e.stopPropagation()}>
            {canStart && (
              <button className={`${styles.rowBtn} ${styles.rowBtnPlay}`}
                title={t.status === 'em_pausa' ? 'Retomar' : 'Iniciar'}
                onClick={() => onStatusChangeRef.current?.(t.id, 'em_andamento')}>
                <Play size={12} />
              </button>
            )}
            {canPause && (
              <button className={`${styles.rowBtn} ${styles.rowBtnPause}`}
                title="Pausar"
                onClick={() => onStatusChangeRef.current?.(t.id, 'em_pausa')}>
                <Pause size={12} />
              </button>
            )}
            {canFinish && (
              <button className={`${styles.rowBtn} ${styles.rowBtnFinish}`}
                title="Finalizar"
                onClick={() => onStatusChangeRef.current?.(t.id, 'concluida')}>
                <CheckCircle2 size={12} />
              </button>
            )}
          </div>
        );
      }
    },
  ], []);

  const mobileColumns = useMemo(() => columns.filter(c =>
    ['id','descricao','status','responsavel','termino'].includes(c.id as string)
  ), [columns]);

  const table = useReactTable({
    data: filtered,
    columns: isMobile ? mobileColumns : columns,
    state: { sorting, columnVisibility },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } },
  });

  return (
    <div className={styles.root}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <ViewToggle />
          <div className={styles.searchWrap}>
            <Input
              iconLeft={<Search size={14} />}
              placeholder={STRINGS.tarefas.toolbar.busca}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.toolbarRight}>
          <Button
            variant="secondary"
            size="sm"
            iconLeft={<Filter size={14} />}
            onClick={openModal}
          >
            {STRINGS.tarefas.toolbar.filtros}
            {activeFiltersCount > 0 && (
              <span className={styles.badge}>{activeFiltersCount}</span>
            )}
          </Button>
          {!isMobile && (
            <div className={styles.colMenuWrap}>
              <Button variant="secondary" size="sm" iconLeft={<Columns3 size={14} />}
                onClick={() => setShowColMenu(p => !p)}>
                {STRINGS.tarefas.toolbar.colunas}
              </Button>
              {showColMenu && (
                <div className={styles.colMenu}>
                  {table.getAllLeafColumns().map(col => (
                    <label key={col.id} className={styles.colOption}>
                      <input type="checkbox" checked={col.getIsVisible()}
                        onChange={col.getToggleVisibilityHandler()} />
                      {col.columnDef.header as string}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(h => (
                  <th key={h.id} className={styles.th} style={{ width: h.column.columnDef.size }}
                    onClick={h.column.getCanSort() ? h.column.getToggleSortingHandler() : undefined}>
                    <div className={styles.thInner}>
                      <span>{flexRender(h.column.columnDef.header, h.getContext())}</span>
                      {h.column.getCanSort() && (
                        <span className={styles.sortIcon}>
                          {h.column.getIsSorted() === 'asc'  ? <ChevronUp size={12} /> :
                           h.column.getIsSorted() === 'desc' ? <ChevronDown size={12} /> :
                           <ChevronsUpDown size={12} className={styles.sortIconInactive} />}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr><td colSpan={999}>
                <EmptyState title={STRINGS.tarefas.lista.emptyFiltros} />
              </td></tr>
            ) : table.getRowModel().rows.map(row => (
              <tr key={row.id}
                className={`${styles.tr} ${row.original.comErro ? styles.trErro : ''} ${row.original.excluida ? styles.trExcluida : ''}`}
                onClick={() => onTaskClick(row.original)}
              >
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

      {/* Pagination */}
      <div className={styles.pagination}>
        <span className={styles.pgInfo}>
          {filtered.length} tarefa{filtered.length !== 1 ? 's' : ''}
          {' · '}Página {table.getState().pagination.pageIndex + 1} de {Math.max(1, table.getPageCount())}
        </span>
        <div className={styles.pgControls}>
          <select
            className={styles.pgSelect}
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
          >
            {PAGE_SIZE_OPTIONS.map(s => (
              <option key={s} value={s}>{s} por página</option>
            ))}
          </select>
          <Button variant="secondary" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronLeft size={14} />
          </Button>
          <Button variant="secondary" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
