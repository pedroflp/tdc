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
import { cookies } from 'next/headers';
import { getUserDataByToken } from '@/app/api/user/requests';

export default async function ProfilePage({ username }: any) {
  const user = await getUserDataByToken();
  const profileUser = await getUserData(username);

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
    <main className='grid lg:grid-cols-2 2xl:grid-cols-[2fr_3fr] w-full m-auto gap-8'>
      <Card className='flex flex-col gap-4 items-center justify-center p-6 h-full relative bg-secondary'>
        {user?.username === profileUser.username && (
          <EditUserInformationDialog
            username={profileUser.username}
            profileUser={profileUser}
          />
        )}
        <div className='relative flex md:flex-row items-end justify-center'>
          <Avatar size={32} image={profileUser.avatar} fallback={String(profileUser.name).slice(0, 2)} />
        </div>
        <div className='flex flex-col items-center justify-between'>
          <div className='flex gap-4 items-center'>
            <h1 className='text-2xl font-bold'>{profileUser.name}</h1>
            <Badge>{profileUser.username}</Badge>
          </div>
          {profileUser.createdAt && <p className='text-sm text-muted-foreground'>Membro desde <strong>{formatDate(profileUser.createdAt)}</strong></p>}
        </div>
      </Card>

      {profileUser?.statistics && <UserStats user={profileUser} />}
    </main>
  )
}
