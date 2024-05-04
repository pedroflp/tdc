import React from 'react'
import { AvatarFallback, Avatar as AvatarContainer, AvatarImage } from '../ui/avatar'
import { cn } from '@/lib/utils'

export default function Avatar({ image, fallback, className, fallbackSize, }: { image?: string, fallbackSize?: "text-xs" | "text-sm" | "text-md" | "text-lg", size?: number, fallback: any, className?: string }) {
  return (
    <AvatarContainer className={className}>
      <AvatarImage className='object-cover w-full rounded-full border-2' src={image} />
      <AvatarFallback className={
        cn('text-sm font-bold text-secondary-foreground/60 uppercase bg-secondary border-2', fallbackSize)
      }>{fallback}</AvatarFallback>
    </AvatarContainer>
  )
}
