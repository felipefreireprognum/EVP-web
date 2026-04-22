import type { TaskStatus } from '@/src/types/task';

export const TASK_STATUS_CONFIG: Record<TaskStatus, {
  label: string;
  bg: string;
  text: string;
  border: string;
}> = {
  disponivel: {
    label:  'Disponível',
    bg:     'var(--color-status-disponivel-bg)',
    text:   'var(--color-status-disponivel-text)',
    border: 'var(--color-status-disponivel-border)',
  },
  em_andamento: {
    label:  'Em Andamento',
    bg:     'var(--color-status-em-andamento-bg)',
    text:   'var(--color-status-em-andamento-text)',
    border: 'var(--color-status-em-andamento-border)',
  },
  em_pausa: {
    label:  'Em Pausa',
    bg:     'var(--color-status-em-pausa-bg)',
    text:   'var(--color-status-em-pausa-text)',
    border: 'var(--color-status-em-pausa-border)',
  },
  vencida: {
    label:  'Vencida',
    bg:     'var(--color-status-vencida-bg)',
    text:   'var(--color-status-vencida-text)',
    border: 'var(--color-status-vencida-border)',
  },
  concluida: {
    label:  'Concluída',
    bg:     'var(--color-status-concluida-bg)',
    text:   'var(--color-status-concluida-text)',
    border: 'var(--color-status-concluida-border)',
  },
};

export const TASK_STATUS_ORDER: TaskStatus[] = [
  'disponivel', 'em_andamento', 'em_pausa', 'vencida', 'concluida',
];

export const SCAT_STATUS_CONFIG = {
  aberta:       { label: 'Aberta',       bg: 'var(--color-scat-aberta-bg)',       text: 'var(--color-scat-aberta-text)' },
  em_andamento: { label: 'Em Andamento', bg: 'var(--color-scat-em-andamento-bg)', text: 'var(--color-scat-em-andamento-text)' },
  aguardando:   { label: 'Aguardando',   bg: 'var(--color-scat-aguardando-bg)',   text: 'var(--color-scat-aguardando-text)' },
  concluida:    { label: 'Concluída',    bg: 'var(--color-scat-concluida-bg)',    text: 'var(--color-scat-concluida-text)' },
  cancelada:    { label: 'Cancelada',    bg: 'var(--color-scat-cancelada-bg)',    text: 'var(--color-scat-cancelada-text)' },
};

export const PRIORIDADE_CONFIG = {
  baixa:   { label: 'Baixa',   bg: 'var(--color-prio-baixa-bg)',   text: 'var(--color-prio-baixa-text)' },
  normal:  { label: 'Normal',  bg: 'var(--color-prio-normal-bg)',  text: 'var(--color-prio-normal-text)' },
  alta:    { label: 'Alta',    bg: 'var(--color-prio-alta-bg)',    text: 'var(--color-prio-alta-text)' },
  urgente: { label: 'Urgente', bg: 'var(--color-prio-urgente-bg)', text: 'var(--color-prio-urgente-text)' },
};
