import { Skeleton } from '@/components/ui/skeleton'
export default function Loading() {
  return (
    <main className='flex flex-col m-auto gap-20 min-w-[70%] w-full max-w-[70%]'>
      <Skeleton className='h-[100px] w-full' />
      <div className='grid grid-cols-[1fr_auto_1fr] gap-14 items-center w-full'>
        <div className='space-y-4 w-full'>
          <Skeleton className='h-20 w-full' />
          <Skeleton className='h-20 w-full' />
          <Skeleton className='h-20 w-full' />
          <Skeleton className='h-20 w-full' />
          <Skeleton className='h-20 w-full' />
        </div>
        <Skeleton className='h-24 w-24 rounded-full' />
        <div className='space-y-4 w-full'>
          <Skeleton className='h-20 w-full' />
          <Skeleton className='h-20 w-full' />
          <Skeleton className='h-20 w-full' />
          <Skeleton className='h-20 w-full' />
          <Skeleton className='h-20 w-full' />
        </div>
      </div>
    </main>
  )
}
