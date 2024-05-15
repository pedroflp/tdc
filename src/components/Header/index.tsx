'use client';

import Link from 'next/link';
import ProfileDropdown from './components/ProfileDropdown';
import { SignDialog } from './components/SignDialog';
import { UserDTO } from '@/app/api/user/types';
import { Badge } from '../ui/badge';
import { useTheme } from 'next-themes';
import { Button } from '../ui/button';
import { Moon, Sun, SunMoon } from 'lucide-react';

export default function Header({ user }: { user: UserDTO }) {
  const { theme, setTheme } = useTheme();
  return (
    <div className='w-screen bg-secondary/60 border-b-2 border-border p-4 px-16 flex justify-between items-center'>
      <Link href={'/'} className='text-2xl font-black text-foreground flex gap-2 items-center'>TDC <Badge>BETA</Badge></Link>
      <div className='flex items-center gap-2'>
        <Button variant="ghost" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          <SunMoon />
        </Button>
        {!!user ? <ProfileDropdown user={user} /> : <SignDialog />}
      </div>
    </div>
  )
}
