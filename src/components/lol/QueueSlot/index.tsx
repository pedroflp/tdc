import { cn } from '@/lib/utils'
import { User, X } from 'lucide-react'
import Avatar from '@/components/Avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { QueueSlotProps } from './types'

export default function QueueSlot({ player, handleKickPlayer, className, user, queue }: QueueSlotProps) {
  if (!player?.username) return (
    <Card className='grid place-items-center w-50 h-40 border-dashed border-2'>
      <User className='text-slate-800' />
    </Card>
  )

  return (
    <div className='w-50 h-40 relative'>
      <Card className={cn(
        'bg-border/40 grid place-items-center w-full h-full pointer-events-none relative border-2',
        className,
      )}>
        <Avatar className={cn(
          player.username === user?.username && 'ring ring-primary',
        )} size={16} image={player?.avatar} fallback={String(player?.name).slice(0, 2)} />
        <p className={cn(
          'text-md text-primary/60',
          player.username === queue?.hoster.username && 'text-primary font-bold',
        )}>
          {player.username}
        </p>
      </Card>
      {(user?.username === queue?.hoster?.username && user?.username !== player?.username) && (
        <Button onClick={() => handleKickPlayer?.(player.username)} variant="destructive" className='p-2 absolute top-2 right-2 text-xs'>
          <span className='flex items-center gap-1'><X /></span>
        </Button>
      )}
    </div>
  )
}
