'use client';

import { UserDTO } from '@/app/api/user/types';
import { routeNames } from '@/app/route.names';
import { collections } from '@/services/constants';
import { firestore } from '@/services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { ArrowRight, SunMoon } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import ProfileDropdown from './components/ProfileDropdown';
import { SignDialog } from './components/SignDialog';

export default function Header({ user }: { user: UserDTO }) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const [userData, setUserData] = useState<UserDTO>();

  function getUserData() {
    if (!user) return;

    const sub = onSnapshot(doc(firestore, collections.USERS, user.username), (doc) => {
      if (!doc.exists()) return;

      setUserData(doc.data() as UserDTO);
    });

    return () => sub;
  }

  useEffect(() => {
    getUserData()
  }, [])

  return (
    <Fragment>
      {userData?.activeMatch && pathname === routeNames.HOME && (
        <Link href={routeNames.QUEUE(userData.activeMatch)} className='flex items-center justify-between w-screen bg-emerald-400 p-4 px-16'>
          <span className='text-xl font-black text-slate-900'>Você está participando de uma partida ainda ativa!</span>
          <Button className='gap-2 text-slate-900' variant="link">
            <span className='text-lg font-bold'>Ir para sala da partida</span>
            <ArrowRight />
          </Button>
        </Link>
      )}
      <div className='w-screen bg-secondary/60 border-b-2 border-border p-4 px-16 flex justify-between items-center'>
        <Link href={'/'} className='text-2xl font-black text-foreground flex gap-2 items-center'>TDC <Badge>BETA</Badge></Link>
        <div className='flex items-center gap-2'>
          <Button variant="ghost" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <SunMoon />
          </Button>
          {!!userData ? <ProfileDropdown user={userData} /> : <SignDialog />}
        </div>
      </div>
    </Fragment>
  )
}
