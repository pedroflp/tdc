import ProfilePage from '@/flows/profile'
import BaseLayout from '@/layouts/Base'
import React from 'react'
import Loading from './loading'

export default async function Profile({ params }: { params: { username: string } }) {
  return (
    <BaseLayout>
      <ProfilePage username={params.username} />
    </BaseLayout>
  )
}
