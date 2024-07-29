'use client';

import { UserDTO } from '@/app/api/user/types';
import Header from '@/components/Header';
import React, { useState } from 'react';
import SectionsSidebar from '../SectionsSidebar';

export default function BaseLayoutElements({ user, children }: { user: UserDTO | null, children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  function toggleSidebar() {
    setIsSidebarOpen(!isSidebarOpen);
  }

  return (
    <main className='overflow-hidden'>
      <Header
        user={user}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <main className="w-full h-[calc(100vh-82px)] overflow-y-auto flex flex-row">
        <SectionsSidebar isSidebarOpen={isSidebarOpen} />

        <div className='max-h-full w-full overflow-scroll p-16 bg-background'>
          {React.Children.map(children, (child: any) =>
            React.isValidElement(child)
              ? React.cloneElement<any>(child, {
                  user,
                })
              : child
          )}
        </div>
      </main>
    </main>
  )
}
