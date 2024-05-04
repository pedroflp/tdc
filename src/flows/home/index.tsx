'use client';

import { startQueue, validateQueueProtectionCode } from "@/app/api/queue/requests";
import { routeNames } from "@/app/route.names";
import QueueCard from "@/components/QueueCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { QueueItem } from "@/flows/queue/types";
import { collections } from "@/services/constants";
import { firestore } from "@/services/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MatchCreation from "./components/MatchCreation";
import { MatchModesEnum } from "./components/MatchOptionCard/types";

export default function HomePage({ user }: any) {
  const { push } = useRouter();
  const [availableQueues, setAvailableQueues] = useState<Array<QueueItem>>([]);
  const [fetchingQueues, setFetchingQueues] = useState(true); 
  const [creatingQueue, setCreatingQueue] = useState(false);

  async function handleCreateMatch(matchName: string, matchMode: MatchModesEnum, protectMode: { enabled: boolean, code: string }) {
    setCreatingQueue(true);
    const response = await startQueue(matchName, matchMode, protectMode);

    if (!response?.success) {
      setCreatingQueue(false);
      return;
    }
    
    push(`${routeNames.QUEUE}/${response?.queueId}`);
  }

  async function handleEnterQueue(queueId: string) {
    push(`${routeNames.QUEUE}/${queueId}`);
  }

  function getAvailableQueues() {
    setFetchingQueues(true);
    return onSnapshot(collection(firestore, collections.QUEUES), (snapshot) => {
      const queues = snapshot.docs.map((doc) => doc.data());
      setAvailableQueues(queues as any);
      setFetchingQueues(false);
    })
  }

  useEffect(() => {
    const unsubscribe = getAvailableQueues();
    return () => unsubscribe();
  }, [])

  return (
    <main className="flex flex-col justify-center items-center">
      <div className="flex flex-col gap-10 w-full md:max-w-[80%] xl:max-w-[50%]">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-4xl text-primary">Salas disponíveis</h1>
          {!!user ? (
            <MatchCreation
              creatingQueue={creatingQueue}
              onCreateMatch={handleCreateMatch}
            />
          ) : null}
        </div>
        <div className="flex flex-wrap w-full flex-col gap-6">
          {fetchingQueues ? (
            <div className="flex flex-col gap-5">
              <Skeleton className="w-full h-40" />
              <Skeleton className="w-full h-40" />
            </div>
          ) : (
              availableQueues.length > 0 ? (
                availableQueues.map((queue: any) => (
                  <QueueCard
                    key={queue.id}
                    user={user}
                    queue={queue}
                    disabledJoinByAuth={!user}
                    disabledJoinByStarted={queue.match?.started}
                    handleEnterQueue={handleEnterQueue}
                  />
                ))
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-primary/70">Nenhuma sala encontrada!</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-primary/50">
                        Não foi possível encontrar nenhuma sala disponível.
                        <strong> Crie uma nova sala para abrir a fila e iniciar novas partidas!</strong>
                      </CardDescription>
                  </CardContent>
                </Card>
              )
          )}
        </div>
      </div>
    </main>
  );
}
