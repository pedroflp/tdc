'use client'

import { uploadVideo } from '@/app/api/videos/requests'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import mux from '@/services/mux'
import Mux from '@mux/mux-node'
import MuxUploader from '@mux/mux-uploader-react'
import React, { useState } from 'react'

export default function VideoUploader({ upload }: { upload: Mux.Video.Uploads.Upload }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Adicionar novo vídeo</Button>
      </DialogTrigger>
      <DialogContent>
      <DialogHeader>
        <DialogTitle>
          Adicionar novo vídeo
          </DialogTitle>
          <DialogDescription>Adicione um novo vídeo arrastando o arquivo para a área de upload demarcada ou clicando no botão abaixo.</DialogDescription>
        </DialogHeader>
        <Input placeholder='Título do vídeo' defaultValue={title} onChange={(e) => setTitle(e.target.value)} />
        <Select defaultValue={category} onValueChange={(value) => setCategory(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Categoria do vídeo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="geral">Geral</SelectItem>
            <SelectItem value="lol">League Of Legends</SelectItem>
            <SelectItem value="dbd">Dead By Daylight</SelectItem>
          </SelectContent>
        </Select>
        <MuxUploader endpoint={upload.url} onSuccess={() => uploadVideo({
          uploadId: upload.id,
          title,
          category
        })} />
      </DialogContent>
    </Dialog>
  )
}
