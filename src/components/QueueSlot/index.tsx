import React from 'react'
import { Button } from '../ui/button'
import { Avatar } from '../ui/avatar'

export default function QueueSlot({ player, onClick }: any) {
  return (
    <Button disabled={!!player} onClick={onClick} className='w-60 h-20' variant="secondary">
      {player ? <span><strong>{player.name}</strong> {player.ready ? "✅" : "❌"}</span> : "+"}
    </Button>
  )
}
