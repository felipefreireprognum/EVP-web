'use client';
import clsx from 'clsx';
import styles from './Badge.module.css';

interface BadgeProps {
  label: string;
  bg?: string;
  color?: string;
  border?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ label, bg, color, border, size = 'md', className }: BadgeProps) {
  return (
    <span
      className={clsx(styles.badge, styles[size], className)}
      style={{ background: bg, color, borderColor: border }}
    >
      {label}
    </span>
  );
}
