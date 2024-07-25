import { Button } from '@/components/ui/button'
import React from 'react'
import Mux from '@mux/mux-node'
import MuxPlayer from '@mux/mux-player-react'
import VideoUploader from './uploader';
import AssetsList from './assetslist';
import mux from '@/services/mux';
import { getVideos } from '@/app/api/videos/requests';

export default async function VideosPage() {
  const upload = await mux.video.uploads.create({
    new_asset_settings: {
      playback_policy: ['public'],
      encoding_tier: 'baseline'
    },
    cors_origin: '*',
  });

  const { data: videos } = await getVideos();

  return (
    <main className='w-[90%] m-auto'>
      <div className='flex justify-between items-center mb-16'>
        <h1 className='text-4xl font-bold'>Vídeos</h1>
        <VideoUploader upload={upload} />
      </div>
      <AssetsList assets={videos} />
    </main>
  )
}
