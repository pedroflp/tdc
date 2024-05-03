import MatchPage from '@/flows/match';
import BaseLayout from '@/layouts/base';

export default async function QueueComposition({ params }: { params: {id: string, }}) {
  const matchId = params?.id;

  return (
    <BaseLayout>
      <MatchPage matchId={matchId} />
    </BaseLayout>
  )
}
