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

/* ─────────────────────────────────────────
   Card estático — usado no DragOverlay
───────────────────────────────────────── */
function StaticCard({ task, overlay }: { task: Task; overlay?: boolean }) {
  const cfg = TASK_STATUS_CONFIG[task.status];
  return (
    <div
      className={overlay ? styles.cardOverlay : styles.card}
      style={{ borderLeftColor: cfg.border }}
    >
      <div className={styles.cardHead}>
        <span className={styles.cardId}>#{task.id}</span>
        <span className={styles.cardScat}>{task.scatNumero}</span>
      </div>
      <p className={styles.cardDesc}>{task.descricao}</p>
      <div className={styles.cardFoot}>
        <UserAvatar nome={task.responsavel.nome} iniciais={task.responsavel.iniciais} size="sm" />
        {task.horas > 0 && <span className={styles.cardMeta}>{formatHours(task.horas)}</span>}
        {task.terminoPrevisto && (
          <span className={styles.cardMeta}>{formatDate(task.terminoPrevisto)}</span>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Card arrastável — useSortable
───────────────────────────────────────── */
function DraggableCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const cfg = TASK_STATUS_CONFIG[task.status];
  const {
    attributes, listeners, setNodeRef,
    transform, transition, isDragging,
  } = useSortable({ id: task.id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`${styles.card} ${isDragging ? styles.cardDragging : ''}`}
      style={{
        borderLeftColor: cfg.border,
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      onClick={e => { if (!isDragging) { e.stopPropagation(); onClick(); } }}
    >
      <div className={styles.cardHead}>
        <span className={styles.cardId}>#{task.id}</span>
        <span className={styles.cardScat}>{task.scatNumero}</span>
      </div>
      <p className={styles.cardDesc}>{task.descricao}</p>
      <div className={styles.cardFoot}>
        <UserAvatar nome={task.responsavel.nome} iniciais={task.responsavel.iniciais} size="sm" />
        {task.horas > 0 && <span className={styles.cardMeta}>{formatHours(task.horas)}</span>}
        {task.terminoPrevisto && (
          <span className={styles.cardMeta}>{formatDate(task.terminoPrevisto)}</span>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Coluna — useDroppable + SortableContext
───────────────────────────────────────── */
function KanbanColumn({
  status, tasks, activeId, onCardClick,
}: {
  status: TaskStatus;
  tasks: Task[];
  activeId: number | null;
  onCardClick: (t: Task) => void;
}) {
  const cfg = TASK_STATUS_CONFIG[status];
  const { setNodeRef, isOver } = useDroppable({ id: status });

  // mostra placeholder quando arrasta de outra coluna
  const draggingFromOther = activeId !== null && !tasks.find(t => t.id === activeId);

  return (
    <div className={`${styles.column} ${isOver ? styles.columnOver : ''}`}>
      <div className={styles.colHeader} style={{ borderBottomColor: cfg.border }}>
        <span className={styles.colTitle}>{cfg.label}</span>
        <span className={styles.colCount} style={{ background: cfg.bg, color: cfg.text }}>
          {tasks.length}
        </span>
      </div>

      <div ref={setNodeRef} className={styles.colBody}>
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {/* placeholder no topo quando hovering de outra coluna */}
          {isOver && draggingFromOther && (
            <div className={styles.dropPlaceholder} />
          )}

          {tasks.length === 0 && !isOver && (
            <div className={styles.colEmpty}>Sem tarefas</div>
          )}

          {tasks.map(t => (
            <DraggableCard key={t.id} task={t} onClick={() => onCardClick(t)} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Kanban principal
───────────────────────────────────────── */
interface TaskKanbanProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onStatusChange: (taskId: number, status: TaskStatus) => Promise<void>;
}

export function TaskKanban({ tasks: propTasks, onTaskClick, onStatusChange }: TaskKanbanProps) {
  const [localTasks, setLocalTasks] = useState<Task[]>(propTasks);
  const [activeId, setActiveId]     = useState<number | null>(null);
  const [search, setSearch]         = useState('');
  const debouncedSearch             = useDebounce(search, 300);
  const { activeFiltersCount, openModal } = useTaskFiltersContext();
  const { toast } = useToast();

  // sincroniza quando as props mudam (filtros, reload)
  useEffect(() => { setLocalTasks(propTasks); }, [propTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
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

  const activeTask = useMemo(
    () => localTasks.find(t => t.id === activeId) ?? null,
    [localTasks, activeId],
  );

  /* ── Helpers ── */
  function taskStatus(id: number): TaskStatus | null {
    return localTasks.find(t => t.id === id)?.status ?? null;
  }

  function resolveStatus(overId: string | number): TaskStatus | null {
    const asStr = String(overId);
    if (TASK_STATUS_ORDER.includes(asStr as TaskStatus)) return asStr as TaskStatus;
    const overTask = localTasks.find(t => t.id === Number(overId));
    return overTask?.status ?? null;
  }

  /* ── Drag start ── */
  function handleDragStart(e: DragStartEvent) {
    setActiveId(Number(e.active.id));
  }

  /* ── Drag over — move card em real-time ── */
  const handleDragOver = useCallback((e: DragOverEvent) => {
    const { active, over } = e;
    if (!over) return;

    const dragId   = Number(active.id);
    const newStatus = resolveStatus(over.id);
    if (!newStatus) return;

    const current = taskStatus(dragId);
    if (current === newStatus) return;

    setLocalTasks(prev =>
      prev.map(t => t.id === dragId ? { ...t, status: newStatus } : t),
    );
  }, [localTasks]);

  /* ── Drag end — persiste ── */
  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    setActiveId(null);
    if (!over) {
      setLocalTasks(propTasks); // revert
      return;
    }

    const dragId    = Number(active.id);
    const newStatus = resolveStatus(over.id);
    if (!newStatus) { setLocalTasks(propTasks); return; }

    const original = propTasks.find(t => t.id === dragId);
    if (!original) return;

    if (original.status !== newStatus) {
      const cfg = TASK_STATUS_CONFIG[newStatus];
      onStatusChange(dragId, newStatus)
        .then(() => toast.success(STRINGS.tarefas.kanban.statusAtualizado(cfg.label)))
        .catch(() => {
          toast.error(STRINGS.tarefas.kanban.erroAtualizar);
          setLocalTasks(propTasks);
        });
    }
  }

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
        <Button variant="secondary" size="sm" iconLeft={<Filter size={14} />} onClick={openModal}>
          {STRINGS.tarefas.toolbar.filtros}
          {activeFiltersCount > 0 && <span className={styles.badge}>{activeFiltersCount}</span>}
        </Button>
      </div>

      {/* Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className={styles.board}>
          {TASK_STATUS_ORDER.map(status => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={byStatus.get(status) ?? []}
              activeId={activeId}
              onCardClick={onTaskClick}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={{
          duration: 200,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}>
          {activeTask && <StaticCard task={activeTask} overlay />}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
