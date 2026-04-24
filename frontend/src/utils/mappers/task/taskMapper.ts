import type { TaskAPI, Task } from '@/src/types/task';
import type { UserAPI, User } from '@/src/types/user';
import type { SectorAPI, Sector } from '@/src/types/sector';
import type { ClientAPI, Client } from '@/src/types/client';
import type { SystemAPI, System } from '@/src/types/system';

function initiais(nome: string): string {
  const parts = nome.trim().split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function mapUser(u: UserAPI): User {
  return { id: u.id, nome: u.nome, email: u.email, setorId: u.setor_id, avatarUrl: u.avatar_url, iniciais: initiais(u.nome) };
}

export function mapSector(s: SectorAPI): Sector {
  return { id: s.id, nome: s.nome, ativo: s.ativo };
}

export function mapClient(c: ClientAPI): Client {
  return { id: c.id, nome: c.nome, codigo: c.codigo };
}

export function mapSystem(s: SystemAPI): System {
  return { id: s.id, nome: s.nome, clienteId: s.cliente_id };
}

export function mapTask(
  api: TaskAPI,
  refs: { users: UserAPI[]; sectors: SectorAPI[]; clients: ClientAPI[]; systems: SystemAPI[] }
): Task {
  const user = refs.users.find(u => u.id === api.responsavel_id) ?? refs.users[0];
  const sector = refs.sectors.find(s => s.id === api.setor_id) ?? refs.sectors[0];
  const client = refs.clients.find(c => c.id === api.cliente_id) ?? refs.clients[0];
  const system = refs.systems.find(s => s.id === api.sistema_id) ?? refs.systems[0];

  return {
    id: api.id,
    scatId: api.scat_id,
    scatNumero: api.scat_numero,
    scatTitulo: api.scat_titulo,
    descricao: api.descricao,
    status: api.status,
    responsavel: mapUser(user),
    setor: mapSector(sector),
    sistema: mapSystem(system),
    cliente: mapClient(client),
    horas: api.horas,
    pontosPrevistos: api.pontos_previstos,
    inicio: api.inicio ? new Date(api.inicio) : null,
    terminoPrevisto: api.termino_previsto ? new Date(api.termino_previsto) : null,
    terminadoEm: api.terminado_em ? new Date(api.terminado_em) : null,
    expectativaFornecedor: api.expectativa_fornecedor,
    tipoTarefa: api.tipo_tarefa,
    tipoFinalizacao: api.tipo_finalizacao,
    comErro: api.com_erro,
    excluida: api.excluida,
    origem: api.origem,
  };
}
