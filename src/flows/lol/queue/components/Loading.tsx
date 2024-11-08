import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function Loading() {
  return (
    <div className='w-[70%] space-y-12'>
      <div className='flex items-center justify-between'>
        <div className='space-y-4'>
          <Skeleton className='w-[300px] h-[40px]' />
          <Skeleton className='w-[600px] h-[30px]' />
        </div>
        <Skeleton className='w-40 h-[40px]' />
      </div>
      <div className='grid grid-cols-5 grid-rows-2 gap-4'>
        {Array(10).fill(null).map((_, index) => (
          <Skeleton key={index} className='w-60 h-40'/>
        ))}
      </div>
    </div>
  )
}
