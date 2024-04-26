'use client';

import { signIn } from '@/app/api/auth/signin/requests';
import { signUp } from '@/app/api/auth/signup/requests';
import { routeNames } from '@/app/route.names';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Avatar from '../Avatar';
import { CardTitle } from '../ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { SignDialog } from './components/SignDialog';
import { signOut } from '@/app/api/auth/signout/requests';

export default function Header({ user }: any) {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  async function handleSignIn() {
    setIsAuthenticating(true);
    setAuthError(null);

    const response = await signIn(String(username).toLocaleLowerCase(), password);

    if (!response.success && response.error) { 
      setAuthError(response.error)
    } else {
      router.refresh();
    }

    setIsAuthenticating(false);
  }

  async function handleSignUp() {
    setIsCreatingAccount(true);

    const response = await signUp(String(username).toLocaleLowerCase(), password);

    if (!response.success && response.error) {
      setAuthError(response.error)
    } else {
      router.refresh();
    }

    setIsCreatingAccount(false)
  }

  async function handleSignOut() {
    await signOut();
    router.refresh();
  }

  function navigateToUserProfile(userId: string) {
    router.push(`${routeNames.PROFILE}/${userId}`);
  }

  return (
    <div className='w-screen border-b-[1px] border-slate-300 p-4 px-16 flex justify-between items-center'>
      <Link href={'/'} className='text-2xl font-black text-slate-800'>TDCLOL</Link>
      {!!user ? (
        <DropdownMenu>
          <DropdownMenuTrigger className='outline-none flex gap-2 items-center'>
            <Avatar fallback={String(user.name).slice(0, 2)} />
            <CardTitle className='text-lg text-slate-600'>{user.name}</CardTitle>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' alignOffset={-24}>
            <DropdownMenuLabel>Olá, <strong>{user?.name}</strong>.</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled onClick={() => navigateToUserProfile(user)}>Editar informações</DropdownMenuItem>
            <DropdownMenuItem disabled>Histórico de partidas</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className='flex gap-4'>
          <SignDialog
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            handleSignIn={handleSignIn}
            handleSignUp={handleSignUp}
            isAuthenticating={isAuthenticating}
            isCreatingAccount={isCreatingAccount}
            authError={authError}
            setAuthError={setAuthError}
          />
        </div>
      )}
    </div>
  )
}
