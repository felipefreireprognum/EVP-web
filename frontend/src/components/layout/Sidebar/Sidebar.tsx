'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutList, FileText } from 'lucide-react';
import { ROUTES } from '@/src/constants/routes';
import { STRINGS } from '@/src/constants/strings';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { label: STRINGS.nav.tarefas, href: ROUTES.TAREFAS, icon: LayoutList },
  { label: STRINGS.nav.scats,   href: ROUTES.SCATS,   icon: FileText },
];

interface SidebarProps { isOpen?: boolean; onClose?: () => void; }

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen !== undefined && isOpen && (
        <div className={styles.mobileOverlay} onClick={onClose} />
      )}
      <nav className={`${styles.sidebar} ${isOpen !== undefined && !isOpen ? styles.mobileHidden : ''}`}>
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Navegação</p>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.item} ${isActive ? styles.active : ''}`}
                onClick={onClose}
              >
                <Icon size={18} className={styles.itemIcon} />
                <span className={styles.itemLabel}>{item.label}</span>
                {isActive && <span className={styles.activePip} />}
              </Link>
            );
          })}
        </div>

        <div className={styles.footer}>
          <p className={styles.version}>Prognum — EVP Web v1.0</p>
        </div>
      </nav>
    </>
  );
}
