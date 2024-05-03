'use client';

import { routeNames } from '@/app/route.names';
import Avatar from '@/components/Avatar';
import QueueSlot from '@/components/QueueSlot';
import { collections } from '@/services/constants';
import { firestore } from '@/services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MatchItem, MatchTeamsEnum, QueueItem } from '../queue/types';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { updateMatch } from '@/app/api/match/requests';
import { Badge } from '@/components/ui/badge';

export default function MatchPage({ user, matchId }: any) {
  const router = useRouter();
  const [match, setMatch] = useState<MatchItem>();
  const [winner, setWinner] = useState<MatchTeamsEnum>();
  const [matchIdInLoL, setMatchIdInLoL] = useState("");
  const [fetchingWinner, setFetchingWinner] = useState(false);

  function getQueueData() {
    return onSnapshot(doc(firestore, collections.MATCHES, matchId), (doc) => {
      if (!doc.exists()) return router.push(routeNames.HOME);

      const match = doc.data() as MatchItem;      
      setMatch(match);
    })
  }

  async function handleDeclareMatchWinner() {
    setFetchingWinner(true);
    if (!match || !winner) return;

    await updateMatch(match.id, match.queueId, {
      winner,
      matchIdInLoL,
      finished: true
    } as MatchItem);

    setFetchingWinner(false);
  }

  useEffect(() => {
    const unsubscribe = getQueueData();
    return () => unsubscribe();
  }, []);

  if (!match) return;

  return (
    <main className='flex flex-col m-auto gap-12 min-w-[60%] w-full max-w-[60%]'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-4xl font-bold text-slate-700'>Partida {match.finished ? 'Finalizada' : 'Em andamento'}</h1>
          <h2 className='flex gap-2 items-center text-slate-400'>{match.name} de
            <span className='flex gap-1 items-center'>
              <Avatar image={match.hoster.avatar} size={6} fallbackSize='text-xs' fallback={String(match.hoster.name).slice(0, 2)} />{match.hoster.name}
            </span>
          </h2>
        </div>
        {match.finished
          ? <Button onClick={() => router.push(routeNames.HOME)}>Voltar para o início</Button>
          : match?.hoster?.username === user?.username && (
          <Dialog>
            <DialogTrigger className='p-3 px-6 bg-black rounded text-white font-bold text-sm hover:bg-gray-800'>Declarar vencedor</DialogTrigger>
            <DialogContent>
              <h1 className='text-2xl font-bold text-slate-700'>Declarar vencedor da {match.name}</h1>
              <p className='text-slate-500'>Declare o time vencedor da partida e compartilhe o número da partida encontrado no histórico da partida</p>
              <div className='grid grid-cols-2 gap-8'>
                <Card className={cn(winner === MatchTeamsEnum.BLUE && 'border-2 border-black', "cursor-pointer relative")} onClick={() => setWinner(MatchTeamsEnum.BLUE)}>
                  {winner === MatchTeamsEnum.BLUE &&
                    <Badge className='w-[102%] flex items-center justify-center absolute -left-[2px] rounded-sm'>Vencedores</Badge>
                  }
                  <CardHeader className='text-xl font-bold text-slate-700'>Time Azul</CardHeader>
                  <CardContent className='space-y-2'>
                    {match.teams[MatchTeamsEnum.BLUE].map(player => (
                      <div key={player.username} className='flex gap-2 items-center'>
                        <Avatar image={player.avatar} fallback={String(player.name).slice(0, 2)} />
                        <p className='text-slate-700 font-bold'>{player.name}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card className={cn(winner === MatchTeamsEnum.RED && 'border-2 border-black', "cursor-pointer relative")} onClick={() => setWinner(MatchTeamsEnum.RED)}>
                {winner === MatchTeamsEnum.RED &&
                    <Badge className='w-[102%] flex items-center justify-center absolute -left-[2px] rounded-sm'>Vencedores</Badge>
                  }
                  <CardHeader className='text-xl font-bold text-slate-700'>Time Vermelho</CardHeader>
                  <CardContent className='space-y-2'>
                    {match.teams[MatchTeamsEnum.RED].map(player => (
                      <div key={player.username} className='flex gap-2 items-center'>
                        <Avatar image={player.avatar} fallback={String(player.name).slice(0, 2)} />
                        <p className='text-slate-700 font-bold'>{player.name}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
              <div>
                <Label>ID da partida no League of Legends</Label>
                <Input placeholder='12342331' value={matchIdInLoL} onChange={e => setMatchIdInLoL(e.target.value)} />
              </div>
              <Button disabled={fetchingWinner} onClick={handleDeclareMatchWinner}>Finalizar partida e declarar vencedores</Button>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className='grid grid-cols-[2fr_auto_2fr] gap-4'>
        <div className={cn(
          'space-y-4',
          match.winner === MatchTeamsEnum.BLUE ? 'border-4 border-yellow-500 bg-yellow-50 p-10 rounded-lg' : 'scale-[85%] opacity-60'
        )}>
          <h1 className='text-slate-600 text-2xl font-bold'>Time Azul</h1>
          {match.teams[MatchTeamsEnum.BLUE].map((player, index: number) => (
            <QueueSlot disabled key={index} player={player} />
          ))}
        </div>
        <div className='flex items-center justify-center relative mx-8 overflow-hidden'>
          <div className={cn(
            'w-[2px] h-full absolute z-0',
            match.finished && match.winner ? 'bg-yellow-500' : 'bg-slate-200/60'
          )} />
          <Image
            src={
              match.finished && match.winner ? "/assets/winner-trophy.png" : "/assets/versus-battle.png"
            }
            alt="versus"
            width={100}
            height={100}
            className='relative z-2 bg-white border-8 border-white'
          />
        </div>
        <div className={cn('space-y-4',
           match.winner === MatchTeamsEnum.RED ? 'border-4 border-yellow-500 bg-yellow-50 p-10 rounded-lg' : 'scale-[85%] opacity-60'
        )}>
          <h1 className='text-slate-600 text-2xl font-bold text-right'>Time Vermelho</h1>
          {match.teams[MatchTeamsEnum.RED].map((player, index: number) => (
            <QueueSlot disabled key={index} player={player} />
          ))}
        </div>
      </div>
    </main>
  )
}
