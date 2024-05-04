'use client';

import Avatar from '@/components/Avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { collections } from '@/services/constants';
import { firestore, storage } from '@/services/firebase';
import { formatDate } from '@/utils/formatDate';
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { ArrowRight, ImageUp, PencilIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useRef, useState } from 'react';

export default function ProfilePage({ user }: any) {
  const router = useRouter();
  const dialogRef = useRef(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [displayName, setDisplayName] = useState(user?.name ?? '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isEditingInformations, setIsEditingInformations] = useState(false);

  if (!user) return null;

  async function handleSubitEditProfileInformations() {
    setIsEditingInformations(true);

    if (imageFile) {
      const storageRef = ref(storage, `users/${user.username}/profile/avatar`);
      await uploadBytes(storageRef, imageFile!);
      const imageUrl = await getDownloadURL(storageRef);
      await updateDoc(doc(firestore, collections.USERS, user.username), {
        avatar: imageUrl
      })
    }

    if (displayName.length >= 4 && displayName !== user?.name) {
      await updateDoc(doc(firestore, collections.USERS, user.username), {
        name: displayName
      });
    }

    setDialogOpen(false);
    router.refresh();

    setIsEditingInformations(false);
  }

  return (
    <main className='grid lg:grid-cols-2 2xl:grid-cols-[1fr_2fr] w-full h-full m-auto gap-8'>
      <div className='grid grid-rows-[auto_1fr] gap-8 w-full'>
        <Card className='flex gap-2 p-6 h-max relative'>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className='absolute top-4 right-4 gap-2 items-center'>
                <PencilIcon size={16} /> Editar
              </Button>
            </DialogTrigger>
            <DialogContent ref={dialogRef}>
              <DialogTitle>Editar informações de perfil</DialogTitle>
              <div className='space-y-2'>
                <Label>Imagem de exibição</Label>
                <div className='flex gap-8 items-center'>
                  <Button onClick={() => fileInputRef.current?.click()} variant="ghost" className='p-6 border-2 w-32 h-32 border-dashed hover:bg-secondary/20 rounded-full flex items-center justify-center'>
                    <ImageUp />
                  </Button>
                  <ArrowRight />
                  <div>
                    <Image
                      src={imageFile ? URL.createObjectURL(imageFile) : user?.avatar}
                      width={1000}
                      height={1000}
                      className='w-32 object-cover h-32 rounded-full'
                      alt='Profile picture image preview'
                    />
                  </div>
                  <Input onChange={e => setImageFile(e.target.files?.[0]!)} ref={fileInputRef} className='hidden' type='file' aria-hidden />
                </div>
              </div>
              <div className='space-y-2'>
                <Label>Nome de exibição</Label>
                <Input
                  minLength={4}
                  maxLength={14}
                  onChange={e => setDisplayName(e.target.value)}
                  value={displayName}
                  placeholder={user?.username}
                />
              </div>
              <Button disabled={isEditingInformations} onClick={handleSubitEditProfileInformations}>Confirmar edição de perfil</Button>
            </DialogContent>
         </Dialog>
          <div className='relative flex md:flex-row items-end justify-center'>
            <Avatar className='xl:w-24 xl:h-24 w-16 h-16' image={user?.avatar} fallback={String(user?.name).slice(0, 2)} />
            <Badge variant="secondary" className='font-bold -bottom-1 absolute'>{user?.username}</Badge>
          </div>
          <div className='flex flex-col justify-between'>
            <h1 className='text-2xl font-bold'>{user?.name}</h1>
            <p className='text-sm text-muted-foreground'>Membro desde {formatDate(user?.createdAt)}</p>
          </div>
        </Card>
       {user?.statistics && <Card className='h-full'>
          <CardHeader>
            <CardTitle>Estatísticas de jogador</CardTitle>
          </CardHeader>
          <CardContent>
            <Card className='flex flex-col items-center justify-center bg-secondary p-4 mb-8'>
              <h1 className='text-4xl font-bold'>{Math.round(user.statistics?.won / user.statistics?.played * 100)}%</h1>
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
        </Card>}
      </div>
      <Card>
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
