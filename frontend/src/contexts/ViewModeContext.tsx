'use client';
import { createContext, useContext, type ReactNode } from 'react';
import { useLocalStorage } from '@/src/hooks/shared/useLocalStorage';

type ViewMode = 'list' | 'kanban';

interface ViewModeContextValue {
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
}

const ViewModeContext = createContext<ViewModeContextValue | null>(null);

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>('evp:viewMode', 'list');
  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode(): ViewModeContextValue {
  const ctx = useContext(ViewModeContext);
  if (!ctx) throw new Error('useViewMode must be inside ViewModeProvider');
  return ctx;
}
