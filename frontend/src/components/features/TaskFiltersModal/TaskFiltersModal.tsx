'use client';
import { useState } from 'react';
import { Modal } from '@/src/components/ui/Modal';
import { Button } from '@/src/components/ui/Button';
import { Switch } from '@/src/components/ui/Switch';
import { Input } from '@/src/components/ui/Input';
import { useTaskFiltersContext } from '@/src/contexts/TaskFiltersContext';
import { TASK_STATUS_CONFIG, TASK_STATUS_ORDER } from '@/src/constants/taskStatus';
import { STRINGS } from '@/src/constants/strings';
import type { TaskFilters, TaskStatus } from '@/src/types/task';
import styles from './TaskFiltersModal.module.css';

import sectorsData from '@/mocks/data/sectors.json';
import clientsData from '@/mocks/data/clients.json';
import systemsData from '@/mocks/data/systems.json';
import taskTypesData from '@/mocks/data/taskTypes.json';

function MultiCheckbox<T extends { id: number; nome: string }>({
  label, items, selected, onChange,
}: {
  label: string;
  items: T[];
  selected: number[];
  onChange: (ids: number[]) => void;
}) {
  const toggle = (id: number) =>
    onChange(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);

  return (
    <div className={styles.filterGroup}>
      <label className={styles.filterLabel}>{label}</label>
      <div className={styles.checkList}>
        {items.map(item => (
          <label key={item.id} className={styles.checkItem}>
            <input
              type="checkbox"
              checked={selected.includes(item.id)}
              onChange={() => toggle(item.id)}
            />
            {item.nome}
          </label>
        ))}
      </div>
    </div>
  );
}

export function TaskFiltersModal() {
  const { filters, setFilters, clearFilters, isModalOpen, closeModal, activeFiltersCount } = useTaskFiltersContext();
  const [draft, setDraft] = useState<TaskFilters>(filters);

  const handleOpen = () => setDraft(filters);
  const handleApply = () => { setFilters(draft); closeModal(); };
  const handleClear = () => { setDraft({}); setFilters({}); closeModal(); };

  const set = <K extends keyof TaskFilters>(k: K, v: TaskFilters[K]) =>
    setDraft(prev => ({ ...prev, [k]: v }));

  const toggleStatus = (s: TaskStatus) => {
    const cur = draft.status ?? [];
    set('status', cur.includes(s) ? cur.filter(x => x !== s) : [...cur, s]);
  };

  const S = STRINGS.tarefas.filtros;

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      title={S.titulo}
      footer={
        <>
          <Button variant="ghost" onClick={handleClear}>{STRINGS.actions.clear}</Button>
          <Button variant="primary" onClick={handleApply}>
            {STRINGS.actions.apply}
            {activeFiltersCount > 0 && ` (${activeFiltersCount})`}
          </Button>
        </>
      }
    >
      <div className={styles.grid}>
        {/* Busca */}
        <div className={styles.filterGroup} style={{ gridColumn: '1 / -1' }}>
          <Input
            label="Busca"
            placeholder="Descrição ou número da SCAT..."
            value={draft.search ?? ''}
            onChange={e => set('search', e.target.value || undefined)}
          />
        </div>

        {/* Número SCAT */}
        <div className={styles.filterGroup}>
          <Input
            label={S.numeroSolicitacao}
            placeholder="Ex: 2024/0001"
            value={draft.numeroSolicitacao ?? ''}
            onChange={e => set('numeroSolicitacao', e.target.value || undefined)}
          />
        </div>

        {/* Origem */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>{S.origem}</label>
          <div className={styles.radioGroup}>
            {(['todas','interna','externa'] as const).map(o => (
              <label key={o} className={styles.radioItem}>
                <input
                  type="radio"
                  name="origem"
                  value={o}
                  checked={(draft.origem ?? 'todas') === o}
                  onChange={() => set('origem', o)}
                />
                {o === 'todas' ? S.origemTodas : o === 'interna' ? S.origemInterna : S.origemExterna}
              </label>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className={styles.filterGroup} style={{ gridColumn: '1 / -1' }}>
          <label className={styles.filterLabel}>{S.status}</label>
          <div className={styles.statusGrid}>
            {TASK_STATUS_ORDER.map(s => {
              const cfg = TASK_STATUS_CONFIG[s];
              const sel = (draft.status ?? []).includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  className={`${styles.statusChip} ${sel ? styles.statusChipSelected : ''}`}
                  style={sel ? { background: cfg.bg, color: cfg.text, borderColor: cfg.border } : undefined}
                  onClick={() => toggleStatus(s)}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Setor */}
        <MultiCheckbox
          label={S.setor}
          items={sectorsData}
          selected={draft.setorIds ?? []}
          onChange={ids => set('setorIds', ids)}
        />

        {/* Cliente */}
        <MultiCheckbox
          label={S.cliente}
          items={clientsData}
          selected={draft.clienteIds ?? []}
          onChange={ids => set('clienteIds', ids)}
        />

        {/* Sistema */}
        <MultiCheckbox
          label={S.sistema}
          items={systemsData}
          selected={draft.sistemaIds ?? []}
          onChange={ids => set('sistemaIds', ids)}
        />

        {/* Tipo Tarefa */}
        <MultiCheckbox
          label={S.tipoTarefa}
          items={taskTypesData}
          selected={draft.tipoTarefaIds ?? []}
          onChange={ids => set('tipoTarefaIds', ids)}
        />

        {/* Com erro */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>{S.comErro}</label>
          <div className={styles.radioGroup}>
            {[
              { v: null,  l: S.comErroTodas },
              { v: true,  l: S.comErroSo },
              { v: false, l: S.comErroSem },
            ].map(({ v, l }) => (
              <label key={String(v)} className={styles.radioItem}>
                <input
                  type="radio"
                  name="comErro"
                  checked={(draft.comErro ?? null) === v}
                  onChange={() => set('comErro', v)}
                />
                {l}
              </label>
            ))}
          </div>
        </div>

        {/* Exibir excluídas */}
        <div className={styles.filterGroup}>
          <Switch
            label={S.excluidas}
            checked={draft.exibirExcluidas ?? false}
            onChange={v => set('exibirExcluidas', v)}
          />
        </div>

        {/* Exibir setores inativos */}
        <div className={styles.filterGroup}>
          <Switch
            label={S.setoresInativos}
            checked={draft.exibirSetoresInativos ?? false}
            onChange={v => set('exibirSetoresInativos', v)}
          />
        </div>
      </div>
    </Modal>
  );
}
