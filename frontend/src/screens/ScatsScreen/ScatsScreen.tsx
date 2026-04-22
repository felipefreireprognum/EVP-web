'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel,
  flexRender, type ColumnDef, type SortingState,
} from '@tanstack/react-table';
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/src/components/ui/Input';
import { Spinner } from '@/src/components/ui/Spinner';
import { ScatStatusBadge, PriorityBadge } from '@/src/components/shared/StatusBadge';
import { UserAvatar } from '@/src/components/shared/UserAvatar';
import { EmptyState } from '@/src/components/shared/EmptyState';
import { ErrorState } from '@/src/components/shared/ErrorState';
import { useScatsScreen } from '@/src/hooks/scats/useScatsScreen';
import { useDebounce } from '@/src/hooks/shared/useDebounce';
import { useIsMobile } from '@/src/hooks/shared/useIsMobile';
import { mockApi } from '@/src/services/mockApi';
import { formatDate } from '@/src/utils/formatters/date';
import { STRINGS } from '@/src/constants/strings';
import { ROUTES } from '@/src/constants/routes';
import type { Scat } from '@/src/types/scat';
import styles from './ScatsScreen.module.css';

function ProgressBar({ value }: { value: number }) {
  return (
    <div className={styles.progBar}>
      <div><div className={styles.progFill} style={{ width: `${value}%` }} /></div>
      <span className={styles.progLabel}>{value}%</span>
    </div>
  );
}

export function ScatsScreen() {
  const { scats, loading, error, reload } = useScatsScreen();
  const [search, setSearch] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const debouncedSearch = useDebounce(search, 300);
  const isMobile = useIsMobile();

  const refs = mockApi.refs;

  const filtered = useMemo(() =>
    debouncedSearch
      ? scats.filter(s => s.titulo.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          s.numero.toLowerCase().includes(debouncedSearch.toLowerCase()))
      : scats,
    [scats, debouncedSearch]
  );

  const columns = useMemo((): ColumnDef<Scat>[] => [
    {
      id: 'numero', accessorKey: 'numero',
      header: STRINGS.scats.colunas.numero, size: 110,
      cell: info => (
        <Link href={ROUTES.SCAT_DETAIL(info.row.original.id)} className={styles.scatLink}>
          {info.getValue<string>()}
        </Link>
      ),
    },
    {
      id: 'titulo', accessorKey: 'titulo',
      header: STRINGS.scats.colunas.titulo,
      cell: info => <span className={styles.titleCell}>{info.getValue<string>()}</span>,
    },
    {
      id: 'status', accessorKey: 'status',
      header: STRINGS.scats.colunas.status, size: 120,
      cell: info => <ScatStatusBadge status={info.getValue<Scat['status']>()} size="sm" />,
    },
    {
      id: 'prioridade', accessorKey: 'prioridade',
      header: STRINGS.scats.colunas.prioridade, size: 100,
      cell: info => <PriorityBadge prioridade={info.getValue<Scat['prioridade']>()} size="sm" />,
    },
    {
      id: 'cliente', accessorFn: r => refs.clients.find(c => c.id === r.clienteId)?.nome ?? '—',
      header: STRINGS.scats.colunas.cliente, size: 160,
    },
    {
      id: 'responsavel', accessorFn: r => refs.users.find(u => u.id === r.responsavelId)?.nome ?? '—',
      header: STRINGS.scats.colunas.responsavel, size: 160,
      cell: info => {
        const user = refs.users.find(u => u.id === info.row.original.responsavelId);
        if (!user) return '—';
        const iniciais = user.nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
        return <UserAvatar nome={user.nome} iniciais={iniciais} showName size="sm" />;
      },
    },
    {
      id: 'abertura', accessorKey: 'dataAbertura',
      header: STRINGS.scats.colunas.abertura, size: 100,
      cell: info => formatDate(info.getValue<Date>()),
    },
    {
      id: 'previsao', accessorKey: 'dataPrevisao',
      header: STRINGS.scats.colunas.previsao, size: 100,
      cell: info => formatDate(info.getValue<Date | null>()),
    },
    {
      id: 'progresso', accessorKey: 'progresso',
      header: STRINGS.scats.colunas.progresso, size: 140,
      cell: info => <ProgressBar value={info.getValue<number>()} />,
    },
  ], [refs]);

  const mobileColumns = useMemo(() =>
    columns.filter(c => ['numero','titulo','status','progresso'].includes(c.id as string)),
    [columns]
  );

  const table = useReactTable({
    data: filtered,
    columns: isMobile ? mobileColumns : columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } },
  });

  if (loading) {
    return <div className={styles.loading}><Spinner size={32} /><p>{STRINGS.actions.loading}</p></div>;
  }
  if (error) {
    return <ErrorState message={error} onRetry={reload} />;
  }

  return (
    <div className={styles.root}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>{STRINGS.scats.titulo}</h1>
          <p className={styles.pageSubtitle}>{scats.length} solicitações cadastradas</p>
        </div>
        <div className={styles.searchWrap}>
          <Input
            iconLeft={<Search size={14} />}
            placeholder={STRINGS.scats.toolbar.busca}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableCard}>
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
                          {h.column.getIsSorted() === 'asc' ? <ChevronUp size={12} /> :
                           h.column.getIsSorted() === 'desc' ? <ChevronDown size={12} /> :
                           <ChevronsUpDown size={12} className={styles.sortInactive} />}
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
              <tr><td colSpan={999}><EmptyState title={STRINGS.scats.empty} /></td></tr>
            ) : table.getRowModel().rows.map(row => (
              <tr key={row.id} className={styles.tr}
                onClick={() => window.location.href = ROUTES.SCAT_DETAIL(row.original.id)}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className={styles.td}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>{/* /tableWrap */}

      {/* Pagination */}
      <div className={styles.pagination}>
        <span className={styles.pgInfo}>
          {filtered.length} SCAT{filtered.length !== 1 ? 's' : ''}
          {' · '}Página {table.getState().pagination.pageIndex + 1} de {Math.max(1, table.getPageCount())}
        </span>
        <div className={styles.pgControls}>
          <button className={styles.pgBtn} onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronLeft size={14} />
          </button>
          <button className={styles.pgBtn} onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
      </div>{/* /tableCard */}
    </div>
  );
}
