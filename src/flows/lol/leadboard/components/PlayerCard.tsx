'use client';

import { UserDTO } from '@/app/api/user/types'
import { routeNames } from '@/app/route.names'
import Avatar from '@/components/Avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import UserStats from '@/flows/profile/components/UserStats'
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React from 'react'

const cardVariants = cva("",
  {
    variants: {
      variant: {
        first: "border-2 relative border-yellow-600 bg-yellow-600/20 h-max",
        second: "border-2 relative mt-24 border-zinc-500 bg-zinc-500/20 h-max",
        third: "border-2 mt-36 relative border-amber-800 bg-amber-800/20 h-max",
        default: "",
      },
      avatar: {
        first: "border-[3px] border-yellow-600",
        second: "border-[3px] border-zinc-500",
        third: "border-[3px] border-amber-800",
        default: "",
      },
      position: {
        first: "bg-yellow-600/10 backdrop-blur-lg border-[3px] border-yellow-500",
        second: "bg-zinc-500/10 backdrop-blur-lg border-[3px] border-zinc-400 ",
        third: "bg-amber-800/10 backdrop-blur-lg border-[3px] border-amber-700",
        default: "bg-accent",
      },
      images: {
        first: "/assets/icons/first.png",
        second: "/assets/icons/second.png",
        third: "/assets/icons/third.png",
        default: "",
      }
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export default function PlayerCard({ player, variant, position, className }: {
  player: UserDTO,
  position: number,
  variant: 'first' | 'second' | 'third' | 'default',
  className?: string
}) {
  const { push } = useRouter();
  return (
    <Card className={cardVariants({ variant, className })}>
      <div className={cn(
        'font-bold absolute -left-6 -top-6 rounded-full w-[80px] h-[80px] flex items-center justify-center',
        cardVariants({ position: variant })
      )}>
        <Image src={cardVariants({ images: variant })} className='w-12' width={1000} height={1000} alt="Badge de posição no pódio" />
      </div>
      <CardHeader onClick={() => push(routeNames.PROFILE(player.username))}  className='items-center cursor-pointer'>
        <Avatar className={cardVariants({ avatar: variant })} image={player.avatar} fallback={String(player.username).slice(0, 2)} size={20} />
        <CardTitle>{player.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <UserStats user={player} />
      </CardContent>
    </Card>
  )
}
