import { signIn, handleDiscordAuth } from '@/app/api/auth/signin/requests';
import { routeNames } from '@/app/route.names';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { Button } from '../ui/button';
import Image from 'next/image';

export default function DiscordOAuth({
  disabled,
  authCode,
  onSuccess
}: { disabled?: boolean, authCode: string | null, onSuccess?: () => void }) {
  const { push, refresh } = useRouter();

  async function onSignIn(authCode: string) {
    const auth = await signIn(authCode);

    if (!auth?.success) {
      window.location.assign('/');
      return;  
    }

    push(routeNames.HOME);
    refresh();
    onSuccess?.();
  }

  useEffect(() => {
    if (authCode) onSignIn(authCode)
  }, [authCode])
  
  return (
    <Button disabled={disabled || !!authCode} onClick={handleDiscordAuth} className='bg-[#7289da] hover:bg-[#677bc4] py-6 text-white gap-2'>
    {authCode ? 'Entrando na conta...' : (
      <>
        <Image alt='Logo do aplicativo Discord' src={'/assets/icons/discord.svg'} width={24} height={24} />
        <span>Entrar com Discord</span>
      </>
    )}
  </Button>
  )
}
