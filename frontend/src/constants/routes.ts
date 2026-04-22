export const ROUTES = {
  HOME:          '/',
  TAREFAS:       '/tarefas',
  SCATS:         '/scats',
  SCAT_DETAIL:   (id: number | string) => `/scats/${id}`,
} as const;
