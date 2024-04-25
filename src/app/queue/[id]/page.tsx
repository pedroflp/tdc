
import QueuePage from "@/flows/queue";
import BaseLayout from "@/layouts/base";

export default async function Queue({ params }: { params: { id: string } }) {
  return (
    <BaseLayout>
      <QueuePage queueId={params.id} />
    </BaseLayout>
  );
}
