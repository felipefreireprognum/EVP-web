'use client';
import { useState, useEffect, useRef } from 'react';
import { Play, Square } from 'lucide-react';
import { format, addMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Task } from '@/src/types/task';
import styles from './TabTimesheet.module.css';

interface TimesheetEntry {
  data:    string;
  inicio:  string;
  fim:     string;
  durMin:  number;
}

function fmtSecs(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map(v => String(v).padStart(2, '0')).join(':');
}

function fmtDur(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

function mockEntries(task: Task): TimesheetEntry[] {
  if (task.horas === 0) return [];
  const totalMin = Math.round(task.horas * 60);
  const seed = task.id;
  const entries: TimesheetEntry[] = [];
  let remaining = totalMin;
  const base = task.inicio ? new Date(task.inicio) : new Date(Date.now() - 10 * 86400000);

  for (let i = 0; remaining > 0 && i < 6; i++) {
    const dur = Math.min(remaining, 90 + ((seed + i * 37) % 120));
    const dayOffset = i * 86400000;
    const startHour = 8 + (i % 3) * 3;
    const startDt = new Date(base.getTime() + dayOffset);
    startDt.setHours(startHour, 0, 0, 0);
    const endDt = addMinutes(startDt, dur);
    entries.push({
      data:   format(startDt, 'dd/MM/yyyy', { locale: ptBR }),
      inicio: format(startDt, 'HH:mm'),
      fim:    format(endDt,   'HH:mm'),
      durMin: dur,
    });
    remaining -= dur;
  }
  return entries;
}

interface Props { task: Task; }

export function TabTimesheet({ task }: Props) {
  const canRun = task.status === 'em_andamento';
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed(s => s + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const entries = mockEntries(task);
  const totalMin = entries.reduce((a, e) => a + e.durMin, 0);

  return (
    <div className={styles.root}>

      {/* Timer */}
      <div className={styles.timerCard}>
        <div className={styles.timerDisplay}>{fmtSecs(elapsed)}</div>
        <span className={styles.timerSub}>
          {running ? 'Cronômetro ativo' : canRun ? 'Pronto para iniciar' : 'Tarefa não está em andamento'}
        </span>
        {canRun ? (
          <button
            className={`${styles.timerBtn} ${running ? styles.timerBtnStop : ''}`}
            onClick={() => { setRunning(r => !r); if (running) setElapsed(0); }}
          >
            {running ? <><Square size={14} /> Parar</> : <><Play size={14} /> Iniciar</>}
          </button>
        ) : (
          <span className={styles.timerStatusOff}>
            Altere o status para Em Andamento para registrar tempo
          </span>
        )}
      </div>

      {/* Totais */}
      <div className={styles.totalsRow}>
        <div className={styles.totalCard}>
          <span className={styles.totalValue}>{entries.length}</span>
          <span className={styles.totalLabel}>Registros</span>
        </div>
        <div className={styles.totalCard}>
          <span className={styles.totalValue}>{fmtDur(totalMin)}</span>
          <span className={styles.totalLabel}>Total registrado</span>
        </div>
        <div className={styles.totalCard}>
          <span className={styles.totalValue}>{task.horas}h</span>
          <span className={styles.totalLabel}>Horas previstas</span>
        </div>
      </div>

      {/* Histórico */}
      <div className={styles.histSection}>
        <h3 className={styles.sectionTitle}>Histórico de apontamentos</h3>
        {entries.length === 0 ? (
          <div className={styles.emptyHist}>Nenhum apontamento registrado ainda.</div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Data</th>
                  <th className={styles.th}>Início</th>
                  <th className={styles.th}>Fim</th>
                  <th className={styles.th}>Duração</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e, i) => (
                  <tr key={i} className={styles.tr}>
                    <td className={styles.td}>{e.data}</td>
                    <td className={styles.td}>{e.inicio}</td>
                    <td className={styles.td}>{e.fim}</td>
                    <td className={`${styles.td} ${styles.tdDur}`}>{fmtDur(e.durMin)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
