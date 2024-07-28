import Avatar from '@/components/Avatar'
import React from 'react'
import { QueueItem } from '../types'
import { Button } from '@/components/ui/button'
import { LogOut, Trash } from 'lucide-react'
import { UserDTO } from '@/app/api/user/types'

export default function QueueHeader({ queue, user, onDeleteQueue, onExitQueue }: { queue: QueueItem, user: UserDTO, onDeleteQueue: () => void, onExitQueue: (user: UserDTO["username"]) => void }) {
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
        {user?.username === queue?.hoster?.username
          ? <Button className='gap-2' onClick={onDeleteQueue} variant="destructive">
            <Trash size={16} />
            Fechar e excluir sala
          </Button>
          : <Button className='gap-2' onClick={() => onExitQueue(user.username)} variant="destructive">
            <LogOut size={16} />
            Sair desta sala
          </Button>
        }
      </div>

      <p className='text-muted-foreground/50'>Selecione um slot para entrar no lobby de espera e participar da composição de time e formação da partida!</p>
    </div>
  )
}
