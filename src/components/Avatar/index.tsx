import React from 'react'
import { AvatarFallback, Avatar as AvatarContainer, AvatarImage } from '../ui/avatar'
import { cn } from '@/lib/utils'

export default function Avatar({ image, fallback, className, fallbackSize, size }: { image?: string, fallbackSize?: "text-xs" | "text-sm" | "text-md" | "text-lg", size?: number, fallback: any, className?: string }) {
  return (
    <AvatarContainer className={cn(
      `w-${size} h-${size}`,
    )}>
      <AvatarImage 
        className={cn(
          'object-cover w-full rounded-full border-2',
          className
        )} 
        src={image} 
      />
      <AvatarFallback className={
        cn('text-sm font-bold text-secondary-foreground/60 uppercase bg-secondary border-2', fallbackSize, className)
      }>{fallback}</AvatarFallback>
    </AvatarContainer>
  )
}
