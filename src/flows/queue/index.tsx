'use client';

import { createQueueCompositions } from '@/app/api/queue/compositions/requests';
import { routeNames } from '@/app/route.names';
import { collections, remoteConfigs } from '@/services/constants';
import { firestore } from '@/services/firebase';
import { remoteConfig } from '@/services/remoteConfig';
import { deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { getValue } from 'firebase/remote-config';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Loading from './components/Loading';
import QueueLobby from './components/QueueLobby';
import { MatchTeamsEnum, Player, QueueItem } from './types';

export default function QueuePage({ queueId, user }: any) {
  const router = useRouter();
  const [queue, setQueue] = useState<QueueItem>();
  const [isFetching, setIsFetching] = useState(true);

  if (!user) router.push(routeNames.HOME)
  
  async function joinQueue(slot: number) {
    if (!queue) return;

    const newPlayers = queue.players;
    newPlayers[slot] = user

    setDoc(doc(firestore, collections.QUEUES, queueId), {
      ...queue,
      players: newPlayers
    })
  }

  async function deleteQueue() { 
    if (!queue) return;

    await deleteDoc(doc(firestore, collections.QUEUES, queue.id));
  }

  function getQueueData() {
    onSnapshot(doc(firestore, collections.QUEUES, queueId), (doc) => {
      if (!doc.exists()) return router.push(routeNames.HOME);
      const queueData = doc.data() as QueueItem;

      if (queueData?.match?.started) return router.push(`${routeNames.MATCH}/${queueData.match.id}`);

      setQueue(queueData);
      setIsFetching(false);
    })
  }

  useEffect(() => {
    const unsubscribe = getQueueData();
    // return () => unsubscribe();
  }, []);

  const isQueueReadyToPlay = useMemo(() => {
    if (!queue?.players) return false;

    return !queue?.players.some((player: any) => !player.username);
  }, [queue?.players]);

  const playerAlreadyInQueue = useMemo(() => {
    if (!queue?.players) return false;
    return !!queue?.players.find((player: any) => player?.username === user?.username);
  }, [queue?.players, user?.username]);


  async function generateQueueCompositions() {
    function shuffleArray(array: Array<Player>) {
      let currentIndex = array.length;
  
      while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
  
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex], array[currentIndex]];
      }
  
      return array;
    }

    function handleRandomizeTeam() {
      if (!queue?.players) return;
  
      const teams = shuffleArray(queue.players);
      const blueTeam = teams.slice(0, 5);
      const redTeam = teams.slice(5, 10);
      const composition = {
        [MatchTeamsEnum.BLUE]: blueTeam,
        [MatchTeamsEnum.RED]: redTeam
      };
  
      return composition;
    }

    const queueCompositionLimit = getValue(remoteConfig, remoteConfigs.QUEUE_COMPOSITION_LIMIT).asNumber();
    const options = new Array(queueCompositionLimit).fill(null).map(handleRandomizeTeam);
    const response = await createQueueCompositions(queueId, options);
    
    if (response?.success) return handleNavigateToComposition();
  }

  function handleNavigateToComposition() {
    router.push(`${routeNames.QUEUE}/${queueId}/compositions`)
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
            joinQueue={joinQueue}
          />
        )}
    </main>
  )
}
