

import { signIn } from '@/app/api/auth/signin/requests';
import Header from '@/components/Header';
import { cookiesKeys } from '@/constants/cookies';
import { collections } from '@/services/constants';
import { firestore } from '@/services/firebase';
import { getDoc, doc } from 'firebase/firestore';
import { cookies } from 'next/headers';
import React from 'react'


export default async function BaseLayout({ children }: any) {
  const connectedAsUserId = cookies().get(cookiesKeys.CONNECTED_AS)?.value;
  let user = null;

  if (!!connectedAsUserId) {
    const userDoc = await getDoc(doc(firestore, collections.USERS, connectedAsUserId!));
    user = userDoc.data();
  }

  return (
    <>
      <Header user={user} />
      <main className="w-screen h-full p-12">{
        React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement<any>(child, {
                user,
              })
            : child
        )
      }</main>
    </>
  )
}
