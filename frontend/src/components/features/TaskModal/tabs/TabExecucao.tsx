'use client';
import { useState } from 'react';
import { Save } from 'lucide-react';
import type { Task } from '@/src/types/task';
import styles from './TabExecucao.module.css';

const FINALIZACAO_OPTS = [
  'Normal',
  'Com pendência',
  'Parcial',
  'Cancelada pelo cliente',
  'Cancelada internamente',
  'Aguardando retorno',
];

const RESULTADO_OPTS = [
  'Finalizada normalmente',
  'Finalizada com erro',
  'Finalizada com ressalvas',
];

interface Props { task: Task; }

export function TabExecucao({ task }: Props) {
  const [resultado,       setResultado]       = useState(task.comErro ? 'Finalizada com erro' : 'Finalizada normalmente');
  const [tipoFinalizacao, setTipoFinalizacao] = useState(task.tipoFinalizacao ?? '');
  const [descricao,       setDescricao]       = useState('');
  const [saved,           setSaved]           = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className={styles.root}>

      <div className={styles.intro}>
        <p className={styles.introText}>
          Registre o que foi realizado, como a tarefa foi finalizada e qualquer
          observação relevante para o histórico.
        </p>
      </div>

      {/* Selects no mesmo padrão de tabela */}
      <section className={styles.section}>
        <span className={styles.sectionTitle}>Resultado</span>
        <div className={styles.infoList}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Como foi finalizada</span>
            <div className={styles.infoValue}>
              <select
                className={styles.select}
                value={resultado}
                onChange={e => setResultado(e.target.value)}
              >
                {RESULTADO_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Tipo de finalização</span>
            <div className={styles.infoValue}>
              <select
                className={styles.select}
                value={tipoFinalizacao}
                onChange={e => setTipoFinalizacao(e.target.value)}
              >
                <option value="">Selecione...</option>
                {FINALIZACAO_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Textarea */}
      <section className={styles.textareaSection}>
        <span className={styles.label}>
          O que foi feito
          <span className={styles.labelHint}> — descreva tudo que foi realizado nesta tarefa</span>
        </span>
        <textarea
          className={styles.textarea}
          placeholder="Descreva detalhadamente o que foi realizado, dificuldades encontradas, decisões tomadas..."
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
          rows={6}
        />
        <span className={styles.charCount}>{descricao.length} caracteres</span>
      </section>

      <div className={styles.footer}>
        <span className={styles.taskRef}>
          Tarefa <strong>#{task.id}</strong> · {task.scatNumero}
        </span>
        <button
          className={`${styles.saveBtn} ${saved ? styles.saveBtnDone : ''}`}
          onClick={handleSave}
        >
          <Save size={14} />
          {saved ? 'Salvo!' : 'Salvar execução'}
        </button>
      </div>

    </div>
  );
}
