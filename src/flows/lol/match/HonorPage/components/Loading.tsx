import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function LoadingHonorPage() {
  return (
    <div className='grid grid-cols-3 gap-4'>
      <Skeleton className='w-full h-[400px]' />
      <Skeleton className='w-full h-[400px]' />
      <Skeleton className='w-full h-[400px]' />
    </div>
  )
}
