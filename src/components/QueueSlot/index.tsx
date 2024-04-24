import React from 'react'
import { Button } from '../ui/button'
import { Avatar } from '../ui/avatar'

export default function QueueSlot({ user, onClick }: any) {
  return (
    <div className='w-24'>
      <Button disabled={!!user} onClick={onClick} className='w-full' variant="secondary">
        {user ? <span><strong>{user.name}</strong> {user.ready ? "✅" : "❌"}</span> : "+"}
      </Button>
    </div>
  )
}
