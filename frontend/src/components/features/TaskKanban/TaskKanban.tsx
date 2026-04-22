'use client';
import { useMemo, useState, useEffect, useCallback } from 'react';
import {
  DndContext, closestCenter, DragOverlay,
  PointerSensor, useSensor, useSensors,
  useDroppable,
  type DragStartEvent, type DragEndEvent, type DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext, useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Filter, Search } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { ViewToggle } from '@/src/components/shared/ViewToggle';
import { UserAvatar } from '@/src/components/shared/UserAvatar';
import { useTaskFiltersContext } from '@/src/contexts/TaskFiltersContext';
import { useToast } from '@/src/contexts/ToastContext';
import { useDebounce } from '@/src/hooks/shared/useDebounce';
import { TASK_STATUS_CONFIG, TASK_STATUS_ORDER } from '@/src/constants/taskStatus';
import { STRINGS } from '@/src/constants/strings';
import { formatDate, formatHours } from '@/src/utils/formatters/date';
import type { Task, TaskStatus } from '@/src/types/task';
import styles from './TaskKanban.module.css';

/* ── Card estático (DragOverlay) ── */
function StaticCard({ task }: { task: Task }) {
  const cfg = TASK_STATUS_CONFIG[task.status];
  return (
    <div className={styles.cardOverlay} style={{ borderLeftColor: cfg.border }}>
      <div className={styles.cardHead}>
        <span className={styles.cardId}>#{task.id}</span>
        <span className={styles.cardScat}>{task.scatNumero}</span>
      </div>
      <p className={styles.cardDesc}>{task.descricao}</p>
      <div className={styles.cardFoot}>
        <UserAvatar nome={task.responsavel.nome} iniciais={task.responsavel.iniciais} size="sm" />
        {task.horas > 0 && <span className={styles.cardMeta}>{formatHours(task.horas)}</span>}
        {task.terminoPrevisto && <span className={styles.cardMeta}>{formatDate(task.terminoPrevisto)}</span>}
      </div>
    </div>
  );
}

/* ── Card arrastável ── */
function DraggableCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const cfg = TASK_STATUS_CONFIG[task.status];
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`${styles.card} ${isDragging ? styles.cardDragging : ''}`}
      style={{
        borderLeftColor: cfg.border,
        transform: CSS.Transform.toString(transform),
        transition: transition ?? undefined,
      }}
      onClick={e => { e.stopPropagation(); onClick(); }}
    >
      <div className={styles.cardHead}>
        <span className={styles.cardId}>#{task.id}</span>
        <span className={styles.cardScat}>{task.scatNumero}</span>
      </div>
      <p className={styles.cardDesc}>{task.descricao}</p>
      <div className={styles.cardFoot}>
        <UserAvatar nome={task.responsavel.nome} iniciais={task.responsavel.iniciais} size="sm" />
        {task.horas > 0 && <span className={styles.cardMeta}>{formatHours(task.horas)}</span>}
        {task.terminoPrevisto && <span className={styles.cardMeta}>{formatDate(task.terminoPrevisto)}</span>}
      </div>
    </div>
  );
}

