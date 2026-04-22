'use client';
import clsx from 'clsx';
import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  iconLeft?: ReactNode;
  label?: string;
  error?: string;
}

export function Input({ iconLeft, label, error, className, id, ...props }: InputProps) {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label} htmlFor={id}>{label}</label>}
      <div className={clsx(styles.inputWrap, error && styles.hasError)}>
        {iconLeft && <span className={styles.icon}>{iconLeft}</span>}
        <input id={id} className={clsx(styles.input, iconLeft && styles.withIcon, className)} {...props} />
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
