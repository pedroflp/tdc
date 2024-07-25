import React from 'react'
import Avatar from '../Avatar'
import { UserDTO } from '@/app/api/user/types';
import { Player } from '@/flows/lol/queue/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { routeNames } from '@/app/route.names';

export default function UserAvatarAndName({
  user,
  avatarClassName,
  size,
  fallbackSize,
  canOpenProfileByAvatar,
  name = {
    size: "text-lg",
    color: "text-foreground"
  }
}: { 
  user: UserDTO | Player, 
  avatarClassName?: string,
  size?: number;
  fallbackSize?: "text-xs" | "text-sm" | "text-md" | "text-lg";
  name?: {
    size?: "text-xs" | "text-sm" | "text-md" | "text-lg" | "text-xl",
    color?: string
  },
  canOpenProfileByAvatar?: boolean;
}) {
  if (!user) return null;

  return (
    <Link href={routeNames.PROFILE(user.username)} className={cn(
      'flex items-center gap-2',
      !canOpenProfileByAvatar && 'pointer-events-none'
    )}>
      <Avatar className={avatarClassName} fallbackSize={fallbackSize} size={size} fallback={String(user?.name ?? user?.username).slice(0, 2)} image={user?.avatar} />
      <p className={cn(
        'font-bold text-foreground',
        name.size, name.color
      )}>{user?.username}</p>
    </Link>
  )
}
