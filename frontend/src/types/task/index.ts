import type { User } from '@/src/types/user';
import type { Sector } from '@/src/types/sector';
import type { Client } from '@/src/types/client';
import type { System } from '@/src/types/system';

export interface TaskAPI {
  id: number;
  scat_id: number;
  scat_numero: string;
  descricao: string;
  status: 'disponivel' | 'em_andamento' | 'em_pausa' | 'vencida' | 'concluida';
  responsavel_id: number;
  setor_id: number;
  sistema_id: number;
  cliente_id: number;
  horas: number;
  pontos_previstos: number;
  inicio: string | null;
  termino_previsto: string | null;
  terminado_em: string | null;
  expectativa_fornecedor: string | null;
  tipo_tarefa: string;
  tipo_finalizacao: string | null;
  com_erro: boolean;
  excluida: boolean;
  origem: 'interna' | 'externa';
}

export type TaskStatus = TaskAPI['status'];

export interface Task {
  id: number;
  scatId: number;
  scatNumero: string;
  descricao: string;
  status: TaskStatus;
  responsavel: User;
  setor: Sector;
  sistema: System;
  cliente: Client;
  horas: number;
  pontosPrevistos: number;
  inicio: Date | null;
  terminoPrevisto: Date | null;
  terminadoEm: Date | null;
  expectativaFornecedor: string | null;
  tipoTarefa: string;
  tipoFinalizacao: string | null;
  comErro: boolean;
  excluida: boolean;
  origem: 'interna' | 'externa';
}

export interface TaskCardData {
  id: number;
  scatId: number;
  scatNumero: string;
  titulo: string;
  status: TaskStatus;
  statusLabel: string;
  responsavelNome: string;
  responsavelIniciais: string;
  clienteNome: string;
  setorNome: string;
  sistemaNome: string;
  inicioFormatado: string;
  terminoFormatado: string;
  terminadoEmFormatado: string;
  horasFormatadas: string;
  pontos: number;
  tipoTarefa: string;
  comErro: boolean;
  excluida: boolean;
  origem: 'interna' | 'externa';
}

export interface TaskFilters {
  setorIds?: number[];
  exibirSetoresInativos?: boolean;
  numeroSolicitacao?: string;
  tipoErroIds?: number[];
  sistemaIds?: number[];
  clienteIds?: number[];
  tipoSolicitacaoIds?: number[];
  previsaoTerminoDe?: Date | null;
  previsaoTerminoAte?: Date | null;
  inicioDe?: Date | null;
  inicioAte?: Date | null;
  fimDe?: Date | null;
  fimAte?: Date | null;
  status?: TaskStatus[];
  exibirExcluidas?: boolean;
  origem?: 'interna' | 'externa' | 'todas';
  tipoTarefaIds?: number[];
  tipoFinalizacaoIds?: number[];
  comErro?: boolean | null;
  search?: string;
}
