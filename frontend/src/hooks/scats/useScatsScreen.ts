'use client';
import { useEffect, useState, useCallback } from 'react';
import { scatService } from '@/src/services/scatService';
import type { Scat, ScatFilters } from '@/src/types/scat';

export function useScatsScreen() {
  const [scats, setScats] = useState<Scat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ScatFilters>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await scatService.list(filters);
      setScats(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { void load(); }, [load]);

  return { scats, loading, error, filters, setFilters, reload: load };
}
