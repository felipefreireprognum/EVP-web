'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';
import { ROUTES } from '@/src/constants/routes';
import styles from './LoginScreen.module.css';

export function LoginScreen() {
  const { login, isAuthenticated, isChecked } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (isChecked && isAuthenticated) {
      router.replace(ROUTES.TAREFAS);
    }
  }, [isChecked, isAuthenticated, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const ok = login(username, password);
    if (ok) {
      router.replace(ROUTES.TAREFAS);
    } else {
      setError('Usuário ou senha incorretos.');
      setLoading(false);
    }
  }

  if (!isChecked || isAuthenticated) return null;

  return (
    <div className={styles.root}>
      {/* Painel esquerdo */}
      <div className={styles.left}>
        <div className={styles.leftBlob} />

        <div className={styles.leftTop}>
          <div className={styles.logoWrap}>
            <span className={styles.logoMark}>EVP</span>
            <span className={styles.logoName}>Prognum · Gestão</span>
          </div>
        </div>

        <div className={styles.leftMiddle}>
          <h1 className={styles.leftTitle}>
            Gestão de tarefas<br />e solicitações
          </h1>
          <p className={styles.leftSub}>
            Acompanhe SCATs, tarefas e equipes em um só lugar.
            Simples, rápido e organizado.
          </p>
        </div>

      </div>

      {/* Painel direito */}
      <div className={styles.right}>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Bem-vindo de volta</h2>
            <p className={styles.formSub}>Entre com suas credenciais para continuar</p>
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="username">Usuário</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}><User size={16} /></span>
                <input
                  id="username"
                  type="text"
                  className={`${styles.input} ${error ? styles.inputError : ''}`}
                  placeholder="supervisor"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError(''); }}
                  autoComplete="username"
                  autoFocus
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">Senha</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}><Lock size={16} /></span>
                <input
                  id="password"
                  type="password"
                  className={`${styles.input} ${error ? styles.inputError : ''}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  autoComplete="current-password"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className={styles.error}>
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <button type="submit" className={styles.submitBtn} disabled={loading || !username || !password}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <p className={styles.formFooter}>Prognum — EVP Web v1.0</p>
        </form>
      </div>
    </div>
  );
}
