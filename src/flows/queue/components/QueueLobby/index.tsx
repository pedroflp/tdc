import QueueSlot from '@/components/QueueSlot'
import { Button } from '@/components/ui/button'
import QueueHeader from '../MatchHeaderInfo'
import { QueueLobbyProps } from './types'
import { Player } from '../../types'

export default function QueueLobby({
  queue, user, deleteQueue, playerAlreadyInQueue, isQueueReadyToPlay, generateQueueCompositions, joinQueue, handleNavigateToComposition
}: QueueLobbyProps) {
  return (
    <div className='w-full max-w-[60%]'>
      <div className='flex flex-col gap-8'>
        <QueueHeader queue={queue!} user={user} onDeleteQueue={deleteQueue} />
        <div className='grid grid-cols-2 grid-rows-5 gap-6'>
          {queue?.players.map((player: any, index: number) => (
            <QueueSlot disabled={playerAlreadyInQueue} onClick={() => joinQueue(index)} key={index} player={player} />
          ))}
        </div>
        {queue?.compositions?.length > 0 && queue?.players?.some((player: Player) => player.username === user?.username) ? (
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
