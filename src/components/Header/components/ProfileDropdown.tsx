'use client';

import { signOut } from '@/app/api/auth/signout/requests'
import { UserDTO } from '@/app/api/user/types'
import { routeNames } from '@/app/route.names'
import Avatar from '@/components/Avatar'
import { CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { LogOut, User2 } from 'lucide-react';
import { useRouter } from 'next/navigation'
import React from 'react'

export default function ProfileDropdown({ user }: { user: UserDTO }) {
  const router = useRouter();
  
  function navigateToUserProfile(username: string) {
    router.push(routeNames.PROFILE(username));
  }

  async function handleSignOut() {
    await signOut();
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='outline-none flex gap-2 items-center'>
        <Avatar className='w-12 h-12' image={user.avatar} fallback={String(user.name).slice(0, 2)} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='center'>
        <DropdownMenuLabel>Olá, <strong>{user?.username}</strong>!</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='gap-2 items-center' onClick={() => navigateToUserProfile(user.username)}>
          <User2 size={16} />
          Meu perfil
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='gap-2 items-center text-red-500' onClick={handleSignOut}>
          <LogOut size={16} />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
