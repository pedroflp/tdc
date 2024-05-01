import React from 'react'
import { AvatarFallback, Avatar as AvatarContainer, AvatarImage } from '../ui/avatar'
import { cn } from '@/lib/utils'

export default function Avatar({ size = 10, image, fallback, className, fallbackSize, }: {image?: string, fallbackSize?: "text-xs" | "text-sm" | "text-md" | "text-lg", size?: number, fallback: any, className?: string}) {
  return (
    <AvatarContainer className={cn(className, `w-${size} h-${size}`)}>
      <AvatarImage className='object-cover rounded-full' src={image} />
      <AvatarFallback className={
        cn('text-sm font-bold text-slate-500 uppercase', fallbackSize)
      }>{fallback}</AvatarFallback>
    </AvatarContainer>
  )
}
