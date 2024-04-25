'use client';

import { signIn } from '@/app/api/auth/signin/requests';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Avatar from '../Avatar';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { routeNames } from '@/app/route.names';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Input } from '../ui/input';

export default function Header({ user }: any) {
  const router = useRouter();

  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [username, setUsername] = useState("");

  async function handleSignIn() {
    setIsCreatingAccount(true);
    await signIn(username);
    router.refresh();
    setIsCreatingAccount(false)
  }

  function navigateToUserProfile(userId: string) {
    router.push(`${routeNames.PROFILE}/${userId}`);
  }

  return (
    <div className='w-screen border-b-[1px] border-slate-300 p-4 px-16 flex justify-between items-center'>
      <Link href={'/'} className='text-2xl font-black text-slate-800'>TDCLOL</Link>
      {!!user ? (
        <DropdownMenu>
          <DropdownMenuTrigger className='outline-none'>
            <Avatar fallback={String(user?.name).slice(0,2)} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' alignOffset={-24}>
            <DropdownMenuLabel>Olá, <strong>{user?.name}</strong>.</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled onClick={() => navigateToUserProfile(user)}>Editar informações</DropdownMenuItem>
            <DropdownMenuItem disabled>Histórico de partidas</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Popover>
          <PopoverTrigger>
            <Button>Entrar ou criar conta</Button>
          </PopoverTrigger>
            <PopoverContent className='w-full' align='end' alignOffset={-24}>
              <div className='flex gap-8'>
                {!!user && (
                  <div>
                    <h1 className='font-bold text-xl text-slate-800'>Entrar como</h1>
                    <Button>Entrar</Button>
                  </div>
                )}
                <div className='flex flex-col gap-2'>
                  <h1 className='font-bold text-xl text-slate-800'>Criar conta</h1>
                  <Input placeholder='Nome (min. 3 caracteres)' value={username} onChange={(e) => setUsername(e.target.value)} />  
                  <Button className='w-full min-w-[240px]' variant="outline" disabled={username.length < 3 || isCreatingAccount} onClick={handleSignIn}>{
                    username.length < 3 ? "Crie um nome para continuar" :
                    isCreatingAccount ? "Criando sua conta..." : "Criar minha conta"}
                  </Button>
                </div>
              </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
