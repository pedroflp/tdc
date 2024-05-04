import React from 'react'
import { Button } from '../ui/button'
import Avatar from '../Avatar'
import { LogOut, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function QueueSlot({ player, onClick, onRemove, disabled, className, user, queue }: any) {
  if (!player?.username) return (
    <Button disabled={disabled} onClick={onClick} className='min-w-60 w-full h-20' variant={disabled ? "secondary" : "outline"}>
      <Plus className='text-slate-400' />
    </Button>
  )

  return (
    <div className='relative'>
      <Button className={cn(
        'min-w-60 w-full h-20 pointer-events-none space-x-2 relative',
        className,
      )} variant="outline">
        <Avatar image={player?.avatar} fallback={String(player?.name).slice(0, 2)} />
        <p className='text-lg font-bold'>{player?.name}</p>
      </Button>
      {(
        (user?.username === queue?.hoster?.username && user?.username !== player?.username) ||
        (user?.username !== queue?.hoster?.username && user?.username === player?.username)
      ) && (
        <Button onClick={onRemove} variant="destructive" className='absolute top-[25%] right-4 text-xs'>{
          user.username === player.username ? (
            <span className='flex items-center gap-2'><LogOut size={14} /></span>
          ) : (
            <span className='flex items-center gap-1'><X size={14} /></span>
          )
        }</Button>
      )}
    </div>
  )
}
