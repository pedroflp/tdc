'use client';

import QueueSlot from '@/components/QueueSlot'
import { Button } from '@/components/ui/button'
import { collections } from '@/services/constants';
import { firestore } from '@/services/firebase';
import { onValue, ref, update } from 'firebase/database';
import { collection, doc, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import React, { useEffect, useMemo, useState } from 'react'

export default function QueuePage({ queueId, user }: any) {
  const [queue, setQueue] = useState();

  function joinQueue() {
    setDoc(doc(firestore, collections.QUEUES, queueId), {
      players: [
        ...queue?.players,
        {
          id: user.id,
          name: user.name,
          avatar: user.avatar ?? "",
          ready: false
        }
      ]
    })
  }

  function getQueueData() {
    onSnapshot(doc(firestore, collections.QUEUES, queueId), (doc) => {
      setQueue(doc.data() as any);
    })
  }

  useEffect(() => {
    const unsubscribe = getQueueData();
    // return () => unsubscribe();
  }, [])

  const players = useMemo(() => {
    if (!queue?.players) return [];

    const queueEmptySlots = new Array(10 - queue?.players.length).fill(null)
    return [...queue?.players, ...queueEmptySlots]
  }, [queue?.players]);

  return (
    <main className="h-screen flex flex-col items-center justify-center gap-10">
      <div className='grid grid-cols-2 grid-rows-5 gap-10'>
        {players.map((player: any, index: number) => (
          <QueueSlot onClick={joinQueue} key={index} player={player} />
        ))}
      </div>
      <Button variant="outline" className='w-60 h-20'>Estou pronto!</Button>
    </main>
  )
}
