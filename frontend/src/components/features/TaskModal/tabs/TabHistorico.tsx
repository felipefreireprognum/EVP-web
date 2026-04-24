'use client';
import { Play, Pause, CheckCircle2, Clock } from 'lucide-react';
import { format, differenceInMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Task, TimerEvent } from '@/src/types/task';
import styles from './TabHistorico.module.css';

const EVENT_CONFIG = {
  iniciar:   { Icon: Play,         label: 'Iniciada',   mod: styles.dotIniciar },
  pausar:    { Icon: Pause,        label: 'Pausada',    mod: styles.dotPausar },
  finalizar: { Icon: CheckCircle2, label: 'Finalizada', mod: styles.dotFinalizar },
} as const;

function calcDuration(events: TimerEvent[], idx: number): string | null {
  const cur = events[idx];
  const next = events[idx + 1];
  if (cur.type !== 'iniciar' || !next) return null;
  const mins = differenceInMinutes(next.timestamp, cur.timestamp);
  if (mins < 1) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}min` : `${m}min`;
}

interface Props {
  task:         Task;
  timerEvents:  TimerEvent[];
}

export function TabHistorico({ task, timerEvents }: Props) {
  if (timerEvents.length === 0) {
    return (
      <div className={styles.root}>
        <div className={styles.empty}>
          <Clock size={32} className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>Nenhum registro ainda</p>
          <p className={styles.emptySub}>
            Use os botões Iniciar, Pausar ou Finalizar para começar a registrar o histórico desta tarefa.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.topBar}>
        <Clock size={13} className={styles.topBarIcon} />
        <span className={styles.topBarLabel}>Tarefa #{task.id} · {task.scatNumero}</span>
        <span className={styles.eventCount}>{timerEvents.length} evento{timerEvents.length !== 1 ? 's' : ''}</span>
      </div>

      <div className={styles.timeline}>
        {timerEvents.map((ev, i) => {
          const { Icon, label, mod } = EVENT_CONFIG[ev.type];
          const duration = calcDuration(timerEvents, i);
          const dateStr  = format(ev.timestamp, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
          const timeStr  = format(ev.timestamp, 'HH:mm', { locale: ptBR });
          const isLast   = i === timerEvents.length - 1;

          return (
            <div key={i} className={styles.item}>
              <div className={styles.dotCol}>
                <div className={`${styles.dot} ${mod}`}>
                  <Icon size={10} />
                </div>
                {!isLast && <div className={styles.line} />}
              </div>

              <div className={`${styles.card} ${isLast ? styles.cardLast : ''}`}>
                <div className={styles.cardTop}>
                  <span className={`${styles.cardLabel} ${mod}Text`}>{label}</span>
                  <span className={styles.cardTime}>{timeStr}</span>
                </div>
                <span className={styles.cardDate}>{dateStr}</span>
                {duration && (
                  <span className={styles.cardDuration}>
                    Duração até próximo evento: <strong>{duration}</strong>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
