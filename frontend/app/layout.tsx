import type { Metadata } from 'next';
import { IBM_Plex_Sans } from 'next/font/google';
import { AuthProvider } from '@/src/contexts/AuthContext';
import './globals.css';

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'EVP — Gestão de Tarefas',
  description: 'Sistema de gestão de tarefas e solicitações da Prognum',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={ibmPlexSans.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
