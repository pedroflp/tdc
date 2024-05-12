import React from 'react'
import Avatar from '../Avatar'
import { UserDTO } from '@/app/api/user/types';

export default function UserAvatarAndName({
  user
}: { user: UserDTO}) {
  if (!user) return null;

  return (
    <div className='flex items-center gap-2'>
      <Avatar image={user?.avatar} fallback={String(user?.username).slice(0, 2)} />
      <p className='text-lg font-bold text-foreground'>{user?.username}</p>
    </div>
  )
}
