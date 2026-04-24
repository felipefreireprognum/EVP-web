'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, LayoutList, FileText, LogOut } from 'lucide-react';
import { ROUTES } from '@/src/constants/routes';
import { STRINGS } from '@/src/constants/strings';
import { useAuth } from '@/src/contexts/AuthContext';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { label: STRINGS.nav.inicio,  href: ROUTES.INICIO,  icon: LayoutDashboard },
  { label: STRINGS.nav.tarefas, href: ROUTES.TAREFAS, icon: LayoutList },
  { label: STRINGS.nav.scats,   href: ROUTES.SCATS,   icon: FileText },
];

interface SidebarProps { isOpen?: boolean; onClose?: () => void; }

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { username, logout } = useAuth();
  const router = useRouter();
  const iniciais = username.slice(0, 2).toUpperCase();

  function handleLogout() {
    logout();
    router.replace('/');
  }

  return (
    <>
      {isOpen !== undefined && isOpen && (
        <div className={styles.mobileOverlay} onClick={onClose} />
      )}
      <nav className={`${styles.sidebar} ${isOpen !== undefined && !isOpen ? styles.mobileHidden : ''}`}>

        {/* Logo + brand */}
        <div className={styles.brandHeader}>
          <div className={styles.logoMark}>EVP</div>
          <div className={styles.brandInfo}>
            <span className={styles.brandName}>Prognum</span>
            <span className={styles.brandTagline}>Sistema de gestão</span>
          </div>
        </div>

        {/* User box */}
        <div className={styles.userBox}>
          <div className={styles.userAvatar}>{iniciais}</div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{username}</p>
            <p className={styles.userRole}>Usuário</p>
          </div>
        </div>

        {/* Navigation */}
        <div className={styles.nav}>
          <p className={styles.sectionLabel}>Menu</p>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                onClick={onClose}
              >
                <Icon size={17} className={styles.navIcon} />
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={15} />
            <span>Sair da conta</span>
          </button>
          <p className={styles.version}>EVP Web v1.0</p>
        </div>

      </nav>
    </>
  );
}
