import Avatar from '@/components/Avatar'
import React from 'react'
import { QueueItem } from '../types'
import { Button } from '@/components/ui/button'

export default function QueueHeader({ queue, user, onDeleteQueue }: { queue: QueueItem, user: any, onDeleteQueue: any }) {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-4xl font-bold '>Lobby da Partida</h1>
          <span className='flex items-center text-muted-foreground gap-2'>
            {queue.name} de
            <Avatar className='w-8 h-8' fallbackSize='text-xs' image={queue?.hoster?.avatar} fallback={String(queue?.hoster?.name).slice(0, 2)} />{queue?.hoster?.name}
          </span>
        </div>
        {user?.username === queue?.hoster?.username && <Button onClick={onDeleteQueue} variant="destructive">Fechar partida</Button>}
      </div>

      <p className='text-muted-foreground/50'>Selecione um slot para entrar no lobby de espera e participar da composição de time e formação da partida!</p>
    </div>
  )
}
