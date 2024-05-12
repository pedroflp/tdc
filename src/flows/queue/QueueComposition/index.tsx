'use client';

import { createMatch } from '@/app/api/match/requests';
import { selectQueueCompositions } from '@/app/api/queue/compositions/requests';
import { routeNames } from '@/app/route.names';
import Avatar from '@/components/Avatar';
import { AvatarStack } from '@/components/Avatar/avatar-stack';
import QueueSlot from '@/components/QueueSlot';
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

export default function QueueCompositionPage({ queueId, user }: any) {
  const router = useRouter();

  const [queue, setQueue] = useState<QueueItem>();
  const [isSelectingQueueComposition, setIsSelectingQueueComposition] = useState(false);
  const [isCreatingMatch, setIsCreatingMatch] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const unsubscribe = getQueueData();
    return () => unsubscribe();
  }, []);

  if (!queue) return null;

  if (!queue.players.some(player => player?.username === user?.username)) {
    router.push(routeNames.HOME)
    return null;
  }

  function getQueueData() {
    return onSnapshot(doc(firestore, collections.QUEUES, queueId), (doc) => {
      if (!doc.exists()) return router.push(routeNames.HOME);

      const queue = doc.data() as QueueItem;

      if (!queue?.compositions || queue?.compositions?.length === 0) return router.push(routeNames.QUEUE(queueId));
      if (queue?.match?.started) return router.push(routeNames.MATCH(queue?.match?.id));
      setQueue(doc.data() as any);
      setIsFetching(false);
    })
  }

  async function handleSelectQueueCompositions(compositionId: string) {
    setIsSelectingQueueComposition(true);
    if (isSelectingQueueComposition) return;
    
    await selectQueueCompositions(queue!.id, compositionId, user);

    const timeout = setTimeout(() => {
      setIsSelectingQueueComposition(false);
    }, 5000);

    return () => clearTimeout(timeout);
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
      router.push(routeNames.MATCH(response.matchId))
    } else {
      setIsCreatingMatch(false);
    }
  }

  return (
    <main className='flex flex-col m-auto gap-12 min-w-[60%] w-full max-w-[60%]'>
      {isFetching ? <Loading /> : (
        <>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-4xl font-bold'>Escolha de Composição</h1>
              <h2 className='flex gap-2 items-center text-muted-foreground'><strong>{queue.name}</strong> de
                <span className='flex gap-1 items-center'>
                  <Avatar image={queue.hoster.avatar} className='w-8 h-8' fallbackSize='text-xs' fallback={String(queue.hoster.name).slice(0, 2)} />
                  <strong>{queue.hoster.name}</strong>
                </span>
              </h2>
              <p className='text-muted-foreground/50 mt-4'>Visualize as composições que foram formadas e vote na composição de sua preferência! <br />
                <strong className='text-muted-foreground'>A primeira composição que tiver 6 ou mais votos, permite iniciar a partida.</strong>
              </p>
            </div>
          </div>
          {queue?.readyToStartMatch && (
            queue?.hoster?.username === user?.username ? (
            <Button
              disabled={isCreatingMatch}
              onClick={handleStartMatch}
              className='h-16 text-lg font-bold'
            >
              {isCreatingMatch ? "Iniciando " : "Iniciar "} partida {queue?.name}
            </Button>
            ) : (
              <Button disabled>
                <span>A <strong>Composição {queue.compositions.findIndex(({ votes }) => votes.length >= 6)}</strong> foi a mais votada. Aguardando <strong>{queue.hoster.name}</strong> iniciar a partida</span>
              </Button>
            )
          )}
          <Tabs className='grid grid-cols-[1fr_2.5fr] gap-12' defaultValue="composition-1">
            <TabsList className='w-full h-min flex flex-col justify-start items-start mt-2'>
              {queue.compositions?.map(({ votes }: {votes: Player[]}, index: number) => (
                <TabsTrigger
                  key={index}
                  disabled={isSelectingQueueComposition}
                  className={cn(
                    'w-full flex flex-col items-start min-h-[70px] space-y-[4px]',
                    votes.some((voter: Player) => voter.username == user.username) && 'border-2 border-emerald-500 bg-primary-foreground'
                  )}
                  value={`composition-${index + 1}`}
                >
                  <p>Opção de <strong>Composição {index + 1}</strong> <span className='text-xs text-muted-foreground'>(Votos: {votes.length})</span></p>
                  <AvatarStack avatarClassName='w-8 h-8' fallbackSize="text-xs" spacing="2xl" maxAvatarsAmount={10} avatars={votes} />
                </TabsTrigger>
              ))}
              {isSelectingQueueComposition && (
                <div className='w-full p-2 flex flex-col gap-4'>
                  <Separator className='bg-muted-foreground/10' />
                  <span className='text-xs text-muted-foreground/40'>Aguarde até você poder votar novamente!</span>
                </div>
              )}
            </TabsList>
              {queue.compositions?.map(({ red, blue, votes }: any, index: number) => {
                const userAlreadySelectedThisComposition = votes.some((voter: Player) => voter.username === user.username)
                return (
                  <TabsContent key={index} className='space-y-8' value={`composition-${index + 1}`}>
                    <div className='grid grid-cols-[2fr_auto_2fr] gap-4'>
                      <div className='space-y-4'>
                        <h1 className='text-2xl font-bold'>Time Azul</h1>
                        {blue.map((player: Player, index: number) => (
                          <QueueSlot disabled key={index} player={player} />
                        ))}
                      </div>
                      <div className='flex items-center justify-center relative mx-8 overflow-hidden'>
                        <div className='w-[1px] h-full bg-border/50 absolute z-0' />
                        <Image
                          src="/assets/icons/default-match.png"
                          alt="versus"
                          width={1000}
                          height={1000}
                          className='w-20 h-20 relative z-2 bg-background'
                        />
                      </div>
                      <div className='space-y-4'>
                        <h1 className='text-2xl font-bold text-right'>Time Vermelho</h1>
                        {red.map((player: Player, index: number) => (
                          <QueueSlot disabled key={index} player={player} />
                        ))}
                      </div>
                    </div>
                    <Button
                      onClick={(() => handleSelectQueueCompositions(`composition-${index}`))}
                      disabled={isSelectingQueueComposition || userAlreadySelectedThisComposition}
                      className='w-full h-14'
                    >
                      {  userAlreadySelectedThisComposition ? "Você votou nesta composição!" : 
                        isSelectingQueueComposition ? "Votando nessa composição..." : (
                        <span>Escolher opção de <strong>Composição {index + 1}</strong></span>
                      )}
                    </Button>
                  </TabsContent>
                )
              })}
          </Tabs>
        </>
      )}
    </main>
  )
}
