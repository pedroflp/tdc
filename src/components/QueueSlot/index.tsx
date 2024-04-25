import React from 'react'
import { Button } from '../ui/button'
import { Avatar } from '../ui/avatar'

export default function QueueSlot({ user, onClick }: any) {
  return (
    <Button disabled={!!user} onClick={onClick} className='w-60 h-20' variant="secondary">
      {user ? <span><strong>{user.name}</strong> {user.ready ? "✅" : "❌"}</span> : "+"}
    </Button>
  )
}
