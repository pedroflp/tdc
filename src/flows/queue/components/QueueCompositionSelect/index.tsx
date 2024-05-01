import QueueSlot from '@/components/QueueSlot'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'
import React from 'react'
import { QueueCompositionSelectProps } from './types'
import Avatar from '@/components/Avatar'
import { AvatarStack } from '@/components/Avatar/avatar-stack'
import { Player } from '../../types'

export default function QueueCompositionSelect({
  user,
  teamOptions,
  generateTeamOptions,
  handleSelectQueueCompositions,
}: QueueCompositionSelectProps) {
  return (
  <div className='space-y-8 min-w-[60%] w-full max-w-[70%]'>
  <h1 onClick={generateTeamOptions} className='text-4xl font-bold text-slate-700'>Escolha de Composição</h1>
  <p className='text-slate-500'>Visualize as composições que foram formadas e vote na composição de sua preferência! <br/> A composição que tiver 6 ou mais votos terá os times definitivos para competição.</p>
  <Tabs defaultValue="composition-1">
    <TabsList className='w-full h-full flex justify-start items-start'>
      {teamOptions.map(({ votes }: any, index: number) => (
        <TabsTrigger className='w-full flex flex-col items-start min-h-[60px] h-full space-y-[4px]' value={`composition-${index + 1}`} key={index}>
          <p>Opção de <strong>Composição {index + 1}</strong> <span className='text-xs text-slate-400'>(Votos: {votes.length})</span></p>
          <AvatarStack fallbackSize="text-xs" size={6} spacing="lg" maxAvatarsAmount={10} avatars={votes} />
        </TabsTrigger>
      ))}
      </TabsList>
        {teamOptions.map(({ red, blue, votes }: any, index: number) => {
          const userAlreadySelectedThisComposition = votes.some((voter: Player) => voter.username === user.username)
          return (
            <TabsContent key={index} className='space-y-8 mt-8' value={`composition-${index + 1}`}>
              <div className='grid grid-cols-[2fr_auto_2fr] gap-4'>
                <div className='space-y-4'>
                  <h1 className='text-slate-600 text-2xl font-bold'>Time Vermelho</h1>
                  {red.map((player: any) => (
                    <QueueSlot disabled key={player.username} player={player} />
                  ))}
                </div>
                <div className='flex items-center justify-center relative mx-8 overflow-hidden'>
                  <div className='w-[2px] h-full bg-slate-200/60 absolute z-0' />
                  <Image
                    src="/assets/versus-battle.png"
                    alt="versus"
                    width={100}
                    height={100}
                    className='relative z-2 bg-white border-8 border-white'
                  />
                </div>
                <div className='space-y-4'>
                  <h1 className='text-slate-600 text-2xl font-bold text-right'>Time Azul</h1>
                  {blue.map((player: any) => (
                    <QueueSlot disabled key={player.username} player={player} />
                  ))}
                </div>
              </div>
              <Button
                onClick={(() => handleSelectQueueCompositions(`composition-${index}`))}
                disabled={userAlreadySelectedThisComposition}
                className='w-full h-14'
              >
                {userAlreadySelectedThisComposition ? "Você já votou nesta composição!" : (
                  <span>Escolher opção de <strong>Composição {index + 1}</strong></span>
                )}
              </Button>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
