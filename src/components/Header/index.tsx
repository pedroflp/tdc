import Link from 'next/link';
import ProfileDropdown from './components/ProfileDropdown';
import { SignDialog } from './components/SignDialog';
import { UserDTO } from '@/app/api/user/types';

export default async function Header({ user }: { user: UserDTO }) {
  return (
    <div className='w-screen border-b-[1px] border-slate-300 p-4 px-16 flex justify-between items-center'>
      <Link href={'/'} className='text-2xl font-black text-slate-800'>TDCU</Link>
      {!!user ? <ProfileDropdown user={user} /> : <SignDialog />}
    </div>
  )
}
