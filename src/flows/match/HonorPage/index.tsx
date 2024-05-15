'use client';

import { honorPlayers } from '@/app/api/match/honor/requests';
import { HonorPlayerDTO, HonorPlayersRequestDTO } from '@/app/api/match/honor/types';
import { routeNames } from '@/app/route.names';
import PlayerSlot from '@/components/PlayerSlot';
import UserAvatarAndName from '@/components/UserAvatarAndName';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import { MatchItem, Player } from '@/flows/queue/types';
import { collections } from '@/services/constants';
import { firestore } from '@/services/firebase';
import { dateDifferenceInSeconds, formatSecondsInDateDifference } from '@/utils/dateDifference';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react'
import LoadingHonorPage from './components/Loading';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserDTO } from '@/app/api/user/types';
import { formatDate } from '@/utils/formatDate';
import { AvatarStack } from '@/components/Avatar/avatar-stack';

export default function HonorPage({ matchId, user }: { user?: UserDTO, matchId: string }) {
  const router = useRouter();
  const { toast } = useToast();

  const [match, setMatch] = useState<MatchItem>();
  const [votingTimeLeft, setVotingTimeLeft] = useState(0);
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
    if (match.voting?.mvp.some(player => player.votes.includes(user?.username))) {
      toast({description: 'Você já concedeu as honras para esta partida!', duration: 2500 })
      router.push(routeNames.MATCH(matchId));
      return;
    };

    getTimeLeftToCloseHonorVotes(match.voting?.endDate!);
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

  function getTimeLeftToCloseHonorVotes(endDate: string) {
    const interval = setInterval(() => {
      const time = dateDifferenceInSeconds(new Date(), new Date(endDate));

      if (time < 0) {
        router.push(`${routeNames.MATCH(matchId)}?honorsEnded=true`);
        return () => {
          clearInterval(interval)
        }
      };
      setVotingTimeLeft(time)
    }, 1000);
  };

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

    setIsVoteSubmitted(true);
    const timeout = setTimeout(() => {
      router.push(routeNames.MATCH(matchId));
      return () => clearTimeout(timeout);
    }, 2000);
  };

  return (
    <main className='max-w-[70%] m-auto space-y-14'>
      <div className='grid grid-cols-[2fr_2fr] gap-24 items-start'>
        <div className='flex flex-col justify-between h-full'>
          <h1 className='text-4xl font-bold'>Honre os jogadores da partida</h1>
          <p className='text-sm text-muted-foreground'>Vote nos jogadores que você deseja honrar como MVP, Refém ou Pedreiro, para atribuir (ou desatribuir) pontos extras aos somatórios de pontos individuais dos jogadores.</p>
          {vote?.mvp && (
            <Button
              disabled={fetchingVotes || isVoteSubmitted}
              onClick={handleHonorPlayers}
              className='w-full py-6'
            >
              {isVoteSubmitted ? "As honras foram concedidas com sucesso, voltando para histórico da partida..." : 'Confirmar as honras escolhidas'}
            </Button>
          )}
        </div>
        <div>
          {!match ? (
            <Skeleton className='w-full h-40' />
          ) : (    
          <Card className='border-transparent flex justify-between bg-secondary/50'>
            <CardHeader className='grid grid-rows-[auto_1fr] gap-4 w-full'>
              <div className='grid grid-cols-[auto_1fr] items-start'>
                <div>
                  <CardTitle>
                    <p>Partida {match?.name}</p>
                  </CardTitle>
                  <p className='text-xs flex items-center gap-1'>Criada por <strong>{match?.hoster.name}</strong></p>
                </div>
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className='ml-auto cursor-default'>
                      <h2 className='text-5xl font-bold'>{formatSecondsInDateDifference(votingTimeLeft)}</h2>
                    </TooltipTrigger>
                    <TooltipContent>As honras serão contabilizadas e concedidas <br /> automaticamente ao fim deste tempo!</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className='grid grid-cols-[auto_1fr] items-end'>
                <Image className='w-14' src="/assets/icons/default-match.png" alt='Default Match Icon' width={1000} height={1000} />
                <AvatarStack className='ml-auto' maxAvatarsAmount={10} spacing="lg" avatars={match?.players!} />
              </div>
              </CardHeader>
          </Card>
          )}
        </div>
      </div>
      {!match ? (
        <LoadingHonorPage />
      ) : (
        <div className='grid grid-cols-3 gap-4'>
          {honorOptions.map(option => (
            <Card key={option.title} className='flex flex-col items-center'>
              <CardHeader>
                <Image
                  src={option.icon}
                  alt={`Badge de honra para ${option.title}`}
                  width={1000}
                  height={1000}
                  className='w-32 h-32'
                />
              </CardHeader>
              <CardContent className='h-full flex flex-col gap-8 justify-between items-center'>
                <div className='mt-auto flex flex-col items-center gap-4'>
                  <div className='flex flex-col items-center gap-2'>
                    {option.required && <Badge variant="secondary">Obrigatório</Badge>}
                    <h1 className='text-3xl font-bold'>{option.title}</h1>
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
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}
