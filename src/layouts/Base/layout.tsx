'use client';

import { UserDTO } from '@/app/api/user/types'
import { routeNames } from '@/app/route.names';
import Header from '@/components/Header'
import ToggleTheme from '@/components/ToggleTheme';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React, { useState } from 'react'

const sidebarSections: Array<{
  title: string
  links: { text: string, href: string, disabled?: boolean }[]
}> = [
  {
    title: 'Geral',
    links: [
      { text: 'Clipes e vídeos', href: routeNames.VIDEOS, disabled: true }
    ]
  },
  {
    title: 'League of Legends',
    links: [
      { text: 'Placar de líderes', href: routeNames.LEADBOARD, },
      { text: 'Partidas finalizadas', href: routeNames.MATCHES }
    ]
  },
  {
    title: 'Dead by Daylight',
    links: [
      { text: 'Survive With COLEGAS', href: routeNames.MATCHES, disabled: true }
    ]
  }
];


export default function BaseLayoutElements({ user, children }: { user: UserDTO | null, children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  function toggleSidebar() {
    setIsSidebarOpen(!isSidebarOpen);
  }

  const Sections = ({ sidebarSections }: { sidebarSections: SidebarSection[] }) =>
    sidebarSections.map(section => (
      <section key={section.title}>
        <header>{section.title}</header>
        <nav className='flex flex-col gap-2 mt-2 overflow-hidden'>
          {section.links.map(link => (
            <Link
              key={link.text}
              href={link.href}
              className={cn(link.disabled && 'pointer-events-none')}
            >
              <Button
                className="flex gap-2"
                variant="link"
              >
                <span className={cn(link.disabled && 'opacity-50')}>
                  {link.text}
                </span>
                {link.disabled && <Badge>Em breve</Badge>}
              </Button>
            </Link>
          ))}
        </nav>
      </section>
    )
  ); 

  return (
    <main className='overflow-hidden'>
      <Header
        user={user}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <main className="w-full h-[calc(100vh-82px)] overflow-y-auto flex flex-row">
        <aside className={cn(
          'h-full bg-secondary py-8 flex flex-col gap-8 transition-all duration-300 ease-in-out',
          isSidebarOpen ? 'w-[20%] px-8' : 'w-0 px-0',
        )}>
          <Sections sidebarSections={sidebarSections} />
          <div className='mt-auto w-full'>
            <ToggleTheme />
          </div>
        </aside>
        <div className='max-h-full w-full overflow-scroll p-16 bg-background'>{
          React.Children.map(children, (child: any) =>
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
