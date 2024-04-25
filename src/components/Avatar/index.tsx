import React from 'react'
import { AvatarFallback, Avatar as AvatarContainer, AvatarImage } from '../ui/avatar'
import { cn } from '@/lib/utils'

export default function Avatar({ image, fallback, className }: {image?: string, fallback: any, className?: string}) {
  return (
    <AvatarContainer className={cn(className)}>
      <AvatarImage className='object-cover rounded-full' src={image} />
      <AvatarFallback className='text-sm font-bold text-slate-500 uppercase'>{fallback}</AvatarFallback>
    </AvatarContainer>
  )
}
