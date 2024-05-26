'use client';

import { signOut } from '@/app/api/auth/signout/requests';
import { UserDTO } from '@/app/api/user/types';
import { routeNames } from '@/app/route.names';
import Avatar from '@/components/Avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfileDropdown({ user }: { user: UserDTO }) {
  const router = useRouter();
  
  async function handleSignOut() {
    await signOut();
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='outline-none flex gap-2 items-center'>
        <Avatar size={12} image={user.avatar} fallback={String(user.name).slice(0, 2)} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='center'>
        <DropdownMenuLabel>Olá, <strong>{user?.username}</strong>!</DropdownMenuLabel>
        <DropdownMenuSeparator />
          <Link  href={routeNames.PROFILE(user?.username)}>
            <DropdownMenuItem className='flex gap-2 items-center cursor-pointer '>
              <User size={16} />
              Perfil
            </DropdownMenuItem>
          </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem  className='cursor-pointer flex gap-2 items-center text-red-500 focus:bg-red-600/70' onClick={handleSignOut}>
          <LogOut size={16} />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
