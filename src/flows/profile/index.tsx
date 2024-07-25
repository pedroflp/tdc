import { UserDTO } from '@/app/api/user/types';
import Avatar from '@/components/Avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/utils/formatDate';

import { getUserData } from '@/app/api/user/[username]/requests';
import { routeNames } from '@/app/route.names';
import { redirect } from 'next/navigation';
import EditUserInformationDialog from './components/EditUserInformationDialog';
import UserStats from './components/UserStats';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SearchCheck, UserRoundSearch } from 'lucide-react';

export default async function ProfilePage({ user, username }: any) {

  const profileUser = await getUserData(username, {
    cache: "default",
  }) as UserDTO;

  if (!profileUser) return (
    <main className='flex flex-col gap-8 items-center justify-center'>
      <UserRoundSearch size={80} />
      <h1 className='text-3xl font-bold'>Usuário não encontrado</h1>
      <Link href={routeNames.HOME}>
        <Button variant="outline">Voltar para o início</Button>
      </Link>
    </main>
  );

  return (
    <main className='grid lg:grid-cols-2 2xl:grid-cols-[2fr_3fr] w-full h-full m-auto gap-8'>
      <div className='grid grid-rows-[auto_1fr] gap-8 w-full'>
        <Card className='flex gap-2 p-6 h-max relative bg-secondary'>
          {user?.username === profileUser.username && (
            <EditUserInformationDialog
              username={profileUser.username}
              profileUser={profileUser}
            />
          )}
          <div className='relative flex md:flex-row items-end justify-center'>
            <Avatar size={14} image={profileUser.avatar} fallback={String(profileUser.name).slice(0, 2)} />
          </div>
          <div className='flex flex-col justify-between'>
            <div className='flex gap-1 items-center'>
              <h1 className='text-2xl font-bold'>{profileUser.name}</h1> - <span className='text-muted-foreground font-bold'>{profileUser.username}</span>
            </div>
            {profileUser.createdAt && <p className='text-sm text-muted-foreground'>Membro desde <strong>{formatDate(profileUser.createdAt)}</strong></p>}
          </div>
        </Card>
        {profileUser.statistics && <UserStats user={profileUser} />}
      </div>
      <Card aria-disabled className='opacity-50'>
        <CardHeader className='flex flex-row gap-4'>
          <CardTitle className='text-3xl'>Histórico de partidas</CardTitle>
          <Badge variant="secondary">Em breve</Badge>
        </CardHeader>
        <CardContent className='space-y-4 mt-4'>
          <Skeleton className='w-full h-[140px]' />
          <Skeleton className='w-full h-[140px]' />
          <Skeleton className='w-full h-[140px]' />
        </CardContent>
      </Card>
    </main>
  )
}
