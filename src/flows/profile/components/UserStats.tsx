import { UserDTO } from '@/app/api/user/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

export default function UserStats({ user }: { user: UserDTO }) {
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>Estatísticas de jogador</CardTitle>
      </CardHeader>
      <CardContent>
        <Card className='flex flex-col items-center justify-center bg-secondary p-4 mb-8'>
          <h1 className='text-4xl font-bold'>{Math.round(((user.statistics?.won / user.statistics?.played) || 0) * 100)}%</h1>
          <p className='text-sm text-muted-foreground'>Win rate</p>
        </Card>
        <div className='grid grid-cols-2 gap-8'>
          <div className='flex flex-col items-center justify-center'>
            <h1 className='text-4xl font-bold'>{user.statistics?.played}</h1>
            <p className='text-sm text-muted-foreground'>Partidas jogadas</p>
          </div>
          <div className='flex flex-col items-center justify-center'>
            <h1 className='text-4xl font-bold'>{user.statistics?.won}</h1>
            <p className='text-sm text-muted-foreground'>Partidas vencidas</p>
          </div>
          <div className='flex flex-col items-center justify-center'>
            <h1 className='text-4xl font-bold'>{user.statistics?.points}</h1>
            <p className='text-sm text-muted-foreground'>Pontos acumulados</p>
          </div>
          <div className='flex flex-col items-center justify-center'>
            <h1 className='text-4xl font-bold'>{user.statistics?.mvps}</h1>
            <p className='text-sm text-muted-foreground'>MVPs conquistados</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
