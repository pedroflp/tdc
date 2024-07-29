import { Skeleton } from '@/components/ui/skeleton'
import BaseLayout from '@/layouts/Base'
import React from 'react'

export default function Loading() {
  return (
    <BaseLayout>
      <div className='grid w-full h-[300px] grid-cols-[2fr_3fr] gap-8'>
        <Skeleton className='h-full w-full' />
        <Skeleton className='h-full w-full' />
      </div>
    </BaseLayout>
  )
}
