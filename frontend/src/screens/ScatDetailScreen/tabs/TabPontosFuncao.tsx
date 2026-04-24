'use client';
import { useState } from 'react';
import { Plus, Trash2, Save, Pencil, X } from 'lucide-react';
import styles from './Tab.module.css';

type TipoFuncao = 'ALI' | 'AIE' | 'EE' | 'SE' | 'CE';
type Complexidade = 'baixa' | 'media' | 'alta';

const PF_WEIGHTS: Record<TipoFuncao, Record<Complexidade, number>> = {
  ALI: { baixa: 7,  media: 10, alta: 15 },
  AIE: { baixa: 5,  media: 7,  alta: 10 },
  EE:  { baixa: 3,  media: 4,  alta: 6  },
  SE:  { baixa: 4,  media: 5,  alta: 7  },
  CE:  { baixa: 3,  media: 4,  alta: 6  },
};

const TIPO_LABELS: Record<TipoFuncao, string> = {
  ALI: 'ALI — Arquivo Lógico Interno',
  AIE: 'AIE — Arquivo de Interface Externa',
  EE:  'EE — Entrada Externa',
  SE:  'SE — Saída Externa',
  CE:  'CE — Consulta Externa',
};

interface PFItem {
  id: string;
  tipo: TipoFuncao;
  descricao: string;
  complexidade: Complexidade;
}

let _id = 1;
function uid() { return String(_id++); }

interface Props { scatId: number; }

export function TabPontosFuncao({ scatId: _scatId }: Props) {
  const [editing, setEditing] = useState(false);
  const [items, setItems] = useState<PFItem[]>([
    { id: uid(), tipo: 'ALI', descricao: 'Cadastro de usuários', complexidade: 'media' },
    { id: uid(), tipo: 'EE',  descricao: 'Formulário de entrada', complexidade: 'baixa' },
  ]);
  const [fator, setFator] = useState(1.00);

  function addItem() {
    setItems(p => [...p, { id: uid(), tipo: 'EE', descricao: '', complexidade: 'baixa' }]);
  }

  function removeItem(id: string) {
    setItems(p => p.filter(i => i.id !== id));
  }

  function updateItem(id: string, field: keyof PFItem, value: string) {
    setItems(p => p.map(i => i.id === id ? { ...i, [field]: value } : i));
  }

  const pfBruto = items.reduce((acc, it) => acc + PF_WEIGHTS[it.tipo][it.complexidade], 0);
  const pfAjustado = +(pfBruto * fator).toFixed(2);

  const byTipo = (Object.keys(PF_WEIGHTS) as TipoFuncao[]).map(tipo => ({
    tipo,
    items: items.filter(i => i.tipo === tipo),
    total: items.filter(i => i.tipo === tipo).reduce((a, i) => a + PF_WEIGHTS[tipo][i.complexidade], 0),
  }));

  return (
    <div className={styles.root}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Pontos de Função</h2>
          <p className={styles.sectionSub}>Cálculo baseado no método IFPUG. PF Bruto × Fator de Ajuste = PF Ajustado.</p>
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

      {/* Resumo */}
      <div className={styles.pfSummary}>
        <div className={styles.pfCard}>
          <span className={styles.pfCardLabel}>PF Bruto</span>
          <span className={styles.pfCardValue}>{pfBruto}</span>
        </div>
        <div className={styles.pfCard}>
          <span className={styles.pfCardLabel}>Fator de Ajuste</span>
          {editing ? (
            <input type="number" className={styles.pfFatorInput} step="0.01" min="0.65" max="1.35"
              value={fator} onChange={e => setFator(+e.target.value)} />
          ) : (
            <span className={styles.pfCardValue}>{fator.toFixed(2)}</span>
          )}
        </div>
        <div className={`${styles.pfCard} ${styles.pfCardFinal}`}>
          <span className={styles.pfCardLabel}>PF Ajustado</span>
          <span className={styles.pfCardValueLg}>{pfAjustado}</span>
        </div>
      </div>

      {/* Tabela de itens */}
      <div className={styles.pfTableWrap}>
        <table className={styles.pfTable}>
          <thead>
            <tr>
              <th className={styles.th}>Tipo</th>
              <th className={styles.th}>Descrição</th>
              <th className={styles.th}>Complexidade</th>
              <th className={styles.th}>Peso</th>
              {editing && <th className={styles.th} />}
            </tr>
          </thead>
          <tbody>
            {byTipo.map(({ tipo, items: tipoItems, total }) => (
              <>
                {tipoItems.length > 0 && (
                  <tr key={`group-${tipo}`} className={styles.pfGroupRow}>
                    <td colSpan={editing ? 5 : 4} className={styles.pfGroupCell}>
                      {TIPO_LABELS[tipo]}
                      {total > 0 && <span className={styles.pfGroupTotal}>{total} PF</span>}
                    </td>
                  </tr>
                )}
                {tipoItems.map(item => (
                  <tr key={item.id} className={styles.tr}>
                    <td className={styles.td}>
                      {editing ? (
                        <select className={styles.selectSm} value={item.tipo}
                          onChange={e => updateItem(item.id, 'tipo', e.target.value)}>
                          {(Object.keys(PF_WEIGHTS) as TipoFuncao[]).map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={styles.pfTipoBadge}>{item.tipo}</span>
                      )}
                    </td>
                    <td className={styles.td}>
                      {editing ? (
                        <input className={styles.inputSm} value={item.descricao}
                          onChange={e => updateItem(item.id, 'descricao', e.target.value)}
                          placeholder="Descrição da função..." />
                      ) : (
                        item.descricao || <span className={styles.emptyCell}>—</span>
                      )}
                    </td>
                    <td className={styles.td}>
                      {editing ? (
                        <select className={styles.selectSm} value={item.complexidade}
                          onChange={e => updateItem(item.id, 'complexidade', e.target.value as Complexidade)}>
                          <option value="baixa">Baixa</option>
                          <option value="media">Média</option>
                          <option value="alta">Alta</option>
                        </select>
                      ) : (
                        <span className={styles[`pfComp_${item.complexidade}`]}>
                          {item.complexidade.charAt(0).toUpperCase() + item.complexidade.slice(1)}
                        </span>
                      )}
                    </td>
                    <td className={styles.td}>
                      <strong>{PF_WEIGHTS[item.tipo][item.complexidade]}</strong>
                    </td>
                    {editing && (
                      <td className={styles.td}>
                        <button className={styles.btnRemove} onClick={() => removeItem(item.id)}>
                          <Trash2 size={13} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>

        {editing && (
          <button className={styles.btnAddRow} onClick={addItem}>
            <Plus size={14} /> Adicionar função
          </button>
        )}
      </div>
    </div>
  );
}
