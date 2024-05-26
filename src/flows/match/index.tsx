'use client';

import { UserDTO } from '@/app/api/user/types';
import { routeNames } from '@/app/route.names';
import Avatar from '@/components/Avatar';
import PlayerSlot from '@/components/PlayerSlot';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { collections } from '@/services/constants';
import { firestore } from '@/services/firebase';
import { dateDifferenceInSeconds, formatSecondsInDateDifference } from '@/utils/dateDifference';
import { doc, onSnapshot } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { MatchItem, MatchTeamsEnum } from '../queue/types';
import DeclareWinnerDialog from './components/DeclareWinnerDialog';
import Countdown from 'react-countdown';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function MatchPage({ user, matchId }: {user?: UserDTO, matchId: string}) {
  const router = useRouter();
  
  const [match, setMatch] = useState<MatchItem>();
  const [winner, setWinner] = useState<MatchTeamsEnum>();

  const isUserInThisMatch = useCallback((match: MatchItem) => {
    if (!match) return false;
    return match.players?.some(player => player?.username === user?.username)
  }, [user]);

  const canUserVoteHonorsThisMatch = useCallback((match: MatchItem, user: UserDTO, isUserInThisMatch: (match: MatchItem) => boolean) => {
    if (!match || !user) return false;

    return (
      match.finished &&
      !!match.honors &&
      isUserInThisMatch(match) &&
      dateDifferenceInSeconds(new Date(), new Date(match.honors?.endDate!)) >= 0 &&
      !match.honors.finished &&
      !match.players.find(player => player.username === user.username)?.alreadyHonored
    )
  }, []);
  
  function getMatchData() {
    return onSnapshot(doc(firestore, collections.MATCHES, matchId), (doc) => {
      if (!doc.exists()) return router.push(routeNames.HOME);

      const match = doc.data() as MatchItem;
      setMatch(match);
    })
  };

  useEffect(() => {
    const unsubscribe = getMatchData();
    return () => unsubscribe();
  }, []);

  if (!match) return;

  
  return (
    <main className='flex flex-col m-auto gap-12 min-w-[60%] w-full max-w-[60%]'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-4xl font-bold'>Partida {match.finished ? 'finalizada!' : 'em andamento...'}</h1>
          <h2 className='flex gap-2 items-center text-muted-foreground'>{match.name} de
            <span className='flex gap-1 items-center'>
              <Avatar image={match.hoster.avatar} className='w-7 h-7'  fallbackSize='text-xs' fallback={String(match.hoster.name).slice(0, 2)} />{match.hoster.name}
            </span>
          </h2>
        </div>
        <div className='flex gap-8 items-center'>
          {!match.honors?.finished && (
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
          )}
          {canUserVoteHonorsThisMatch(match, user!, isUserInThisMatch) ? (
            <Button className='text-xl p-8 gap-4 font-bold' onClick={() => router.push(routeNames.MATCH_HONOR(matchId))}>
              Honrar jogadores
            </Button>
          ) : (
            match.finished
            ? (
              <Link href={routeNames.HOME}>
                <Button variant="outline">Voltar para o início</Button>
              </Link>
            )
            : match?.hoster?.username === user?.username && (
              <DeclareWinnerDialog
                match={match}
                winner={winner}
                setWinner={setWinner}
              />
            )
          )
        }
        </div>
      </div>
      <div className='grid grid-cols-[2fr_auto_2fr] gap-4'>
      <div className='space-y-4'>
          <h1 className={cn('text-3xl font-bold text-left', match?.winner === MatchTeamsEnum.BLUE && 'text-yellow-500')}>{match?.winner === MatchTeamsEnum.BLUE && 'Vencedores - '} Time Azul</h1>
          {match.teams[MatchTeamsEnum.BLUE].map((player, index: number) => (
            <PlayerSlot match={match} className={cn(match?.winner === MatchTeamsEnum.BLUE && 'border-[1px] text-yellow-500 bg-yellow-500/15 border-yellow-400')} key={index} player={player} />
          ))}
        </div>
        <div className='flex items-center justify-center relative mx-4 overflow-hidden'>
          <div className={cn(
            'w-[2px] h-full absolute z-0',
            match.finished && match.winner ? 'bg-yellow-400' : 'bg-border/50'
          )} />
          <Image
            src="/assets/icons/match-versus.png"
            alt="Match team versus team badge"
            width={100}
            height={100}
            className='relative z-2 bg-background border-8 border-background'
          />
        </div>
        <div className='space-y-4'>
          <h1 className={cn('text-3xl font-bold text-right', match?.winner === MatchTeamsEnum.RED && 'text-yellow-500')}>{match?.winner === MatchTeamsEnum.RED && 'Vencedores - '} Time Vermelho</h1>
          {match.teams[MatchTeamsEnum.RED].map((player, index: number) => (
            <PlayerSlot match={match} className={cn(match?.winner === MatchTeamsEnum.RED && 'border-[1px] text-yellow-500 bg-yellow-500/15 border-yellow-400')} key={index} player={player} />
          ))}
        </div>
      </div>
    </main>
  )
}
