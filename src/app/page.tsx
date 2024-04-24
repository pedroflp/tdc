'use client';

import { Button } from "@/components/ui/button";
import { signIn } from "./api/auth/signin/requests";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { routeNames } from "./route.names";
import { startQueue } from "./api/queue/requests";
import { onValue, ref } from "firebase/database";
import { database } from "@/services/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/utils/formatDate";
import Avatar from "@/components/Avatar";
import { cn } from "@/lib/utils";
import { AvatarStack } from "@/components/Avatar/avatar-stack";

export default function Home() {
  const { push } = useRouter();
  const [availableQueues, setAvailableQueues] = useState([
    {
        "createdAt": "2024-04-24T13:51:28.920Z",
        "hostId": 12345,
        "id": "123",
        "match": {
            "finished": false,
            "id": 223,
            "started": true,
            "teamWinner": 0
        },
        "name": "Personalizada",
        "password": "123",
        "players": {
            "123": {
                "name": "Pedin",
                "ready": true
            },
            "234": {
                "name": "Tieri"
            },
            "345": {
                "name": "Vanzo"
            },
            "4632": {
                "name": "Supreme"
            },
            "4634": {
                "name": "Gari"
            }
        }
    }
]);
  const [username, setUsername] = useState('')

  async function handleSignIn() {
    try {
      const data = await signIn(username);
      
    } catch (error) {
      
    }

  }

  async function handleStartQueue() {
  
    try {
      const response = await startQueue();
      push(`${routeNames.QUEUE}/${response?.queueId}`);
    } catch (error) {
      
    }
  }

  function handleEnterQueue() {
    push(routeNames.QUEUE+'/123');
  }

  function getAvailableQueues() {
    const queueRef = ref(database, `queues`);
    onValue(queueRef, (snapshot) => setAvailableQueues(Object.values(snapshot.val())))
  }

  // useEffect(() => {
  //   getAvailableQueues();
  // }, [])

  console.log(availableQueues)

  return (
    <main className="w-screen h-screen flex flex-col gap-16 justify-center items-center m-auto">
      <div>
      <Input value={username} onChange={(e) => setUsername(e.target.value)}/>
      <Button onClick={handleSignIn}>Entrar na conta</Button>
      <Button variant="secondary" onClick={handleStartQueue}>Criar queue</Button>
      </div>

      <div>
        {availableQueues.map((queue: any) => (
          <Card className="min-w-[400px]">
              <CardHeader className="flex flex-row justify-between gap-4 items-center">
                <CardTitle>{queue.name}</CardTitle>
                <AvatarStack spacing="lg" id="avatar-stack" avatars={Object.values(queue.players)} />
              </CardHeader>
              <CardContent className="flex justify-between items-center gap-4">
                <CardDescription>
                  <p>Hoster: <strong>{queue.hostId}</strong></p>
                  <p>Criada em: <strong>{formatDate(queue.createdAt)}</strong></p>
                  <p>{queue.players?.length}</p>
                </CardDescription>
                <Button onClick={handleEnterQueue}>Entrar no lobby</Button>
              </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
