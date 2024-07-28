import React from 'react'
import { Button } from '../ui/button'
import Avatar from '../Avatar'
import { LogOut, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { QueueSlotProps } from './types'

export default function QueueSlot({ player, disabled, handleKickPlayer, className, user, queue }: QueueSlotProps) {
  if (!player?.username) return (
    <Button disabled={disabled} className='w-50 h-40' variant={disabled ? "secondary" : "outline"}>
      <Plus className='text-slate-400' />
    </Button>
  )

  return (
    <div className='w-50 h-40 relative'>
      <Button className={cn(
        'w-full h-full flex flex-col gap-4 pointer-events-none space-x-2 relative',
        className,
      )} variant="outline">
        <Avatar size={16} image={player?.avatar} fallback={String(player?.name).slice(0, 2)} />
        <p className='text-md font-bold'>{player?.name}</p>
      </Button>
      {(user?.username === queue?.hoster?.username && user?.username !== player?.username) && (
        <Button onClick={() =>handleKickPlayer(player.username)} variant="destructive" className='p-2 absolute top-2 right-2 text-xs'>
          <span className='flex items-center gap-1'>Expulsar</span>
        </Button>
      )}
    </div>
  )
}
