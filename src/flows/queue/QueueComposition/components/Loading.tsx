import { Skeleton } from '@/components/ui/skeleton'
export default function Loading() {
  return (
    <div className='bg-red w-screen h-screen space-y-16'>
      <div className='space-y-4'>
        <Skeleton className='h-16 w-[700px]' />
        <Skeleton className='h-10 w-80' />
      </div>
      <div className='flex gap-6'>
        <Skeleton className='h-[300px] w-[400px]' />
        <div className='flex gap-48 m-6 mt-12'>
          <div className='space-y-4'>
            <Skeleton className='h-20 w-[280px]' />
            <Skeleton className='h-20 w-[280px]' />
            <Skeleton className='h-20 w-[280px]' />
            <Skeleton className='h-20 w-[280px]' />
            <Skeleton className='h-20 w-[280px]' />
          </div>
          <div className='space-y-4'>
            <Skeleton className='h-20 w-[280px]' />
            <Skeleton className='h-20 w-[280px]' />
            <Skeleton className='h-20 w-[280px]' />
            <Skeleton className='h-20 w-[280px]' />
            <Skeleton className='h-20 w-[280px]' />
          </div>
        </div>
      </div>
    </div>
  )
}
