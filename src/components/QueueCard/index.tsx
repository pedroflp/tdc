import React, { useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { formatDate } from '@/utils/formatDate'
import { AvatarStack } from '../Avatar/avatar-stack'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

export default function QueueCard({ queue, disableJoinByAuth, disabledJoinByStarted, handleEnterQueue }: any) {
  const QueueBadgeStatus = useCallback(({match}: any) => {
    if (match?.started) return <Badge>Iniciada</Badge>
    if (match?.finished) return <Badge variant="outline">Finalizada</Badge>
    return <Badge variant="secondary">Em preparação</Badge>;
  }, []);

  const QueueJoinButton = useCallback(({disableJoinByAuth, disabledJoinByStarted, onClick}: any) => {
    if (disableJoinByAuth) return <Button variant="outline" disabled>Faça login para participar</Button>
    if (disabledJoinByStarted) return <Button disabled>Partida já iniciada</Button>
    return <Button onClick={onClick}>Participar da partida</Button>;
  }, []);

  return (
    <Card className="min-w-[500px] w-full">
      <CardHeader className="flex flex-row justify-between gap-16 items-center mb-4">
        <div className="flex gap-4">
          <CardTitle className='text-xl text-slate-800'>{queue.name}</CardTitle>
          <QueueBadgeStatus match={queue.match} />
        </div>
      <AvatarStack spacing="lg" id="avatar-stack" avatars={queue.players} />
      </CardHeader>
      <CardContent className="flex justify-between items-center gap-4">
        <div className="text-sm text-slate-700">
          <div className="flex gap-1 items-center">
            <p>Partida de</p>
            <div className="flex gap-1 items-center">
            <Avatar className='w-6 h-6'>
              <AvatarImage className='object-cover rounded-full' src={queue.hoster.avatar} />
              <AvatarFallback className='text-xs font-bold text-slate-500 uppercase'>{queue.hoster.name.slice(0,2)}</AvatarFallback>
            </Avatar>
              <strong className="flex items-center gap-1">{queue.hoster.name}</strong></div>
          </div>
          <p>Criada em <strong>{formatDate(queue.createdAt)}</strong></p>
        </div>
        <QueueJoinButton
          disableJoinByAuth={disableJoinByAuth}
          disabledJoinByStarted={disabledJoinByStarted}
          onClick={() => handleEnterQueue(queue.id)}
        />
      </CardContent>
    </Card>
  )
}
