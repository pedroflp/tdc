import { Skeleton } from '@/components/ui/skeleton'
import BaseLayout from '@/layouts/Base'
import React from 'react'

export default function Loading() {
  return (
    <BaseLayout>
      <main className='w-[70%] grid grid-cols-3 gap-8 m-auto pt-32'>
        <Skeleton className='w-full h-[500px] mt-24' />
        <Skeleton className='w-full h-[500px]' />
        <Skeleton className='w-full h-[500px] mt-24' />
      </main>
    </BaseLayout>
  )
}
