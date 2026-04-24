export const ROUTES = {
  HOME:          '/',
  INICIO:        '/inicio',
  TAREFAS:       '/tarefas',
  SCATS:         '/scats',
  SCAT_DETAIL:   (id: number | string) => `/scats/${id}`,
} as const;
