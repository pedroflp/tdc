import { UserDTO } from '@/app/api/user/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import React from 'react'

export default function UserStats({ user }: { user: UserDTO }) {
  return (
    <Card>
      {/* <CardHeader>
        <CardTitle>Estatísticas de jogador</CardTitle>
      </CardHeader> */}
      <CardContent>
        <Card className='flex flex-col items-center justify-center bg-secondary p-4 my-4'>
          <h1 className='text-3xl font-bold'>{user.statistics?.points}</h1>
          <p className='text-sm text-center text-muted-foreground'>Pontos acumulados</p>
        </Card>

        <div className='grid grid-cols-3 gap-8 items-center my-8'>
          <div className='flex items-center justify-center gap-3'>
            <Image src="/assets/icons/mvp.png" className='w-9' width={1000} height={1000} alt="MVP Badge" />
            <h1 className='text-3xl font-bold'>{user.statistics?.mvps}</h1>
          </div>
          <div className='flex items-center justify-center gap-3'>
            <Image src="/assets/icons/hostage.png" className='w-9' width={1000} height={1000} alt="Refém Badge" />
            <h1 className='text-3xl font-bold'>{user.statistics?.hostage}</h1>
          </div>
          <div className='flex items-center justify-center gap-3'>
            <Image src="/assets/icons/bricklayer.png" className='w-9' width={1000} height={1000} alt="Pedreiro Badge" />
            <h1 className='text-3xl font-bold'>{user.statistics?.bricklayer}</h1>
          </div>
        </div>

        <div className='grid grid-cols-3 gap-8'>
          <div className='flex flex-col items-center justify-center'>
            <h1 className='text-3xl font-bold'>{Math.round(((user.statistics?.won / user.statistics?.played) || 0) * 100)}%</h1>
            <p className='text-sm text-center text-muted-foreground'>Porcentagem de vitória</p>
          </div>
          <div className='flex flex-col items-center justify-center'>
            <h1 className='text-3xl font-bold'>{user.statistics?.played}</h1>
            <p className='text-sm text-center text-muted-foreground'>Partidas jogadas</p>
          </div>
          <div className='flex  flex-col items-center justify-center'>
            <h1 className='text-3xl font-bold'>{user.statistics?.won}</h1>
            <p className='text-sm text-center text-muted-foreground'>Partidas vencidas</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
