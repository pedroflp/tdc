import QueueCompositionPage from '@/flows/lol/queue/QueueComposition'
import BaseLayout from '@/layouts/Base'
import LoadingRoot from './loading'

export default async function QueueComposition({ params }: { params: {id: string, }}) {
  return (
    <BaseLayout>
      <QueueCompositionPage queueId={params.id} />
    </BaseLayout>
  )
}
