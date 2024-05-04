'use client';

import { UserDTO } from '@/app/api/user/types';
import ErrorCard from '@/components/ErrorCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { collections } from '@/services/constants';
import { firestore, storage } from '@/services/firebase';
import { Label } from '@radix-ui/react-label';
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { ArrowRight, ImageUp, Pen } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';

export default function EditUserInformationDialog({
  username,
  profileUser,
}: { username: string, profileUser: UserDTO }) {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState(profileUser.name);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isEditingInformations, setIsEditingInformations] = useState(false);
  const [uploadErrorAlert, setUploadErrorAlert] = useState({
    show: false,
    message: ""
  });

  function handleUploadImage(event: React.ChangeEvent<HTMLInputElement>) {
    setUploadErrorAlert({ show: false, message: "" });

    const imageFile = event?.target?.files![0];

    if (imageFile?.type !== "image/jpeg" && imageFile?.type !== "image/png" && imageFile?.type !== "image/jpg") {
      setUploadErrorAlert({
        show: true,
        message: "GIFs não são válidos, envie arquivos JPG, JPEG ou PNG!"
      })
      return;
    };

    if (imageFile?.size > 3 * 1000 * 1000) {
      setUploadErrorAlert({
        show: true,
        message: "Arquivo excedeu o tamanho limite de 3MB. Envie um arquivo menor!"
      })
      return;
    };

    setImageFile(imageFile);    
  }

  async function handleSubitEditProfileInformations() {
    setIsEditingInformations(true);

    if (imageFile) {
      const storageRef = ref(storage, `users/${username}/profile/avatar`);
      await uploadBytes(storageRef, imageFile!);
      const imageUrl = await getDownloadURL(storageRef);
      await updateDoc(doc(firestore, collections.USERS, username), {
        avatar: imageUrl
      })
    }

    if (displayName.length >= 4 && displayName !== profileUser?.name) {
      await updateDoc(doc(firestore, collections.USERS, username), {
        name: displayName
      });
    }

    setDialogOpen(false);
    setIsEditingInformations(false);
    router.refresh();
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
    <DialogTrigger asChild>
      <Button variant="secondary" className='absolute top-4 right-4 gap-2 items-center'>
        <Pen size={16} />
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogTitle>Editar informações de perfil</DialogTitle>
      <div className='space-y-4'>
        <Label>Imagem de exibição</Label>
        <div className='flex gap-8 items-center'>
          <Button onClick={() => fileInputRef.current?.click()} variant="ghost" className='p-6 border-2 w-32 h-32 border-dashed hover:bg-secondary/20 rounded-full flex items-center justify-center'>
            <ImageUp />
          </Button>
          <ArrowRight />
          <div>
            {(imageFile || profileUser?.avatar) && (
              <Image
                src={imageFile ? URL.createObjectURL(imageFile) : profileUser?.avatar!}
                width={1000}
                height={1000}
                className='w-32 object-cover border-2 h-32 rounded-full'
                alt='Profile picture image preview'
              />
            )}
          </div>
          <Input
            onChange={handleUploadImage}
            ref={fileInputRef}
            className='hidden'
            type='file'
            aria-hidden
            accept='image/.jpg, image/.jpeg, image/.png'
          />
        </div>
        {uploadErrorAlert.show &&<ErrorCard error={uploadErrorAlert.message} />}
      </div>
      <div className='space-y-2'>
        <Label>Nome de exibição</Label>
        <Input
          minLength={4}
          maxLength={14}
          onChange={e => setDisplayName(e.target.value)}
          value={displayName}
          placeholder={profileUser?.name}
        />
      </div>
        <Button
          disabled={
            displayName.length < 4 ||
            displayName === profileUser?.name && !imageFile ||
            isEditingInformations
          }
          onClick={handleSubitEditProfileInformations}
        >
          Confirmar edição de perfil
        </Button>
    </DialogContent>
    </Dialog>
  )
}
