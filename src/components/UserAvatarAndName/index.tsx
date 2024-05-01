import React from 'react'
import Avatar from '../Avatar'

export default function UserAvatarAndName({
  user
}: any) {
  if (!user) return null;

  return (
    <div>
      <Avatar image={user?.avatar} fallback={String(user?.name).slice(0, 2)} />
      <p className='text-lg font-bold text-slate-700'>{user?.name}</p>
    </div>
  )
}
