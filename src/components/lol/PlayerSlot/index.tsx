import { cn } from '@/lib/utils'
import Avatar from '@/components/Avatar'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { MatchItem, Player } from '@/flows/lol/queue/types'
import Link from 'next/link'
import { routeNames } from '@/app/route.names'

export default function PlayerSlot({ match, player, className }: { match?: MatchItem, player: Player, className?: string }) {
  if (!match) return;

  const { mvp, hostage, bricklayer } = match;
  
  const honors = [
    {
      icon: '/assets/icons/mvp.png',
      text: 'MVP da partida',
      honored: mvp?.player?.username,
    },
    {
      icon: '/assets/icons/hostage.png',
      text: 'Hostage da partida',
      honored: hostage?.player?.username,
    },
    {
      icon: '/assets/icons/bricklayer.png',
      text: 'Bricklayer da partida',
      honored: bricklayer?.player?.username,
    },
  ]

  return (
    <TooltipProvider>
      <div className={cn(
        'grid grid-cols-[2fr_auto] gap-6 min-w-60 w-full h-20 border-[2px] p-4 border-border rounded-md',
        className,
      )}>
        <div>
          <Tooltip delayDuration={100}>
            <TooltipTrigger className='cursor-default'>
              <Link href={routeNames.PROFILE(player?.username)} className='flex items-center gap-2'>
                <Avatar image={player?.avatar} fallback={String(player?.name).slice(0, 2)} />
                <p className='text-lg font-bold'>{player?.name}</p>
              </Link> 
            </TooltipTrigger>
            <TooltipContent align='start'>Ver perfil de {player?.name}</TooltipContent>
          </Tooltip>
        </div>
        <div className='flex gap-4 items-center'>
          {honors.map((honor) => honor.honored === player?.username && (   
            <Tooltip key={honor.honored} delayDuration={100}>
              <TooltipTrigger className='cursor-default'>
                <Image alt={honor.text} width={1000} height={1000}  className='w-9 object-contain' src={honor.icon} />
              </TooltipTrigger>
              <TooltipContent>{honor.text}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  )
}
