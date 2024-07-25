import MatchPage from '@/flows/lol/match';
import BaseLayout from '@/layouts/Base';

export default async function QueueComposition({ params }: { params: {matchId: string, }}) {
  const { matchId } = params;

  return (
    <BaseLayout>
      <MatchPage matchId={matchId} />
    </BaseLayout>
  )
}
