import QueueCompositionPage from '@/flows/queue/QueueComposition'
import BaseLayout from '@/layouts/base'
import LoadingRoot from './loading'

export default async function QueueComposition({ params }: { params: {id: string, }}) {
  return (
    <BaseLayout>
      <QueueCompositionPage queueId={params.id} />
    </BaseLayout>
  )
}
