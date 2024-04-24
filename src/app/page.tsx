'use client';

import { Button } from "@/components/ui/button";
import { signIn } from "./api/auth/signin/requests";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { routeNames } from "./route.names";
import { startQueue } from "./api/queue/requests";

export default function Home() {
  const { push } = useRouter();
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

  return (
    <main className="w-[30%] flex gap-4 items-center m-auto">
      <Input value={username} onChange={(e) => setUsername(e.target.value)}/>
      <Button onClick={handleSignIn}>Entrar na conta</Button>
      <Button variant="secondary" onClick={handleStartQueue}>Criar queue</Button>
      <Button variant="outline" onClick={handleEnterQueue}>Entrar na queue</Button>
    </main>
  );
}
