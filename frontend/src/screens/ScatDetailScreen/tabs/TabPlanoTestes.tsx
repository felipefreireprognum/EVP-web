'use client';
import { useState } from 'react';
import { Plus, Trash2, Save, Pencil, X, CheckSquare, Square, Globe, Monitor } from 'lucide-react';
import styles from './Tab.module.css';

interface Criterio {
  id: string;
  descricao: string;
  concluido: boolean;
}

let _id = 100;
function uid() { return String(_id++); }

interface Props { scatId: number; }

export function TabPlanoTestes({ scatId: _scatId }: Props) {
  const [editing, setEditing] = useState(false);
  const [ambiente, setAmbiente] = useState('Homologação');
  const [url,      setUrl]      = useState('');
  const [criterios, setCriterios] = useState<Criterio[]>([
    { id: uid(), descricao: 'Login funciona corretamente', concluido: false },
    { id: uid(), descricao: 'Dados salvos sem erros',      concluido: false },
  ]);

  function addCriterio() {
    setCriterios(p => [...p, { id: uid(), descricao: '', concluido: false }]);
  }

  function removeCriterio(id: string) {
    setCriterios(p => p.filter(c => c.id !== id));
  }

  function updateCriterio(id: string, descricao: string) {
    setCriterios(p => p.map(c => c.id === id ? { ...c, descricao } : c));
  }

  function toggleCriterio(id: string) {
    setCriterios(p => p.map(c => c.id === id ? { ...c, concluido: !c.concluido } : c));
  }

  const done  = criterios.filter(c => c.concluido).length;
  const total = criterios.length;

  return (
    <div className={styles.root}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Plano de Testes</h2>
          <p className={styles.sectionSub}>Ambiente, URLs e critérios de aceitação desta solicitação.</p>
        </div>
        <div className={styles.editActions}>
          {editing ? (
            <>
              <button className={styles.btnSave} onClick={() => setEditing(false)}>
                <Save size={14} /> Salvar
              </button>
              <button className={styles.btnCancel} onClick={() => setEditing(false)}>
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

      <div className={styles.groups}>

        {/* Ambiente */}
        <div className={styles.group}>
          <span className={styles.groupTitle}>Ambiente Operacional</span>
          <div className={styles.infoList}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}><Monitor size={13} /> Ambiente</span>
              <div className={styles.infoValue}>
                {editing ? (
                  <select className={styles.select} value={ambiente}
                    onChange={e => setAmbiente(e.target.value)}>
                    <option>Produção</option>
                    <option>Homologação</option>
                    <option>Desenvolvimento</option>
                    <option>QA</option>
                  </select>
                ) : (
                  <span className={styles.ambienteBadge}>{ambiente}</span>
                )}
              </div>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}><Globe size={13} /> URL / Caminho</span>
              <div className={styles.infoValue}>
                {editing ? (
                  <input className={styles.input} value={url} placeholder="https://..."
                    onChange={e => setUrl(e.target.value)} />
                ) : (
                  url ? <a href={url} target="_blank" rel="noreferrer" className={styles.urlLink}>{url}</a>
                      : <span className={styles.emptyCell}>Não informado</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Critérios de aceitação */}
        <div className={styles.group}>
          <div className={styles.groupTitleRow}>
            <span className={styles.groupTitle}>Critérios de Aceitação</span>
            {total > 0 && (
              <span className={styles.criterioProgress}>
                {done}/{total} concluídos
              </span>
            )}
          </div>

          {total === 0 ? (
            <p className={styles.emptyText}>Nenhum critério adicionado.</p>
          ) : (
            <div className={styles.criterioList}>
              {criterios.map(c => (
                <div key={c.id} className={`${styles.criterioRow} ${c.concluido ? styles.criterioDone : ''}`}>
                  <button className={styles.checkBtn} onClick={() => toggleCriterio(c.id)}>
                    {c.concluido ? <CheckSquare size={16} className={styles.checkDone} /> : <Square size={16} className={styles.checkTodo} />}
                  </button>
                  {editing ? (
                    <input className={styles.criterioInput} value={c.descricao}
                      onChange={e => updateCriterio(c.id, e.target.value)}
                      placeholder="Descreva o critério..." />
                  ) : (
                    <span className={`${styles.criterioText} ${c.concluido ? styles.criterioTextDone : ''}`}>
                      {c.descricao || <em className={styles.emptyCell}>Sem descrição</em>}
                    </span>
                  )}
                  {editing && (
                    <button className={styles.btnRemove} onClick={() => removeCriterio(c.id)}>
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {editing && (
            <button className={styles.btnAddRow} onClick={addCriterio}>
              <Plus size={14} /> Adicionar critério
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
