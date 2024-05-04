import React from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { cn } from '@/lib/utils';

export default function ErrorCard({ error, className }: { error: string | null, className?: string }) {
  if (!error) return null;

  return (
    <div className={cn(className, 'bg-destructive/20 border-[1px] rounded-md border-destructive/30 text-red-500 p-3')}>
      <p className='text-sm'>{error}</p>
    </div>
  )
}
