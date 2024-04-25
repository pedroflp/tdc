'use client';

import { startQueue } from "@/app/api/queue/requests";
import { routeNames } from "@/app/route.names";
import QueueCard from "@/components/QueueCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { queueMoc } from "@/flows/home/moc";
import { QueueItem } from "@/flows/queue/types";
import { collections } from "@/services/constants";
import { firestore } from "@/services/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage({ user }: any) {
  const { push } = useRouter();
  const [availableQueues, setAvailableQueues] = useState<Array<QueueItem>>([]);
  const [fetchingQueues, setFetchingQueues] = useState(true);

  async function handleStartQueue() {
  
    try {
      const response = await startQueue();
      push(`${routeNames.QUEUE}/${response?.queueId}`);
    } catch (error) {
      
    }
  }

  function handleEnterQueue(queueId: string) {
    push(`${routeNames.QUEUE}/${queueId}`);
  }

  function getAvailableQueues() {
    setFetchingQueues(true);
    onSnapshot(collection(firestore, collections.QUEUES), (snapshot) => {
      const queues = snapshot.docs.map((doc) => doc.data());
      setAvailableQueues(queues as any);
      setFetchingQueues(false);
    })
  }

  useEffect(() => {
    const unsubscribe = getAvailableQueues();
    // return () => unsubscribe();
  }, [])

  return (
    <main className="flex flex-col justify-center items-center">
      <div className="flex flex-col gap-10 w-full max-w-[50%]">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-3xl">Partidas disponíveis</h1>
          <Button onClick={handleStartQueue}>Criar nova partida</Button>
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
                    disableJoinByAuth={!user}
                    disableJoinByStarted={queue.match?.started}
                    queue={queue}
                    handleEnterQueue={handleEnterQueue}
                  />
                ))
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-700">Nenhuma fila encontrada!</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-400">
                        Não foi possível encontrar nenhuma fila ativa.
                        <strong className="text-slate-500"> Inicie uma nova fila clicando no botão acima!</strong>
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
