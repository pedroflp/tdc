import React from 'react'
import Avatar from '../Avatar'
import { UserDTO } from '@/app/api/user/types';
import { Player } from '@/flows/queue/types';
import { cn } from '@/lib/utils';

export default function UserAvatarAndName({
  user,
  avatarClassName,
  size,
  fallbackSize,
  nameSize = "text-lg"
}: { 
  user: UserDTO | Player, 
  avatarClassName?: string,
  size?: number;
  fallbackSize?: "text-xs" | "text-sm" | "text-md" | "text-lg";
  nameSize?: "text-xs" | "text-sm" | "text-md" | "text-lg" | "text-xl"
}) {
  if (!user) return null;

  return (
    <div className='flex items-center gap-2'>
      <Avatar className={avatarClassName} fallbackSize={fallbackSize} size={size} fallback={String(user?.name ?? user?.username).slice(0, 2)} image={user?.avatar} />
      <p className={cn(
        'font-bold text-foreground',
        nameSize
      )}>{user?.username}</p>
    </div>
  )
}
