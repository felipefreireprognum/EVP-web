'use client';
import { useRouter } from 'next/navigation';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';
import { UserAvatar } from '@/src/components/shared/UserAvatar';
import styles from './Header.module.css';

interface HeaderProps { onMenuToggle?: () => void; menuOpen?: boolean; }

export function Header({ onMenuToggle, menuOpen }: HeaderProps) {
  const { logout, username } = useAuth();
  const router = useRouter();
  const iniciais = username.slice(0, 2).toUpperCase();

  function handleLogout() {
    logout();
    router.replace('/');
  }

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        {/* Hamburger — CSS hides on desktop */}
        <button className={styles.menuBtn} onClick={onMenuToggle} aria-label="Menu">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Brand — CSS hides on desktop (sidebar shows it there) */}
        <div className={styles.brand}>
          <div className={styles.logoMark}>EVP</div>
          <span className={styles.brandName}>
            Prognum <span className={styles.brandSep}>·</span> Gestão
          </span>
        </div>
      </div>

      <div className={styles.right}>
        {/* Avatar visible on both; username + logout only on mobile via CSS */}
        <UserAvatar nome={username} iniciais={iniciais} size="sm" />
        <span className={styles.userName}>{username}</span>
        <button className={styles.logoutBtn} onClick={handleLogout} title="Sair">
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
