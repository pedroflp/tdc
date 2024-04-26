'use client';

import QueueSlot from '@/components/QueueSlot'
import { Button } from '@/components/ui/button'
import { collections } from '@/services/constants';
import { firestore } from '@/services/firebase';
import { onValue, ref, update } from 'firebase/database';
import { collection, doc, getDoc, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import React, { useEffect, useMemo, useState } from 'react'
import { Player, QueueItem } from './types';
import Avatar from '@/components/Avatar';

export default function QueuePage({ queueId, user }: any) {
  const [queue, setQueue] = useState<QueueItem>();

  async function joinQueue(slot: number) {
    const queueDoc = await getDoc(doc(firestore, collections.QUEUES, queueId));

    if (!queueDoc.exists()) return;

    const queueData = queueDoc.data();

    setDoc(doc(firestore, collections.QUEUES, queueId), {
      ...queueData,
      players: queueData.players.map((_: any, index: number) => index === slot && user)
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

  const isQueueReadyToPlay = useMemo(() => {
    if (!queue?.players) return false;

    return !queue?.players.some((player: any) => !player.username);
  }, [queue?.players]);

  const playerAlreadyInQueue = useMemo(() => {
    if (!queue?.players) return false;
    return !!queue?.players.find((player: any) => player?.username === user?.username);
  }, [queue?.players, user?.username]);

  return (
    <main className="flex flex-col justify-center items-center gap-10">
      <div className='max-w-[60%]'>
        <div className='flex flex-col gap-8'>
          <div className='flex items-center justify-between'>
            <div className='space-y-2'>
              <h1 className='text-3xl font-bold text-slate-800'>{queue?.name}</h1>
              <span className='flex items-center gap-2'>
                Partida de
                <span className='flex gap-1 items-center'>
                  <Avatar className='w-8 h-8' image={queue?.hoster?.avatar} fallback={String(queue?.hoster?.name).slice(0, 2)} />
                  <strong>{queue?.hoster?.name}</strong>
                </span>
              </span>
            </div>
          {user.username === queue?.hoster?.username && <Button variant="destructive">Fechar partida</Button>}
          </div>
          <p className='text-sm text-slate-500'>Entre nos slots para participar da partida!</p>
          <div className='grid grid-cols-2 grid-rows-5 gap-6'>
            {queue?.players.map((player: any, index: number) => (
              <QueueSlot disabled={playerAlreadyInQueue} onClick={() => joinQueue(index)} key={index} player={player} />
            ))}
          </div>
          {user.username === queue?.hoster?.username &&
            <Button disabled={!isQueueReadyToPlay} className='min-w-60 px-10 h-20 mt-6'>
              {!isQueueReadyToPlay ? 'Aguardando jogadores entrarem nos slots' : 'Formar times'}
            </Button>
          }
        </div>
      </div>
    </main>
  )
}
