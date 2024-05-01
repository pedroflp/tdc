import Avatar from '@/components/Avatar'
import React from 'react'
import { QueueItem } from '../types'
import { Button } from '@/components/ui/button'

export default function QueueHeader({ queue, user, onDeleteQueue }: { queue: QueueItem, user: any, onDeleteQueue: any }) {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-4xl font-bold text-slate-700'>Lobby da Partida</h1>
          <span className='flex items-center text-slate-400 gap-2'>
            {queue.name} de
            <Avatar size={6} fallbackSize='text-xs' image={queue?.hoster?.avatar} fallback={String(queue?.hoster?.name).slice(0, 2)} />{queue?.hoster?.name}
          </span>
        </div>
        {user?.username === queue?.hoster?.username && <Button onClick={onDeleteQueue} variant="destructive">Fechar partida</Button>}
      </div>

      <p className='text-slate-500'>Selecione um slot para entrar no lobby de espera e participar da composição de time e formação da partida!</p>
    </div>
  )
}
