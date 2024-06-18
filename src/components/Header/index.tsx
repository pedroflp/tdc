'use client'

import { UserDTO } from '@/app/api/user/types';
import { SunMoon } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Fragment } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import ProfileDropdown from './components/ProfileDropdown';
import { SignDialog } from './components/SignDialog';
import { routeNames } from '@/app/route.names';

export default function Header({ user }: { user: UserDTO }) {
  const { theme, setTheme } = useTheme();

  return (
    <Fragment>
      <div className='w-full bg-secondary/60 border-b-2 border-border p-4 px-16 flex justify-between items-center'>
        <div className='flex gap-8 items-center'>
          <Link href={'/'} className='text-2xl font-black text-foreground flex gap-2 items-center'>TDC</Link>
        </div>
        <div className='flex items-center gap-2'>
          <nav className='flex gap-2'>
            <Link href={routeNames.LEADBOARD}>
              <Button className='gap-2 items-center' variant="ghost">
                <Badge className='bg-emerald-500'>Novo</Badge>
                Placar de líderes
                </Button>
            </Link>
            <Link href={routeNames.MATCHES}>
              <Button variant="ghost">Partidas finalizadas</Button>
            </Link>
          </nav>
          <Button variant="ghost" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <SunMoon />
          </Button>
          {!!user ? <ProfileDropdown user={user} /> : <SignDialog />}
        </div>
      </div>
    </Fragment>
  )
}
