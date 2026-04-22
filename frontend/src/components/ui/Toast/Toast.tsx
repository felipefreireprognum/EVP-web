'use client';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { useToast } from '@/src/contexts/ToastContext';
import styles from './Toast.module.css';

export function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className={styles.container}>
      {toasts.map(t => (
        <div key={t.id} className={`${styles.toast} ${styles[t.type]}`}>
          <span className={styles.icon}>
            {t.type === 'success' && <CheckCircle2 size={16} />}
            {t.type === 'error' && <XCircle size={16} />}
            {t.type === 'info' && <Info size={16} />}
          </span>
          <span className={styles.message}>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
