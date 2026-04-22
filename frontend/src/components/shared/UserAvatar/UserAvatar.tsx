import styles from './UserAvatar.module.css';

interface UserAvatarProps {
  nome: string;
  iniciais: string;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

const COLORS = [
  '#2563EB','#7C3AED','#D97706','#16A34A','#DC2626',
  '#0891B2','#9333EA','#F59E0B','#059669','#EF4444',
];

function colorFromName(nome: string): string {
  let hash = 0;
  for (const ch of nome) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffffffff;
  return COLORS[Math.abs(hash) % COLORS.length];
}

export function UserAvatar({ nome, iniciais, size = 'md', showName }: UserAvatarProps) {
  const bg = colorFromName(nome);
  return (
    <div className={`${styles.wrapper} ${showName ? styles.withName : ''}`}>
      <div className={`${styles.avatar} ${styles[size]}`} style={{ background: bg }}>
        {iniciais}
      </div>
      {showName && <span className={styles.name}>{nome}</span>}
    </div>
  );
}
