'use client';

import { honorPlayers } from '@/app/api/lol/match/honor/requests';
import { HonorPlayersRequestDTO } from '@/app/api/lol/match/honor/types';
import { UserDTO } from '@/app/api/user/types';
import { routeNames } from '@/app/route.names';
import { AvatarStack } from '@/components/Avatar/avatar-stack';
import UserAvatarAndName from '@/components/UserAvatarAndName';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import { MatchItem, Player } from '@/flows/lol/queue/types';
import { collections } from '@/services/constants';
import { firestore } from '@/services/firebase';
import { dateDifferenceInSeconds, formatSecondsInDateDifference } from '@/utils/dateDifference';
import { doc, getDoc } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import LoadingHonorPage from './components/Loading';
import { cn } from '@/lib/utils';
import Countdown from 'react-countdown';

export default function HonorPage({ matchId, user }: { user?: UserDTO, matchId: string }) {
  const router = useRouter();
  const { toast } = useToast();

  const [match, setMatch] = useState<MatchItem>();
  const [fetchingVotes, setFetchingVotes] = useState(false);
  const [isVoteSubmitted, setIsVoteSubmitted] = useState(false);
  const [vote, setVote] = useState({
    mvp: "",
    hostage: "",
    bricklayer: ""
  });

  async function getMatchData() {
    if (!user) return;

    const matchDoc = await getDoc(doc(firestore, collections.MATCHES, matchId));
    const match = matchDoc.data() as MatchItem; 

    if (!matchDoc.exists()) return router.push(routeNames.HOME);
    if (match.players.find(player => player.username === user?.username)?.alreadyHonored) {
      toast({title: 'Não é possível mais votar!',description: 'Você já concedeu as honras para esta partida, e por isso não pode votar mais!', duration: 2500 })
      router.push(routeNames.MATCH(matchId));
    };

    setMatch(match);
  }
  
  useEffect(() => {
    getMatchData();
  }, []);

  const players = useMemo(() => {
    if (!match) return null;
    return match.players.reduce((players, player) => {
      const winnerPlayer = match.teams[match.winner].find(p => p.username === player.username);
      if (winnerPlayer) players.mvps.push(winnerPlayer as any);
      else players.bricklayersOrHostages.push(player as any);

      return players;
    }, {
      mvps: [] as Array<Player>,
      bricklayersOrHostages: [] as Array<Player>,
    });
  }, [match]);

  const honorOptions = useMemo(() => {
    return [
      {
        icon: '/assets/icons/mvp.png',
        title: 'MVP',
        description: 'Escolha e honre o melhor jogador da partida!',
        disclaimer: 'O MVP ganhará +30% de pontos da quantidade recebida pela vitória!',
        onSelect: (player: Player['username']) => setVote({ ...vote, mvp: player }),
        disableSelectItem: () => false,
        options: players?.mvps,
        required: true
      },
      {
        icon: '/assets/icons/hostage.png',
        title: 'Refém',
        description: 'Escolha e honre o melhor jogador do time perdedor!',
        disclaimer: 'O Refém perderá apenas 70% de pontos da quantidade retirada pela derrota!',
        onSelect: (player: Player['username']) => setVote({ ...vote, hostage: player }),
        disableSelectItem: (player: Player['username']) => player === vote.bricklayer,
        options: players?.bricklayersOrHostages
      },
      {
        icon: '/assets/icons/bricklayer.png',
        title: 'Pedreiro',
        description: 'Escolha e (des)honre o pior jogador da partida!',
        disclaimer: 'O Pedreiro perderá +20% de pontos da quantidade retirada pela derrota!',
        onSelect: (player: Player['username']) => setVote({ ...vote, bricklayer: player }),
        disableSelectItem: (player: Player['username']) => player === vote.hostage,
        options: players?.bricklayersOrHostages
      },
    ]
  }, [players, vote]);

  async function handleHonorPlayers() {
    if (!user) return;
    
    setFetchingVotes(true);
    const response = await honorPlayers({
      matchId,
      honors: vote as HonorPlayersRequestDTO["honors"],
      honoredBy: user.username,
    });

    if (!response.success) {
      setFetchingVotes(false);
      return;
    }

    toast({title: 'Honras enviadas!', description: 'Você votou nos jogadores honrados dessa partida! Estamos voltando para overview da partida!', duration: 4000 })
    router.push(routeNames.MATCH(matchId));
    setIsVoteSubmitted(true);
  };

  return (
    <main className='max-w-[70%] m-auto space-y-14'>
      <div className='grid grid-cols-[2fr_2fr] gap-24 items-center'>
        <div className='space-y-4'>
          <h1 className='text-3xl font-bold'>Honras da partida</h1>
          <p className='text-sm text-muted-foreground'>Vote nos jogadores que você deseja honrar como MVP, Refém ou Pedreiro, para atribuir (ou desatribuir) pontos extras aos somatórios de pontos individuais dos jogadores.</p>
        </div>
        <div>
          {!match ? (
            <Skeleton className='w-full h-24' />
          ) : (    
            <div className='flex flex-col justify-end gap-4'>
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger className='ml-auto cursor-default'>
                    <Countdown
                      date={new Date(match?.honors?.endDate!)}
                      renderer={({ minutes, seconds }) => <h2 className='text-5xl font-bold'>{formatSecondsInDateDifference(minutes * 60 + seconds)}</h2>}
                    />
                  </TooltipTrigger>
                  <TooltipContent>As honras serão contabilizadas e concedidas <br /> automaticamente ao fim deste tempo!</TooltipContent>
                </Tooltip>
                </TooltipProvider>
                <Button
                  disabled={fetchingVotes || isVoteSubmitted || !vote.mvp}
                  onClick={handleHonorPlayers}
                  loading={fetchingVotes}
                  className='w-full py-6'
                >
                {isVoteSubmitted ? "As honras foram concedidas com sucesso..." : 'Confirmar as honras escolhidas'}
              </Button>
            </div>
          )}
        </div>
      </div>
      {!match ? (
        <LoadingHonorPage />
      ) : (
        <div className='grid grid-cols-3 gap-4'>
          {honorOptions.map(option => (
            <Card key={option.title} className='bg-gradient-to-tl from-secondary/60 flex flex-col items-center relative overflow-hidden'>
              <CardHeader>
                <Image
                  src={option.icon}
                  alt={`Badge de honra para ${option.title}`}
                  width={1000}
                  height={1000}
                  className='w-24 h-24'
                />
              </CardHeader>
              <CardContent className='h-full relative z-[2] flex flex-col gap-8 justify-between items-center'>
                <div className='mt-auto flex flex-col items-center gap-4'>
                  <div className='flex items-center gap-2'>
                    <h1 className='text-3xl font-bold'>{option.title}</h1>
                    {option.required && <Badge>Obrigatório</Badge>}
                  </div>
                  <p className='text-center text-sm text-muted-foreground'>{option.description} <br />
                    <strong>{option.disclaimer}</strong>
                  </p>
                </div>
                <Select onValueChange={option.onSelect}>
                  <SelectTrigger className="w-full h-16">
                    <SelectValue placeholder={`Escolher jogador ${option.title} da partida`} />
                  </SelectTrigger>
                  <SelectContent>
                    {option.options?.map(player => (
                      <SelectItem key={player.username} disabled={option.disableSelectItem(player.username)} value={player.username}>
                        <UserAvatarAndName user={player} />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
              <Image
                src={option.icon}
                alt={`Badge de honra para ${option.title}`}
                width={1000}
                height={1000}
                className='w-90 h-90 absolute -bottom-16 -right-32 rotate-12 blur-md opacity-10'
              />
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}
