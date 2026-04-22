import { Badge } from '@/src/components/ui/Badge';
import { TASK_STATUS_CONFIG, SCAT_STATUS_CONFIG, PRIORIDADE_CONFIG } from '@/src/constants/taskStatus';
import type { TaskStatus } from '@/src/types/task';
import type { ScatAPI } from '@/src/types/scat';

interface TaskStatusBadgeProps { status: TaskStatus; size?: 'sm' | 'md'; }
interface ScatStatusBadgeProps { status: ScatAPI['status']; size?: 'sm' | 'md'; }
interface PriorityBadgeProps  { prioridade: ScatAPI['prioridade']; size?: 'sm' | 'md'; }

export function TaskStatusBadge({ status, size }: TaskStatusBadgeProps) {
  const cfg = TASK_STATUS_CONFIG[status];
  return <Badge label={cfg.label} bg={cfg.bg} color={cfg.text} border={cfg.border} size={size} />;
}

export function ScatStatusBadge({ status, size }: ScatStatusBadgeProps) {
  const cfg = SCAT_STATUS_CONFIG[status];
  return <Badge label={cfg.label} bg={cfg.bg} color={cfg.text} size={size} />;
}

export function PriorityBadge({ prioridade, size }: PriorityBadgeProps) {
  const cfg = PRIORIDADE_CONFIG[prioridade];
  return <Badge label={cfg.label} bg={cfg.bg} color={cfg.text} size={size} />;
}
