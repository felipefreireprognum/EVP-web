import styles from './Spinner.module.css';

interface SpinnerProps { size?: number; color?: string; }

export function Spinner({ size = 20, color = 'var(--color-brand-blue)' }: SpinnerProps) {
  return (
    <svg className={styles.spinner} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" opacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}
