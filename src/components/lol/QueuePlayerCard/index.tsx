import Avatar from '@/components/Avatar'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { QueueSlotProps } from './types'

export default function QueuePlayerCard({ player, className, user }: QueueSlotProps) {
  return (
    <Card className={cn(
      'flex h-20 items-center justify-center gap-4 w-full pointer-events-none relative border-2',
      cn(player.username === user?.username && 'ring-1 ring-primary'),
      className,
    )}>
      <Avatar
        size={12} image={player?.avatar}
        fallback={String(player?.name).slice(0, 2)}
      />
      <p className='font-bold'>{player.username}</p>
    </Card>
  )
}
