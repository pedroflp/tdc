'use client'

import { VideoProps } from '@/app/api/videos/types'
import UserAvatarAndName from '@/components/UserAvatarAndName'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Mux from '@mux/mux-node'
import MuxPlayer from '@mux/mux-player-react'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import React from 'react'

export default function AssetsList({ assets }: { assets: VideoProps[] }) {
  return (
    <div className='grid grid-cols-3 gap-12'>
      {/* {assets?.length > 0 && assets.map(video => (
        <div key={video.id} className='flex flex-col'>
          <MuxPlayer
            playbackId={video.asset.playback_ids![0].id}
            streamType="on-demand"
            accentColor='#3a3a3a'
            minResolution='720p'
            maxResolution='1080p'
            onEnded={() => console.log('onEnded')}
          />
          <div className='mt-2 space-y-2'>
            <div className='flex justify-between'>
              <p className='text-md font-bold'>{video.title}</p>
              <div className='flex gap-2'>
                <Button variant="secondary" className='flex gap-2'>
                  <ThumbsUp size={18} />{video.likes}
                </Button>
                <Button variant="secondary" className='flex gap-2'>
                  <ThumbsDown size={18} />{video.deslikes}
                </Button>
              </div>
            </div>
            <div className='flex gap-4 items-center justify-between'>
              <UserAvatarAndName size={6} name={{ size: "text-sm" }} user={video.creator} />
              <div className='flex gap-4 items-center'>
                <span className='text-sm'>{video.views} views</span>
                <Badge>{video.category}</Badge>
              </div>
            </div>
          </div>
        </div>
      ))} */}
    </div>
  )
}
