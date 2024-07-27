import { routeNames } from "@/app/route.names";
import ToggleTheme from "@/components/ToggleTheme";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const sections: SidebarSection[] = [
  {
    title: 'Geral',
    links: [
      { text: 'Clipes e vídeos', href: routeNames.VIDEOS, disabled: true }
    ]
  },
  {
    title: 'League of Legends',
    icon: '/assets/icons/lol.svg',
    links: [
      { text: 'Placar de líderes', href: routeNames.LEADBOARD, },
      { text: 'Partidas finalizadas', href: routeNames.MATCHES }
    ]
  },
  {
    title: 'Dead by Daylight',
    icon: '/assets/icons/dbd.svg',
    links: [
      { text: 'Survive With COLEGAS', href: routeNames.MATCHES, disabled: true }
    ]
  }
];

export default function SectionsSidebar({ isSidebarOpen }: { isSidebarOpen: boolean }) {
  return (
    <aside className={cn(
      'h-full bg-secondary py-8 flex flex-col gap-8 transition-all duration-300 ease-in-out text-nowrap',
      isSidebarOpen ? 'w-[20%] px-8' : 'w-0 px-0',
    )}>
      {
        sections.map(section => (
          <section key={section.title}>
            <header className='flex gap-2 items-center'>
              {section.icon &&
                <Image
                  alt='Ícone de seção de navegação'
                  src={section.icon}
                  width={1000}
                  height={1000}
                  style={{ width: 32, height: 32 }}
                />
              }
              <h1>{section.title}</h1>
            </header>
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
            <Separator className='h-[1px] w-full bg-muted-foreground/10 mt-6' />
          </section>
        ))
      } 
      <div className='mt-auto w-full'>
        <ToggleTheme />
      </div>
    </aside>
  )
}