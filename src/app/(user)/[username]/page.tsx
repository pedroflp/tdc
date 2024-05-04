import ProfilePage from '@/flows/profile'
import BaseLayout from '@/layouts/base'
import React from 'react'

export default async function Profile({ params }: { params: { username: string } }) {
  return (
    <BaseLayout>
      <ProfilePage username={params.username} />
    </BaseLayout>
  )
}
