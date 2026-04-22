import { AlertCircle } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { STRINGS } from '@/src/constants/strings';
import styles from './ErrorState.module.css';

interface ErrorStateProps { message?: string; onRetry?: () => void; }

export function ErrorState({ message = STRINGS.errors.generic, onRetry }: ErrorStateProps) {
  return (
    <div className={styles.root}>
      <AlertCircle size={36} className={styles.icon} />
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>{STRINGS.actions.retry}</Button>
      )}
    </div>
  );
}
