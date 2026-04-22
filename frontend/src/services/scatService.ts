import { mockApi } from './mockApi';
import { mapScat } from '@/src/utils/mappers/scat/scatMapper';
import type { Scat, ScatFilters } from '@/src/types/scat';

export const scatService = {
  list: async (filters?: ScatFilters): Promise<Scat[]> => {
    const apiScats = await mockApi.getScats(filters);
    return apiScats.map(mapScat);
  },

  getById: async (id: number): Promise<Scat> => {
    const apiScat = await mockApi.getScatById(id);
    return mapScat(apiScat);
  },
};
