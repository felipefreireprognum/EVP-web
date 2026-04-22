'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastProvider } from '@/src/contexts/ToastContext';
import { ViewModeProvider } from '@/src/contexts/ViewModeContext';
import { TaskFiltersProvider } from '@/src/contexts/TaskFiltersContext';
import { useAuth } from '@/src/contexts/AuthContext';
import { Header } from '@/src/components/layout/Header';
import { Sidebar } from '@/src/components/layout/Sidebar';
import { PageContainer } from '@/src/components/layout/PageContainer';
import { ToastContainer } from '@/src/components/ui/Toast';
import { useIsMobile } from '@/src/hooks/shared/useIsMobile';
import styles from './layout.module.css';

function MainLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { isAuthenticated, isChecked } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isChecked && !isAuthenticated) {
      router.replace('/');
    }
  }, [isChecked, isAuthenticated, router]);

  if (!isChecked || !isAuthenticated) return null;

  return (
    <div className={styles.root}>
      <Header onMenuToggle={() => setMenuOpen(o => !o)} menuOpen={menuOpen} />
      <div className={styles.body}>
        {isMobile ? (
          <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        ) : (
          <Sidebar />
        )}
        <PageContainer>{children}</PageContainer>
      </div>
      <ToastContainer />
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ViewModeProvider>
        <TaskFiltersProvider>
          <MainLayout>{children}</MainLayout>
        </TaskFiltersProvider>
      </ViewModeProvider>
    </ToastProvider>
  );
}
