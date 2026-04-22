import type { ScatAPI, Scat } from '@/src/types/scat';

export function mapScat(api: ScatAPI): Scat {
  const totalTarefas = api.total_tarefas;
  const tarefasConcluidas = api.tarefas_concluidas;
  const progresso = totalTarefas > 0 ? Math.round((tarefasConcluidas / totalTarefas) * 100) : 0;

  return {
    id: api.id,
    numero: api.numero,
    titulo: api.titulo,
    descricao: api.descricao,
    clienteId: api.cliente_id,
    sistemaId: api.sistema_id,
    setorId: api.setor_id,
    solicitanteId: api.solicitante_id,
    responsavelId: api.responsavel_id,
    status: api.status,
    tipoSolicitacao: api.tipo_solicitacao,
    prioridade: api.prioridade,
    dataAbertura: new Date(api.data_abertura),
    dataPrevisao: api.data_previsao ? new Date(api.data_previsao) : null,
    dataConclusao: api.data_conclusao ? new Date(api.data_conclusao) : null,
    totalTarefas,
    tarefasConcluidas,
    progresso,
  };
}
