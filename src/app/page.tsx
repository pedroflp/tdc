import BaseLayout from '@/layouts/Base';
import Queues from './lol/queues/page';
import QueuesPage from '@/flows/lol/queues';

export default async function Home() {
  return (
    <BaseLayout>
      <QueuesPage />
    </BaseLayout>
  )
}
