import { cookiesKeys } from '@/constants/cookies'
import HomePage from '@/flows/home'
import BaseLayout from '@/layouts/base';
import { collections } from '@/services/constants';
import { firestore } from '@/services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { cookies } from 'next/headers'
import React from 'react'

export default async function Home() {
  return (
    <BaseLayout>
      <HomePage />
    </BaseLayout>
  )
}
