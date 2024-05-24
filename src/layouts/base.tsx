import { getMyUserData } from '@/app/api/user/requests';
import { UserDTO } from '@/app/api/user/types';
import Header from '@/components/Header';
import { ToastProvider } from '@/components/ui/toast';
import React from 'react';


export default async function BaseLayout({ children }: any) {
  const user = await getMyUserData();
  return (
    <ToastProvider>
      <Header user={user as UserDTO} />
      <main className="w-screen h-full p-12 bg-background">{
        React.Children.map(children, (child: any) =>
          React.isValidElement(child)
            ? React.cloneElement<any>(child, {
                user,
              })
            : child
        )
      }</main>
    </ToastProvider>
  )
}
