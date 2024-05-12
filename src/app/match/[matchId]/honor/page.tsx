import HonorPage from '@/flows/match/HonorPage'
import BaseLayout from '@/layouts/base'
import React from 'react'

export default function Honor({ params }: { params: { matchId: string } }) {
  const { matchId } = params;
  return (
    <BaseLayout>
      <HonorPage matchId={matchId} />
    </BaseLayout>
  )
}
