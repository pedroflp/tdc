import QueueCompositionPage from '@/flows/queue/QueueComposition'
import BaseLayout from '@/layouts/base'

export default async function QueueComposition({ params }: { params: {id: string, }}) {
  const queueId = params?.id;

  return (
    <BaseLayout>
      <QueueCompositionPage queueId={queueId} />
    </BaseLayout>
  )
}