/* ── Coluna ── */
function KanbanColumn({
  status, tasks, activeId, onCardClick,
}: {
  status: TaskStatus; tasks: Task[]; activeId: number | null; onCardClick: (t: Task) => void;
}) {
  const cfg = TASK_STATUS_CONFIG[status];
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const draggingFromElsewhere = activeId !== null && !tasks.find(t => t.id === activeId);

  return (
    <div className={`${styles.column} ${isOver && draggingFromElsewhere ? styles.columnOver : ''}`}>
      {/* Cabeçalho */}
      <div className={styles.colHeader}>
        <div className={styles.colAccent} style={{ background: cfg.border }} />
        <span className={styles.colTitle}>{cfg.label}</span>
        <span className={styles.colCount} style={{ background: cfg.bg, color: cfg.text }}>
          {tasks.length}
        </span>
      </div>

      {/* Lista */}
      <div ref={setNodeRef} className={styles.colBody}>
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 && !isOver && (
            <div className={styles.colEmpty}>Solte aqui</div>
          )}
          {tasks.map(t => (
            <DraggableCard key={t.id} task={t} onClick={() => onCardClick(t)} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

/* ── Kanban ── */
interface Props {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onStatusChange: (taskId: number, status: TaskStatus) => Promise<void>;
}

export function TaskKanban({ tasks: propTasks, onTaskClick, onStatusChange }: Props) {
  const [localTasks, setLocalTasks] = useState<Task[]>(propTasks);
  const [activeId, setActiveId]     = useState<number | null>(null);
  const [search, setSearch]         = useState('');
  const debouncedSearch             = useDebounce(search, 300);
  const { activeFiltersCount, openModal } = useTaskFiltersContext();
  const { toast } = useToast();

  useEffect(() => { setLocalTasks(propTasks); }, [propTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const filtered = useMemo(() =>
    debouncedSearch
      ? localTasks.filter(t => t.descricao.toLowerCase().includes(debouncedSearch.toLowerCase()))
      : localTasks,
    [localTasks, debouncedSearch],
  );

  const byStatus = useMemo(() => {
    const map = new Map<TaskStatus, Task[]>();
    TASK_STATUS_ORDER.forEach(s => map.set(s, []));
    filtered.forEach(t => map.get(t.status)?.push(t));
    return map;
  }, [filtered]);

  const activeTask = useMemo(() => localTasks.find(t => t.id === activeId) ?? null, [localTasks, activeId]);

  /* Ao entrar numa coluna/card, reposiciona o card no array local */
  const handleDragOver = useCallback((e: DragOverEvent) => {
    const { active, over } = e;
    if (!over) return;

    const dragId      = Number(active.id);
    const overId      = over.id;
    const isOverCol   = TASK_STATUS_ORDER.includes(String(overId) as TaskStatus);
    const overTask    = !isOverCol ? localTasks.find(t => t.id === Number(overId)) : null;
    const newStatus   = isOverCol ? (String(overId) as TaskStatus) : overTask?.status;

    if (!newStatus) return;

    const activeTask = localTasks.find(t => t.id === dragId);
    if (!activeTask) return;
    if (activeTask.status === newStatus && (!overTask || overTask.id === dragId)) return;

    setLocalTasks(prev => {
      const without = prev.filter(t => t.id !== dragId);
      const updated  = { ...activeTask, status: newStatus };

      if (isOverCol) {
        // Entra na coluna → vai para o TOPO (posição 0) e empurra os demais
        const firstIdx = without.findIndex(t => t.status === newStatus);
        if (firstIdx === -1) return [...without, updated];
        return [...without.slice(0, firstIdx), updated, ...without.slice(firstIdx)];
      }

      if (overTask && overTask.id !== dragId) {
        // Passa por cima de um card → insere antes dele
        const overIdx = without.findIndex(t => t.id === overTask.id);
        return [...without.slice(0, overIdx), updated, ...without.slice(overIdx)];
      }

      return prev;
    });
  }, [localTasks]);

  function handleDragStart(e: DragStartEvent) {
    setActiveId(Number(e.active.id));
  }

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    setActiveId(null);

    if (!over) { setLocalTasks(propTasks); return; }

    const dragId    = Number(active.id);
    const overId    = over.id;
    const isOverCol = TASK_STATUS_ORDER.includes(String(overId) as TaskStatus);
    const overTask  = !isOverCol ? localTasks.find(t => t.id === Number(overId)) : null;
    const newStatus = isOverCol ? (String(overId) as TaskStatus) : overTask?.status;

    if (!newStatus) { setLocalTasks(propTasks); return; }

    const original = propTasks.find(t => t.id === dragId);
    if (!original) return;

    if (original.status !== newStatus) {
      const cfg = TASK_STATUS_CONFIG[newStatus];
      onStatusChange(dragId, newStatus)
        .then(() => toast.success(STRINGS.tarefas.kanban.statusAtualizado(cfg.label)))
        .catch(() => { toast.error(STRINGS.tarefas.kanban.erroAtualizar); setLocalTasks(propTasks); });
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <ViewToggle />
          <div className={styles.searchWrap}>
            <Input iconLeft={<Search size={14} />} placeholder={STRINGS.tarefas.toolbar.busca}
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <Button variant="secondary" size="sm" iconLeft={<Filter size={14} />} onClick={openModal}>
          {STRINGS.tarefas.toolbar.filtros}
          {activeFiltersCount > 0 && <span className={styles.badge}>{activeFiltersCount}</span>}
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter}
        onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <div className={styles.board}>
          {TASK_STATUS_ORDER.map(status => (
            <KanbanColumn key={status} status={status}
              tasks={byStatus.get(status) ?? []} activeId={activeId} onCardClick={onTaskClick} />
          ))}
        </div>

        <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.2, 0, 0, 1)' }}>
          {activeTask && <StaticCard task={activeTask} />}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
