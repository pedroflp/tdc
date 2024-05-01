import Avatar from '@/components/Avatar'
import React from 'react'
import { QueueItem } from '../types'
import { Button } from '@/components/ui/button'

export default function QueueHeader({ queue, user, onDeleteQueue }: { queue: QueueItem, user: any, onDeleteQueue: any }) {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
        <h1 className='text-3xl font-bold text-slate-800'>{queue?.name}</h1>
        <span className='flex items-center gap-2'>
          Partida de
          <span className='flex gap-1 items-center'>
            <Avatar className='w-8 h-8' image={queue?.hoster?.avatar} fallback={String(queue?.hoster?.name).slice(0, 2)} />
            <strong>{queue?.hoster?.name}</strong>
          </span>
        </span>
      </div>
        {user?.username === queue?.hoster?.username && <Button onClick={onDeleteQueue} variant="destructive">Fechar partida</Button>}
      </div>

      <p className='text-sm text-slate-500'>Entre nos slots para participar da partida!</p>
    </div>
  )
}
