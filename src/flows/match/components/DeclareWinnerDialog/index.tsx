import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { MatchItem, MatchTeamsEnum } from '@/flows/queue/types'
import { cn } from '@/lib/utils'
import React, { useState } from 'react'
import { updateMatch } from '@/app/api/match/requests'
import { Badge } from '@/components/ui/badge'
import Avatar from '@/components/Avatar'

export default function DeclareWinnerDialog({ winner, setWinner, match }: {
  match: MatchItem,
  winner: MatchTeamsEnum | undefined,
  setWinner: React.Dispatch<React.SetStateAction<MatchTeamsEnum | undefined>>
}) {
  const [fetchingWinner, setFetchingWinner] = useState(false);

  const matchTeams = [
    {
      name: 'Time Azul',
      value: MatchTeamsEnum.BLUE,
    },
    {
      name: 'Time Vermelho',
      value: MatchTeamsEnum.RED,
    }
  ];

  async function handleDeclareMatchWinner() {
    setFetchingWinner(true);
    if (!match || !winner) return;

    await updateMatch(match.id, match.queueId, {
      winner,
      voting: {
        endDate: new Date(new Date().setMinutes(new Date().getMinutes() + 2)).toISOString(),
        mvp: [],
        hostage: [],
        bricklayer: []
      },
      finished: true
    } as MatchItem);

    setFetchingWinner(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Declarar vencedor</Button>
      </DialogTrigger>
      <DialogContent>
        <h1 className='text-2xl font-bold'>Declarar vencedor da partida</h1>
        <p className='text-muted-foreground'>Declare o time vencedor da <strong>{match.name}</strong> para distrubuir os pontos e dar a vitória.</p>
        <div className='grid grid-cols-2 gap-8'>
          {matchTeams.map(team => (
            <Card
              key={team.value}
              className={
              cn(
                winner === team.value && 'border-2 border-primary',
                "cursor-pointer relative"
              )}
              onClick={() => setWinner(team.value)}
            >
              {winner === team.value &&
                <Badge className='w-[102%] flex items-center justify-center absolute -left-[2px] rounded-sm'>Vencedores</Badge>
              }
              <CardHeader className='text-xl font-bold mt-2'>{team.name}</CardHeader>
              <CardContent className='space-y-2'>
                {match.teams[team.value].map(player => (
                  <div key={player.username} className='flex gap-2 items-center'>
                    <Avatar image={player.avatar} fallback={String(player.name).slice(0, 2)} />
                    <p className='font-bold'>{player.name}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
        <Button disabled={fetchingWinner} onClick={handleDeclareMatchWinner}>Finalizar partida e declarar vencedores</Button>
      </DialogContent>
    </Dialog>
  )
}
