import { UserDTO } from '@/app/api/user/types';
import Avatar from '@/components/Avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/utils/formatDate';

import { getUserData } from '@/app/api/user/requests';
import ErrorCard from '@/components/ErrorCard';
import { redirect } from 'next/navigation';
import EditUserInformationDialog from './components/EditUserInformationDialog';
import UserStats from './components/UserStats';
import { routeNames } from '@/app/route.names';

export default async function ProfilePage({ user, username }: any) {
  const profileUser = await fetchUserData(username) as UserDTO;

  async function fetchUserData(username: string) { 
    if (!username) return;

    const response = await getUserData(username, {
      cache: "default",
    });
    
    return response;
  }

  if (!profileUser) redirect(routeNames.HOME);

  return (
    <main className='grid lg:grid-cols-2 2xl:grid-cols-[1fr_2fr] w-full h-full m-auto gap-8'>
      <div className='grid grid-rows-[auto_1fr] gap-8 w-full'>
        <Card className='flex gap-2 p-6 h-max relative'>
          {user.username === profileUser.username && (
            <EditUserInformationDialog
              username={username}
              profileUser={profileUser}
            />
          )}
          <div className='relative flex md:flex-row items-end justify-center'>
            <Avatar className='xl:w-24 xl:h-24 w-16 h-16' image={profileUser.avatar} fallback={String(profileUser.name).slice(0, 2)} />
            <Badge variant="secondary" className='font-bold -bottom-2 absolute'>{profileUser.username}</Badge>
          </div>
          <div className='flex flex-col justify-between'>
            <h1 className='text-2xl font-bold'>{profileUser.name}</h1>
            {profileUser.createdAt && <p className='text-sm text-muted-foreground'>Membro desde {formatDate(profileUser.createdAt)}</p>}
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
