import { cn } from '@/lib/utils'
import { User, X } from 'lucide-react'
import Avatar from '../Avatar'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
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
