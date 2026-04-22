import { ScatDetailScreen } from '@/src/screens/ScatDetailScreen';

interface Props { params: Promise<{ id: string }>; }

export default async function ScatDetailPage({ params }: Props) {
  const { id } = await params;
  return <ScatDetailScreen id={Number(id)} />;
}
