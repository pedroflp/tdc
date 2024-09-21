import { getLeadBoard } from '@/app/api/lol/leadboard/requests';
import UserAvatarAndName from '@/components/UserAvatarAndName';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import PlayerCard from './components/PlayerCard';

export default async function LeadBoardPage() {
  const { data } = await getLeadBoard();

  if (!data) return (
    <main className='w-[94%] grid grid-cols-3 gap-8 m-auto pt-32'>
      <Skeleton className='w-full h-[600px] mt-24' />
      <Skeleton className='w-full h-[600px]' />
      <Skeleton className='w-full h-[600px] mt-36' />
    </main>
  );

  const { first, second, third, others } = {
    first: data[0],
    second: data[1],
    third: data[2],
    others: data.slice(3)
  };

  return (
    <main className='w-[70%] m-auto'>
      <header className='flex justify-between items-center'>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Placar de líderes</h1>
          <p className="text-muted-foreground">Visualize abaixo o placar de jogadores com mais pontos!</p>
        </div>

        <Button className='gap-4' disabled>Filtrar listagem <Badge>Em breve</Badge></Button>
      </header>
      
      <div className='mt-24 space-y-24'>
        <div className='grid grid-cols-3 gap-8'>
          <PlayerCard position={2} variant='second' player={second} />
          <PlayerCard position={1} variant='first' player={first} />
          <PlayerCard position={3} variant='third' player={third} />
        </div>

        <div className='grid grid-cols-1 gap-12'>
          {others?.map((user, index) => (
            <Card key={user.username} className='relative'>
              <h1 className='text-4xl font-bold absolute -left-6 -top-6 bg-accent rounded-full w-[64px] h-[64px] flex items-center justify-center'>{index+4}</h1>
              <div className='grid grid-cols-[2fr_3fr] gap-24 p-8'>
                <div className='flex flex-col gap-8 justify-between'>
                  <UserAvatarAndName user={user} canOpenProfileByAvatar />
                  <div className='grid grid-cols-3 gap-8'>
                    <div className='flex items-center gap-2'>
                      <Image src="/assets/icons/mvp.png" className='w-12' width={1000} height={1000} alt="MVP Badge" />
                      <h1 className='text-3xl font-bold'>{user.statistics?.mvps}</h1>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Image src="/assets/icons/hostage.png" className='w-12' width={1000} height={1000} alt="Refém Badge" />
                      <h1 className='text-3xl font-bold'>{user.statistics?.hostage}</h1>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Image src="/assets/icons/bricklayer.png" className='w-12' width={1000} height={1000} alt="Pedreiro Badge" />
                      <h1 className='text-3xl font-bold'>{user.statistics?.bricklayer}</h1>
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-4 gap-4'>
                  <Card className='flex flex-col items-center justify-center bg-secondary p-4 my-4'>
                    <h1 className='text-3xl font-bold'>{user.statistics?.points}</h1>
                    <p className='text-sm text-center text-muted-foreground'>Pontos acumulados</p>
                  </Card>
                  <div className='flex flex-col items-center justify-center'>
                    <h1 className='text-3xl font-bold'>{Math.round(((user.statistics?.won / user.statistics?.played) || 0) * 100)}%</h1>
                    <p className='text-sm text-muted-foreground'>Win rate</p>
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
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
