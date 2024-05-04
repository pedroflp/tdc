import Image from 'next/image'
import React from 'react'
import { MatchOptionCardProps } from './types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export default function MatchOptionCard({
  selected, src, alt, name, mode, description, onClick, disabled
}: MatchOptionCardProps) {
  return (
    <button
      disabled={disabled}
      onClick={() => onClick(mode)}
      className={cn(
        "flex flex-col gap-5 p-5 border-2 rounded-md items-center disabled:opacity-50",
        selected && "border-primary"
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={1000}
        height={1000}
        className='w-20 h-20'
      />
      <div className="flex flex-col gap-2 items-center">
        <h1 className="font-bold">{name}</h1>
        <p className="text-xs text-center text-primary/60">{description}</p>

      </div>
      <div className='mt-auto'>
        {!!disabled
          ? <Badge variant="secondary">Disponível em breve</Badge>
          : (
            <Badge variant={!selected ? "secondary" : "default"}>
              {!selected ? `Escolher modo ${name}` : `Modo ${name} escolhido` }
            </Badge>
          )
        }
      </div>
    </button>
  )
}
