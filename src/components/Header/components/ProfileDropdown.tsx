'use client';

import { signOut } from '@/app/api/auth/signout/requests'
import { UserDTO } from '@/app/api/user/types'
import { routeNames } from '@/app/route.names'
import Avatar from '@/components/Avatar'
import { CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function ProfileDropdown({ user }: { user: UserDTO }) {
  const router = useRouter();
  
  function navigateToUserProfile(username: string) {
    router.push(`${routeNames.PROFILE}/${username}`);
  }

  async function handleSignOut() {
    await signOut();
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='outline-none flex gap-2 items-center'>
        <Avatar fallback={String(user.name).slice(0, 2)} />
        <CardTitle className='text-lg text-slate-600'>{user.name}</CardTitle>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' alignOffset={-24}>
        <DropdownMenuLabel>Olá, <strong>{user?.name}</strong>.</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled onClick={() => navigateToUserProfile(user.username)}>Editar informações</DropdownMenuItem>
        <DropdownMenuItem disabled>Histórico de partidas</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
