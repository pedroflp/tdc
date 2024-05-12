import MatchPage from '@/flows/match';
import BaseLayout from '@/layouts/base';

export default async function QueueComposition({ params }: { params: {matchId: string, }}) {
  const { matchId } = params;

  return (
    <BaseLayout>
      <MatchPage matchId={matchId} />
    </BaseLayout>
  )
}
