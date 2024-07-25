import { Skeleton } from '@/components/ui/skeleton'
import BaseLayout from '@/layouts/Base'
import React from 'react'

export default function Loading() {
  return (
    <BaseLayout>
      <div className='grid grid-cols-[1fr_2fr] gap-8'>
        <div className='flex flex-col gap-8'>
          <Skeleton className='h-[140px] w-full' />
          <Skeleton className='h-[400px] w-full' />
        </div>
        <Skeleton className='h-full w-full' />
      </div>
    </BaseLayout>
  )
}
