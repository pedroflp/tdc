import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function Loading() {
  return (
    <main className='w-[94%] grid grid-cols-3 gap-8 m-auto pt-32'>
      <Skeleton className='w-full h-[600px] mt-24' />
      <Skeleton className='w-full h-[600px]' />
      <Skeleton className='w-full h-[600px] mt-36' />
    </main>
  )
}
