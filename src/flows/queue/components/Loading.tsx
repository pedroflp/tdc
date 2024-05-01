import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function Loading() {
  return (
    <div className='w-[40%] space-y-16'>
      <div className='space-y-2'>
        <Skeleton className='w-[300px] h-[40px]' />
        <Skeleton className='w-[160px] h-[30px]' />
      </div>
      <div className='grid grid-cols-2 gap-6'>
        {Array(10).fill(null).map((_, index) => (
          <Skeleton key={index} className='w-full h-[80px]'/>
        ))}
      </div>
    </div>
  )
}
