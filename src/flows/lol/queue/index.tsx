'use client';

import { createQueueCompositions } from '@/app/api/lol/queue/compositions/requests';
import { routeNames } from '@/app/route.names';
import { collections } from '@/services/constants';
import { firestore } from '@/services/firebase';
import { deleteDoc, doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Loading from './components/Loading';
import QueueLobby from './components/QueueLobby';
import { QueueItem } from './types';
import { UserDTO } from '@/app/api/user/types';

export async function handleEnterQueue(queueId: string, user: UserDTO) {
  if (!queueId) return;

  const queueRef = doc(firestore, collections.QUEUES, queueId)
  const queueDoc = await getDoc(queueRef);
  const queue = queueDoc.data() as QueueItem;

  const newPlayers = queue.players; 
  const indexToAddPlayer = newPlayers.findIndex(player => !player.username);

  newPlayers[indexToAddPlayer] =  {
    username: user.username,
    avatar: user.avatar,
    name: user.name
  }

  setDoc(queueRef, {
    ...queue,
    players: newPlayers
  })
}

export default function QueuePage({ queueId, user }: any) {
  const router = useRouter();
  const [queue, setQueue] = useState<QueueItem>();
  const [isFetching, setIsFetching] = useState(true);

  if (!user) router.push(routeNames.QUEUES);

  async function deleteQueue() { 
    if (!queue) return;

    await deleteDoc(doc(firestore, collections.QUEUES, queue.id));
  }

  async function handleExitFromQueue(username: string) {
    if (!queue) return;

    const newPlayers = queue.players.map(player => player?.username === username ? {} : player);
    updateDoc(doc(firestore, collections.QUEUES, queueId), {
      players: newPlayers
    });
  }

  function getQueueData() {
    return onSnapshot(doc(firestore, collections.QUEUES, queueId), async (queueDoc) => {
      if (!queueDoc.exists()) {
        const match = await getDoc(doc(firestore, collections.MATCHES, queueId));
        if (match.exists()) router.push(routeNames.MATCH(queueId));
        else router.push(routeNames.HOME);
        return;
      };
      const queueData = queueDoc.data() as QueueItem;

      if (!queueData.players.some(player => player?.username === user?.username)) {
        if (queueData.players.every(player => player?.username)) return router.push(routeNames.QUEUES);
        handleEnterQueue(queueId, user);
      }
      if (queueData?.matchId) return router.push(routeNames.MATCH(queueData?.matchId));
      if (queueData?.compositions?.length > 0) return router.push(routeNames.QUEUE_COMPOSITIONS(queueData.id));

      setQueue(queueData);
      setIsFetching(false);
    })
  }

  useEffect(() => {
    const unsubscribe = getQueueData();
    return () => unsubscribe();
  }, []);

  const isQueueReadyToPlay = useMemo(() => {
    if (!queue?.players) return false;

    return !queue?.players.some((player: any) => !player?.username);
  }, [queue?.players]);

  const playerAlreadyInQueue = useMemo(() => {
    if (!queue?.players) return false;
    return !!queue?.players.find((player: any) => player?.username === user?.username);
  }, [queue?.players, user?.username]);


  async function generateQueueCompositions() {
    const response = await createQueueCompositions(queueId);
    
    if (response?.success) return handleNavigateToComposition();
  }

  function handleNavigateToComposition() {
    router.push(routeNames.QUEUE_COMPOSITIONS(queueId));
  }

  return (
    <main className="flex justify-center items-center gap-10">
      {
        isFetching ? (
          <Loading />
        ) : (
          <QueueLobby
            user={user}
            queue={queue!}
            deleteQueue={deleteQueue}
            playerAlreadyInQueue={playerAlreadyInQueue}
            isQueueReadyToPlay={isQueueReadyToPlay}
            generateQueueCompositions={generateQueueCompositions}
            handleNavigateToComposition={handleNavigateToComposition}
            handleExitFromQueue={handleExitFromQueue}
          />
        )}
    </main>
  )
}
