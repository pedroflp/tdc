

import { getUserData } from '@/app/api/user/requests';
import Header from '@/components/Header';
import { cookiesKeys } from '@/constants/cookies';
import { cookies } from 'next/headers';
import React from 'react';


export default async function BaseLayout({ children }: any) {
  const user = await getUserData();

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
