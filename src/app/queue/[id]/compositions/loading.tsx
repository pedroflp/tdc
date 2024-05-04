import Loading from '@/flows/queue/QueueComposition/components/Loading'
import BaseLayout from '@/layouts/base'
import React from 'react'

export default function LoadingRoot() {
  return (
    <BaseLayout>
      <main className='flex flex-col m-auto gap-12 min-w-[60%] w-full max-w-[60%]'>
        <Loading />
      </main>
    </BaseLayout>
  )
}
