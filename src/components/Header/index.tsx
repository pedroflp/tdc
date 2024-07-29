'use client'

import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Fragment } from 'react';
import DiscordOAuth from '../DiscordOAuth';
import { Button } from '../ui/button';
import ProfileDropdown from './components/ProfileDropdown';
import { HeaderProps } from './types';

export default function Header({ user, isSidebarOpen, toggleSidebar }: HeaderProps) {
  const params = useSearchParams();
  const authCode = params.get("code");

  return (
    <Fragment>
      <div className='relative w-full bg-secondary/60 border-b-2 border-border p-4 px-8 flex justify-between items-center'>
        <Button variant="outline" onClick={toggleSidebar}>{isSidebarOpen ? <X size={24} /> : <Menu size={24} />}</Button>
        <div className='flex gap-8 items-center absolute left-1/2 -translate-x-1/2'>
          <Link href={'/'} className='text-2xl font-black text-foreground flex items-center'>
            <Image src='/assets/icons/tdc.png' alt='Tropa de Choque' width={1000} height={1000} className='w-16' />
            <span>TDC</span>
          </Link>
        </div>
        {!!user
          ? <ProfileDropdown user={user} />
          : <DiscordOAuth authCode={authCode} />
        }
      </div>
    </Fragment>
  )
}
