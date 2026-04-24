'use client';
import { useState, useRef } from 'react';
import { Upload, FileText, Image, FolderOpen, Trash2, Download } from 'lucide-react';
import styles from './Tab.module.css';

type AtivoTipo = 'pdf' | 'imagem' | 'pasta' | 'outro';

interface Ativo {
  id: string;
  nome: string;
  tipo: AtivoTipo;
  tamanho: string;
}

let _id = 200;
function uid() { return String(_id++); }

const TIPO_ICONS: Record<AtivoTipo, typeof FileText> = {
  pdf:    FileText,
  imagem: Image,
  pasta:  FolderOpen,
  outro:  FileText,
};

function detectTipo(nome: string): AtivoTipo {
  const ext = nome.split('.').pop()?.toLowerCase() ?? '';
  if (['pdf'].includes(ext)) return 'pdf';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'imagem';
  return 'outro';
}

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface Props { scatId: number; }

export function TabAtivos({ scatId: _scatId }: Props) {
  const [ativos, setAtivos] = useState<Ativo[]>([
    { id: uid(), nome: 'Especificacao_tecnica.pdf', tipo: 'pdf',    tamanho: '142 KB' },
    { id: uid(), nome: 'Captura_tela_erro.png',     tipo: 'imagem', tamanho: '87 KB' },
  ]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const novos: Ativo[] = Array.from(files).map(f => ({
      id: uid(),
      nome: f.name,
      tipo: detectTipo(f.name),
      tamanho: fmtSize(f.size),
    }));
    setAtivos(p => [...p, ...novos]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div className={styles.root}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Ativos e Documentos</h2>
          <p className={styles.sectionSub}>Evidências, documentos e arquivos relacionados a esta solicitação.</p>
        </div>
      </div>

      {/* Drop zone */}
      <div
        className={`${styles.dropZone} ${dragging ? styles.dropZoneActive : ''}`}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <Upload size={28} className={styles.dropIcon} />
        <p className={styles.dropTitle}>Arraste arquivos aqui ou clique para selecionar</p>
        <p className={styles.dropSub}>PDF, imagens, documentos — qualquer formato aceito</p>
        <input ref={inputRef} type="file" multiple hidden onChange={e => handleFiles(e.target.files)} />
      </div>

      {/* Lista de ativos */}
      {ativos.length > 0 && (
        <div className={styles.ativosList}>
          {ativos.map(ativo => {
            const Icon = TIPO_ICONS[ativo.tipo];
            return (
              <div key={ativo.id} className={styles.ativoRow}>
                <div className={`${styles.ativoIcon} ${styles[`ativoIcon_${ativo.tipo}`]}`}>
                  <Icon size={16} />
                </div>
                <div className={styles.ativoInfo}>
                  <span className={styles.ativoNome}>{ativo.nome}</span>
                  <span className={styles.ativoMeta}>{ativo.tipo.toUpperCase()} · {ativo.tamanho}</span>
                </div>
                <div className={styles.ativoActions}>
                  <button className={styles.ativoBtn} title="Baixar">
                    <Download size={14} />
                  </button>
                  <button className={`${styles.ativoBtn} ${styles.atovoBtnDelete}`}
                    title="Remover" onClick={() => setAtivos(p => p.filter(a => a.id !== ativo.id))}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
