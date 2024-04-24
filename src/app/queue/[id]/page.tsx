
import QueuePage from "@/flows/queue";

export default function Queue({ params }: { params: { id: string } }) {

  return (
    <QueuePage queueId={params.id} />
  );
}
