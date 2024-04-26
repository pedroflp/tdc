import React from 'react'
import { Button } from '../ui/button'
import Avatar from '../Avatar'
import { ClientPageRoot } from 'next/dist/client/components/client-page'

export default function QueueSlot({ player, onClick, disabled }: any) {
  if (!player.username) return (
    <Button disabled={disabled} onClick={onClick} className='min-w-60 w-full h-20' variant={disabled ? "secondary" : "outline"}>
      +
    </Button>
  )

  return (
    <Button className='min-w-60 w-full h-20 pointer-events-none space-x-2' variant="outline">
      <Avatar image={player?.avatar} fallback={String(player?.name).slice(0, 2)} />
      <p className='text-lg font-bold text-slate-700'>{player?.name}</p>
    </Button>
  )
}
