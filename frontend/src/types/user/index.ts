export interface UserAPI {
  id: number;
  nome: string;
  email: string;
  setor_id: number;
  avatar_url: string | null;
}

export interface User {
  id: number;
  nome: string;
  email: string;
  setorId: number;
  avatarUrl: string | null;
  iniciais: string;
}
