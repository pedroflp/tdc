import QueueSlot from '@/components/QueueSlot'
import { Button } from '@/components/ui/button'
import QueueHeader from '../MatchHeaderInfo'
import { QueueLobbyProps } from './types'
import { Player } from '../../types'

export default function QueueLobby({
  queue,
  user,
  deleteQueue,
  isQueueReadyToPlay,
  generateQueueCompositions,
  handleExitFromQueue,
  handleNavigateToComposition,
  handleUnlockUserToJoin
}: QueueLobbyProps) {
  return (
    <div className='w-full xl:max-w-[70%]'>
      <div className='flex flex-col gap-12'>
        <QueueHeader
          queue={queue!}
          user={user}
          onDeleteQueue={deleteQueue}
          onExitQueue={handleExitFromQueue}
          handleUnlockUserToJoin={handleUnlockUserToJoin}
        />
        <div className='grid grid-cols-5 grid-rows-2 gap-4'>
          {queue?.players.map((player: any, index: number) => (
            <QueueSlot
              key={index}
              handleKickPlayer={handleExitFromQueue}
              player={player}
              user={user}
              queue={queue}
            />
          ))}
        </div>
        {queue?.compositions?.length > 0 && queue?.players?.some((player) => player?.username === user?.username) ? (
          <Button className='h-16' onClick={handleNavigateToComposition}>Ir para Escolha de Composição</Button>
          ) : (
          user?.username === queue?.hoster?.username &&
            <Button
              onClick={generateQueueCompositions}
              disabled={!isQueueReadyToPlay}
              className='min-w-60 px-10 h-20 mt-6'>
              {!isQueueReadyToPlay
                ? `Aguardando todos os jogadores preencherem os slots`
                : `Formar os times`  
              }
            </Button>
        )}
        </div>
    </div>
  )
}
