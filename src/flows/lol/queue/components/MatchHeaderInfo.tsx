import Avatar from '@/components/Avatar'
import React from 'react'
import { QueueItem } from '../types'
import { Button } from '@/components/ui/button'
import { LogOut, ShieldAlert, Trash, Trash2 } from 'lucide-react'
import { UserDTO } from '@/app/api/user/types'
import UserAvatarAndName from '@/components/UserAvatarAndName'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export default function QueueHeader({
  queue,
  user,
  onDeleteQueue,
  onExitQueue,
  handleUnlockUserToJoin
}: { queue: QueueItem, user?: UserDTO, onDeleteQueue: () => void, onExitQueue: (user: UserDTO["username"]) => void, handleUnlockUserToJoin: (user: UserDTO["username"]) => void }) {
  if (!queue || !user) return null;
  
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-4xl font-bold '>Sala da {queue.name}</h1>
        {user.username === queue.hoster.username
          ? (
            <div className='flex gap-4'>
              {queue.blackList && queue.blackList.length > 0 &&
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className='gap-2' variant="secondary">
                      <ShieldAlert />
                      Usuários bloqueados
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent sideOffset={12} className='space-y-4 shadow-lg shadow-primary/5'>
                    <p className='text-xs'>Usuários bloqueados de entrar na sala e participar da partida:</p>
                    {queue.blackList.map((username) => (
                      <div key={username} className='flex items-center gap-4 justify-between'>
                        <strong>{username}</strong>
                        <Button className='text-xs' onClick={() => handleUnlockUserToJoin(username)} variant="secondary">Desbloquear</Button>
                      </div>
                    ))}
                  </PopoverContent>
                </Popover>
              }
              <Button className='gap-2' onClick={onDeleteQueue} variant="destructive">
                <Trash2 />
                Fechar e excluir sala
              </Button>
            </div>
          )
          : (
            <Popover>
              <PopoverTrigger asChild>
                <Button className='gap-2' variant="destructive">
                  <LogOut size={16} />
                  Sair desta sala
                </Button>
              </PopoverTrigger>
              <PopoverContent align='end' className='w-[400px]'>
                <p>
                  <strong>Sair de uma sala bloqueará que você entre novamente!</strong> <br />
                  O Host precisará desbloquear para que você consiga entrar.
                </p>
                <Button className='mt-4 w-full gap-2' onClick={() => onExitQueue(user.username)} variant="destructive">
                  <LogOut size={16} />
                  Sair mesmo assim
                </Button>
              </PopoverContent>
            </Popover>
          )
        }
      </div>

      <p className='text-muted-foreground/50'>Aguardando novos jogadores preencherem as vagas da disputa para ser possível iniciar a competição.</p>
    </div>
  )
}
