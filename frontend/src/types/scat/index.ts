export interface ScatAPI {
  id: number;
  numero: string;
  titulo: string;
  descricao: string;
  cliente_id: number;
  sistema_id: number;
  setor_id: number;
  solicitante_id: number;
  responsavel_id: number;
  status: 'aberta' | 'em_andamento' | 'aguardando' | 'concluida' | 'cancelada';
  tipo_solicitacao: string;
  prioridade: 'baixa' | 'normal' | 'alta' | 'urgente';
  data_abertura: string;
  data_previsao: string | null;
  data_conclusao: string | null;
  total_tarefas: number;
  tarefas_concluidas: number;
}

export interface Scat {
  id: number;
  numero: string;
  titulo: string;
  descricao: string;
  clienteId: number;
  sistemaId: number;
  setorId: number;
  solicitanteId: number;
  responsavelId: number;
  status: ScatAPI['status'];
  tipoSolicitacao: string;
  prioridade: ScatAPI['prioridade'];
  dataAbertura: Date;
  dataPrevisao: Date | null;
  dataConclusao: Date | null;
  totalTarefas: number;
  tarefasConcluidas: number;
  progresso: number;
}

export interface ScatCardData {
  id: number;
  numero: string;
  titulo: string;
  status: ScatAPI['status'];
  statusLabel: string;
  prioridade: ScatAPI['prioridade'];
  prioridadeLabel: string;
  clienteNome: string;
  sistemaNome: string;
  setorNome: string;
  responsavelNome: string;
  dataAberturaFormatada: string;
  dataPrevisaoFormatada: string;
  totalTarefas: number;
  tarefasConcluidas: number;
  progresso: number;
}

export interface ScatFilters {
  status?: ScatAPI['status'][];
  clienteIds?: number[];
  responsavelIds?: number[];
  dataAberturaDe?: Date | null;
  dataAberturaAte?: Date | null;
  search?: string;
}
