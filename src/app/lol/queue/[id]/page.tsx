
import QueuePage from "@/flows/lol/queue";
import BaseLayout from "@/layouts/Base";

export default async function Queue({ params }: { params: { id: string } }) {
  return (
    <BaseLayout>
      <QueuePage queueId={params.id} />
    </BaseLayout>
  );
}
