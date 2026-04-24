'use client';
import { useState } from 'react';
import { Pencil, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Scat } from '@/src/types/scat';
import type { UserAPI } from '@/src/types/user';
import type { ClientAPI } from '@/src/types/client';
import type { SystemAPI } from '@/src/types/system';
import type { SectorAPI } from '@/src/types/sector';
import styles from './Tab.module.css';

interface Refs {
  users:   UserAPI[];
  clients: ClientAPI[];
  systems: SystemAPI[];
  sectors: SectorAPI[];
}

interface Props { scat: Scat; refs: Refs; }

function fmtDate(d: Date | null) {
  return d ? format(d, "dd/MM/yyyy", { locale: ptBR }) : '—';
}

function Row({ label, value, editing, children }: {
  label: string; value: React.ReactNode;
  editing?: boolean; children?: React.ReactNode;
}) {
  return (
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>{label}</span>
      <div className={styles.infoValue}>
        {editing && children ? children : value}
      </div>
    </div>
  );
}

export function TabIdentificacao({ scat, refs }: Props) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    titulo: scat.titulo,
    tipoSolicitacao: scat.tipoSolicitacao,
    prioridade: scat.prioridade,
    status: scat.status,
    responsavelId: scat.responsavelId,
    solicitanteId: scat.solicitanteId,
    clienteId: scat.clienteId,
    sistemaId: scat.sistemaId,
    setorId: scat.setorId,
    dataPrevisao: scat.dataPrevisao ? format(scat.dataPrevisao, 'yyyy-MM-dd') : '',
  });

  const responsavel = refs.users.find(u => u.id === (editing ? form.responsavelId : scat.responsavelId));
  const solicitante = refs.users.find(u => u.id === (editing ? form.solicitanteId : scat.solicitanteId));
  const cliente     = refs.clients.find(c => c.id === (editing ? form.clienteId : scat.clienteId));
  const sistema     = refs.systems.find(s => s.id === (editing ? form.sistemaId : scat.sistemaId));
  const setor       = refs.sectors.find(s => s.id === (editing ? form.setorId : scat.setorId));

  return (
    <div className={styles.root}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Identificação e Metadados</h2>
          <p className={styles.sectionSub}>Dados de identificação, responsáveis e prazos desta solicitação.</p>
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

        {/* Identificação */}
        <div className={styles.group}>
          <span className={styles.groupTitle}>Identificação</span>
          <div className={styles.infoList}>
            <Row label="Número" value={scat.numero} />
            <Row label="Título" value={form.titulo} editing={editing}>
              <input className={styles.input} value={form.titulo}
                onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} />
            </Row>
            <Row label="Status" value={scat.status} editing={editing}>
              <select className={styles.select} value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as Scat['status'] }))}>
                <option value="aberta">Aberta</option>
                <option value="em_andamento">Em andamento</option>
                <option value="aguardando">Aguardando</option>
                <option value="concluida">Concluída</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </Row>
            <Row label="Tipo de solicitação" value={form.tipoSolicitacao} editing={editing}>
              <input className={styles.input} value={form.tipoSolicitacao}
                onChange={e => setForm(f => ({ ...f, tipoSolicitacao: e.target.value }))} />
            </Row>
            <Row label="Prioridade" value={form.prioridade} editing={editing}>
              <select className={styles.select} value={form.prioridade}
                onChange={e => setForm(f => ({ ...f, prioridade: e.target.value as Scat['prioridade'] }))}>
                <option value="baixa">Baixa</option>
                <option value="normal">Normal</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </Row>
          </div>
        </div>

        {/* Organização */}
        <div className={styles.group}>
          <span className={styles.groupTitle}>Organização</span>
          <div className={styles.infoList}>
            <Row label="Cliente" value={cliente?.nome ?? '—'} editing={editing}>
              <select className={styles.select} value={form.clienteId}
                onChange={e => setForm(f => ({ ...f, clienteId: +e.target.value }))}>
                {refs.clients.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </Row>
            <Row label="Sistema" value={sistema?.nome ?? '—'} editing={editing}>
              <select className={styles.select} value={form.sistemaId}
                onChange={e => setForm(f => ({ ...f, sistemaId: +e.target.value }))}>
                {refs.systems.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
              </select>
            </Row>
            <Row label="Setor" value={setor?.nome ?? '—'} editing={editing}>
              <select className={styles.select} value={form.setorId}
                onChange={e => setForm(f => ({ ...f, setorId: +e.target.value }))}>
                {refs.sectors.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
              </select>
            </Row>
          </div>
        </div>

        {/* Responsáveis */}
        <div className={styles.group}>
          <span className={styles.groupTitle}>Responsáveis</span>
          <div className={styles.infoList}>
            <Row label="Responsável" value={responsavel?.nome ?? '—'} editing={editing}>
              <select className={styles.select} value={form.responsavelId}
                onChange={e => setForm(f => ({ ...f, responsavelId: +e.target.value }))}>
                {refs.users.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
              </select>
            </Row>
            <Row label="Solicitante" value={solicitante?.nome ?? '—'} editing={editing}>
              <select className={styles.select} value={form.solicitanteId}
                onChange={e => setForm(f => ({ ...f, solicitanteId: +e.target.value }))}>
                {refs.users.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
              </select>
            </Row>
          </div>
        </div>

        {/* Datas e SLA */}
        <div className={styles.group}>
          <span className={styles.groupTitle}>Datas e SLA</span>
          <div className={styles.infoList}>
            <Row label="Abertura" value={fmtDate(scat.dataAbertura)} />
            <Row label="Previsão de término" value={fmtDate(scat.dataPrevisao)} editing={editing}>
              <input type="date" className={styles.input} value={form.dataPrevisao}
                onChange={e => setForm(f => ({ ...f, dataPrevisao: e.target.value }))} />
            </Row>
            <Row label="Conclusão" value={fmtDate(scat.dataConclusao)} />
            <Row label="Urgência" value={
              <span className={scat.prioridade === 'urgente' ? styles.urgente : styles.normal}>
                {scat.prioridade === 'urgente' ? 'Urgente' : 'Normal'}
              </span>
            } />
          </div>
        </div>

      </div>
    </div>
  );
}
