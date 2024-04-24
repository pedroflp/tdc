'use client';

import { getQueue } from '@/app/api/queue/requests';
import QueueSlot from '@/components/QueueSlot'
import { Button } from '@/components/ui/button'
import { database } from '@/services/firebase';
import { onValue, ref, update } from 'firebase/database';
import React, { useEffect, useState } from 'react'

export default function QueuePage({ queueId }: { queueId: string }) {
  const [queue, setQueue] = useState();

  function getQueue(id: string) {
    const queueRef = ref(database, `queues/${id}`);
    onValue(queueRef, (snapshot) => setQueue(snapshot.val()))
  }

  function joinQueue() {
    update(ref(database), {
      [`queues/${queueId}/players/${123}`]: {
        name: 'Pedin',
        ready: false,
      }
    })
  }

  function handleReadyQueue() {
    update(ref(database), {
      [`queues/${queueId}/players/${123}/ready`]: true,
    })
  }

  useEffect(() => {
    getQueue(queueId);
  }, [])

  if (!queue) return null;

  const players = Object.entries(queue.players ?? {});
  const emptySlots = 10 - players.length;
  const queuePlayers = [...players, ...Array(emptySlots).fill([null, null])];

  return (
    <main className="flex flex-col items-center">
      <div className="grid grid-cols-2 grid-rows-5 gap-12 mb-16">
        {queuePlayers.map(([userId, user], i) => (
          <QueueSlot user={user} onClick={joinQueue} key={userId ?? i} />
        ))}
      </div>

      <Button onClick={handleReadyQueue}>Estou pronto!</Button>
    </main>
  )
}
