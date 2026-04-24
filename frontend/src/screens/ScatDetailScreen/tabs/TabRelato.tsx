'use client';
import { useState, useRef } from 'react';
import { Pencil, Save, X, Bold, Italic, List, AlignLeft } from 'lucide-react';
import type { Scat } from '@/src/types/scat';
import styles from './Tab.module.css';

interface Props { scat: Scat; }

export function TabRelato({ scat }: Props) {
  const [editing,  setEditing]  = useState(false);
  const [descricao, setDescricao] = useState(scat.descricao);
  const [saved,    setSaved]    = useState(descricao);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSave() {
    setSaved(descricao);
    setEditing(false);
  }

  function handleCancel() {
    setDescricao(saved);
    setEditing(false);
  }

  function insertFormat(wrap: string) {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end   = el.selectionEnd;
    const sel   = descricao.slice(start, end);
    const next  = descricao.slice(0, start) + wrap + sel + wrap + descricao.slice(end);
    setDescricao(next);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + wrap.length, end + wrap.length);
    }, 0);
  }

  function insertLine(prefix: string) {
    const el = textareaRef.current;
    if (!el) return;
    const pos = el.selectionStart;
    const before = descricao.slice(0, pos);
    const after  = descricao.slice(pos);
    const lineStart = before.lastIndexOf('\n') + 1;
    const next = before.slice(0, lineStart) + prefix + before.slice(lineStart) + after;
    setDescricao(next);
    setTimeout(() => { el.focus(); el.setSelectionRange(pos + prefix.length, pos + prefix.length); }, 0);
  }

  return (
    <div className={styles.root}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Relato do Cliente</h2>
          <p className={styles.sectionSub}>Descrição da solicitação conforme apresentado pelo cliente.</p>
        </div>
        <div className={styles.editActions}>
          {editing ? (
            <>
              <button className={styles.btnSave} onClick={handleSave}>
                <Save size={14} /> Salvar
              </button>
              <button className={styles.btnCancel} onClick={handleCancel}>
                <X size={14} /> Cancelar
              </button>
            </>
          ) : (
            <button className={styles.btnEdit} onClick={() => setEditing(true)}>
              <Pencil size={14} /> Editar
            </button>
          )}
        </div>
      </div>

      {editing ? (
        <div className={styles.richEditorWrap}>
          <div className={styles.toolbar}>
            <button type="button" className={styles.toolBtn} title="Negrito" onClick={() => insertFormat('**')}>
              <Bold size={14} />
            </button>
            <button type="button" className={styles.toolBtn} title="Itálico" onClick={() => insertFormat('_')}>
              <Italic size={14} />
            </button>
            <div className={styles.toolSep} />
            <button type="button" className={styles.toolBtn} title="Lista" onClick={() => insertLine('- ')}>
              <List size={14} />
            </button>
            <button type="button" className={styles.toolBtn} title="Parágrafo" onClick={() => insertLine('')}>
              <AlignLeft size={14} />
            </button>
          </div>
          <textarea
            ref={textareaRef}
            className={styles.richTextarea}
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            placeholder="Descreva a solicitação do cliente..."
            rows={16}
          />
          <span className={styles.charCount}>{descricao.length} caracteres</span>
        </div>
      ) : (
        <div className={styles.readView}>
          {descricao ? (
            <div className={styles.readText}>
              {descricao.split('\n').map((line, i) => (
                <p key={i} className={styles.readLine}>{line || <br />}</p>
              ))}
            </div>
          ) : (
            <p className={styles.emptyText}>Nenhum relato cadastrado. Clique em Editar para adicionar.</p>
          )}
        </div>
      )}
    </div>
  );
}
