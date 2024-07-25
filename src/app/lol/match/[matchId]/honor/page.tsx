import HonorPage from '@/flows/lol/match/HonorPage'
import BaseLayout from '@/layouts/Base'
import React from 'react'

export default function Honor({ params }: { params: { matchId: string } }) {
  const { matchId } = params;
  return (
    <BaseLayout>
      <HonorPage matchId={matchId} />
    </BaseLayout>
  )
}
