'use client'

import { UserDTO } from '@/app/api/user/types';
import Link from 'next/link';
import { Fragment } from 'react';
import ProfileDropdown from './components/ProfileDropdown';
import { SignDialog } from './components/SignDialog';
import { HeaderProps } from './types';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/button';

export default function Header({ user, isSidebarOpen, toggleSidebar }: HeaderProps) {

  return (
    <Fragment>
      <div className='relative w-full bg-secondary/60 border-b-2 border-border p-4 px-8 flex justify-between items-center'>
        <Button variant="outline" onClick={toggleSidebar}>{isSidebarOpen ? <X size={24} /> : <Menu size={24} />}</Button>
        <div className='flex gap-8 items-center absolute left-1/2 -translate-x-1/2'>
          <Link href={'/'} className='text-2xl font-black text-foreground flex gap-2 items-center'>TDC</Link>
        </div>
        {!!user ? <ProfileDropdown user={user} /> : <SignDialog />}
      </div>
    </Fragment>
  )
}
