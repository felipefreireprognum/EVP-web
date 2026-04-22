'use client';
import { useRouter } from 'next/navigation';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';
import { useIsMobile } from '@/src/hooks/shared/useIsMobile';
import { UserAvatar } from '@/src/components/shared/UserAvatar';
import styles from './Header.module.css';

const MOCK_USER = { nome: 'Felipe Freire', iniciais: 'FF' };

interface HeaderProps { onMenuToggle?: () => void; menuOpen?: boolean; }

export function Header({ onMenuToggle, menuOpen }: HeaderProps) {
  const isMobile = useIsMobile();
  const { logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.replace('/');
  }

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        {isMobile && (
          <button className={styles.menuBtn} onClick={onMenuToggle} aria-label="Menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}
        <div className={styles.brand}>
          <div className={styles.logoMark}>EVP</div>
          <span className={styles.brandName}>
            Prognum <span className={styles.brandSep}>·</span> Gestão
          </span>
        </div>
      </div>

      <div className={styles.right}>
        <UserAvatar nome={MOCK_USER.nome} iniciais={MOCK_USER.iniciais} size="sm" />
        <span className={styles.userName}>{MOCK_USER.nome}</span>
        <button className={styles.logoutBtn} onClick={handleLogout} title="Sair">
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
