'use client';

import { createMatch } from '@/app/api/lol/match/requests';
import { selectQueueCompositions } from '@/app/api/lol/queue/compositions/requests';
import { routeNames } from '@/app/route.names';
import Avatar from '@/components/Avatar';
import { AvatarStack } from '@/components/Avatar/avatar-stack';
import QueueSlot from '@/components/QueuePlayerCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { collections } from '@/services/constants';
import { firestore } from '@/services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Player, QueueItem } from '../types';
import Loading from './components/Loading';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { UserDTO } from '@/app/api/user/types';
import QueuePlayerCard from '@/components/QueuePlayerCard';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import LoadingRoot from '@/app/lol/queue/[id]/compositions/loading';

export default function QueueCompositionPage({ queueId, user }: { queueId: string, user?: UserDTO }) {
  const router = useRouter();

  const [queue, setQueue] = useState<QueueItem>();
  const [isSelectingQueueComposition, setIsSelectingQueueComposition] = useState(false);
  const [isCreatingMatch, setIsCreatingMatch] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const unsubscribe = getQueueData();
    return () => unsubscribe();
  }, []);


  if (isFetching) return (
    <Loading />
  )

  function getQueueData() {
    return onSnapshot(doc(firestore, collections.QUEUES, queueId), (doc) => {
      if (!doc.exists()) return router.push(routeNames.HOME);

      const queue = doc.data() as QueueItem;

      if (queue?.matchId) return router.push(routeNames.MATCH(queue?.matchId));
      if (!queue?.compositions || queue?.compositions?.length === 0) return router.push(routeNames.QUEUE(queueId));
      
      setQueue(doc.data() as any);
      setIsFetching(false);
    })
  }

  async function handleSelectQueueCompositions(compositionId: string) {
    setIsSelectingQueueComposition(true);
    await selectQueueCompositions(queue!.id, compositionId, user!);
    
    setTimeout(() => {
      setIsSelectingQueueComposition(false);
    }, 1000);
  }

  async function handleStartMatch() {
    if (!queue) return;

    setIsCreatingMatch(true);

    const response = await createMatch({
      teams: queue.teams,
      players: queue.players,
      hoster: queue.hoster,
      name: queue.name,
      queueId: queue.id
    })

    if (response.success) {
      return router.push(routeNames.MATCH(response.matchId))
    } 

    setIsCreatingMatch(false);
  }

  return (
    <main className='flex flex-col m-auto min-w-[70%] w-full max-w-[70%]'>
      <Tabs className='grid grid-rows-[auto_1fr]' defaultValue={queue?.compositions?.[0]?.id}>
        <TabsList className='w-full h-full flex gap-4'>
          {queue?.compositions?.map(({ id, votes },index: number) => (
            <TabsTrigger
              key={id}
              value={id}
              disabled={isSelectingQueueComposition}
              className='w-full h-full flex flex-col justify-between items-start gap-8 py-2'
            >
              <p className='flex items-center gap-4'>
                <strong>Composição {index + 1}</strong>
                <AvatarStack size={6} fallbackSize="text-xs" spacing="2xl" maxAvatarsAmount={6} avatars={votes} />
              </p>
              {!votes.some(vote => vote.username === user?.username) ?
                <Button loading={isSelectingQueueComposition} onClick={() => handleSelectQueueCompositions(id)} className='w-full text-xs' size="xs">Votar nesta Composição</Button>
                : <span className='text-emerald-400 text-xs m-auto'>Você votou nesta composição</span>
              }
            </TabsTrigger>
          ))}
        </TabsList>

        {queue?.readyToStartMatch && user?.username === queue?.hoster?.username && 
          <Button loading={isCreatingMatch} onClick={handleStartMatch} className='rounded-t-none py-8' size="lg">Iniciar partida {queue?.name}</Button>
        }

        {queue?.compositions?.map(({ red, blue, id }) => {
          return (
            <TabsContent key={id} className='space-y-4 p-6 py-4 bg-secondary/40 rounded-md' value={id}>
              <div className='grid grid-cols-[2fr_auto_2fr] gap-4'>
                <div className='space-y-4'>
                  <h1 className='text-2xl font-bold'>Time Azul</h1>
                  {blue.map((player: Player, index: number) => (
                    <QueuePlayerCard user={user} key={index} player={player} />
                  ))}
                </div>
                <div className='flex items-center justify-center relative mx-8 overflow-hidden'>
                  <Separator className='w-[2px] h-full bg-border absolute z-0' />
                  <Image
                    src="/assets/icons/default-match.png"
                    alt="versus"
                    width={1000}
                    height={1000}
                    className='w-24 relative z-2 p-4 bg-secondary rounded-full'
                  />
                </div>
                <div className='space-y-4'>
                  <h1 className='text-2xl font-bold text-right'>Time Vermelho</h1>
                  {red.map((player: Player, index: number) => (
                    <QueuePlayerCard user={user} key={index} player={player} />
                  ))}
                </div>
              </div>
            </TabsContent>
          )
        })}
      </Tabs>
    </main>
  )
}
