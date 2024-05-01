'use client';

import Avatar from '@/components/Avatar';
import QueueSlot from '@/components/QueueSlot';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { collections } from '@/services/constants';
import { firestore } from '@/services/firebase';
import { deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { MatchTeamsEnum, Player, QueueItem } from './types';
import { Eye, Heading1 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { routeNames } from '@/app/route.names';
import QueueHeader from './components/MatchHeaderInfo';
import Loading from './components/Loading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { createQueueCompositions, selectQueueCompositions } from '@/app/api/queue/compositions/requests';
import QueueLobby from './components/QueueLobby';
import QueueCompositionSelect from './components/QueueCompositionSelect';

export default function QueuePage({ queueId, user }: any) {
  const router = useRouter();
  const [queue, setQueue] = useState<QueueItem>();
  const [isFetching, setIsFetching] = useState(true);
  const [teamOptions, setTeamOptions] = useState<any>([])
  const [teamOptionSelectedView, setTeamOptionSelectedView] = useState(0);

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

      setQueue(doc.data() as any);
      setIsFetching(false);
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


  async function generateTeamOptions() {
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
  
      return composition
    }

    const options = new Array(4).fill(null).map(handleRandomizeTeam)
    await createQueueCompositions(queueId, options);
    // setTeamOptions(options)
  }

  async function handleSelectQueueCompositions(compositionId: string) {
    await selectQueueCompositions(queueId, compositionId, user);
  }

  return (
    <main className="flex justify-center items-center gap-10">
      {queue?.compositions?.length! > 0 ?
        <QueueCompositionSelect
          user={user}
          teamOptions={queue?.compositions}
          generateTeamOptions={generateTeamOptions}
          handleSelectQueueCompositions={handleSelectQueueCompositions}
        />
        : (
          isFetching ? (
            <Loading />
          ) : (
            <QueueLobby
              user={user}
              queue={queue}
              deleteQueue={deleteQueue}
              playerAlreadyInQueue={playerAlreadyInQueue}
              isQueueReadyToPlay={isQueueReadyToPlay}
              generateTeamOptions={generateTeamOptions}
              joinQueue={joinQueue}
            />
          )
        )}
    </main>
  )
}
