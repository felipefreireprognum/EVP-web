import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100vh',gap:'16px' }}>
      <h1 style={{ fontSize:'48px',fontWeight:700,color:'var(--color-gray-300)' }}>404</h1>
      <p style={{ color:'var(--color-gray-500)' }}>Página não encontrada</p>
      <Link href="/tarefas" style={{ color:'var(--color-brand-blue)',textDecoration:'underline' }}>Voltar para Tarefas</Link>
    </div>
  );
}
