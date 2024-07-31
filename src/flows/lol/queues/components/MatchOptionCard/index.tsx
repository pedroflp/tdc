import Image from 'next/image'
import React from 'react'
import { MatchOptionCardProps } from './types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import Lottie from 'lottie-react'
import fireAnimation from '../../../../../../public/assets/animations/fire-animation.json'

export default function MatchOptionCard({
  selected, src, alt, name, mode, description, onClick, disabled, showFire
}: MatchOptionCardProps) {
  return (
    <button
      disabled={disabled}
      onClick={() => onClick(mode)}
      className={cn(
        "min-h-[300px] bg-gradient-to-tl from-secondary/40 to-background relative overflow-hidden flex flex-col gap-5 p-5 border-2 rounded-md items-center disabled:border-dashed disabled:opacity-40",
        selected && "border-primary"
      )}
    >
      <div className='relative z-[2] flex flex-col h-full'>
        <Image
          src={src}
          alt={alt}
          width={1000}
          height={1000}
          className='w-20 h-20 mx-auto'
        />
        <div className="flex flex-col gap-2 items-center">
          <div className='relative'>
            <h1 className="font-bold">{name}</h1>
            {showFire && <Lottie className='absolute top-0 -left-4 -translate-x-1/2 -translate-y-1/2 w-16' animationData={fireAnimation} loop autoPlay />}
          </div>
          <p className="text-sm text-center text-primary">{description}</p>
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
      </div>
      <Image
        src={src}
        alt={alt}
        width={1000}
        height={1000}
        className='w-90 absolute z-0 -bottom-12 -right-20 blur-sm opacity-15'
      />
    </button>
  )
}
