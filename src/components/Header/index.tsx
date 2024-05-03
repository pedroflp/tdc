import Link from 'next/link';
import ProfileDropdown from './components/ProfileDropdown';
import { SignDialog } from './components/SignDialog';
import { UserDTO } from '@/app/api/user/types';
import { Badge } from '../ui/badge';

export default async function Header({ user }: { user: UserDTO }) {
  return (
    <div className='w-screen border-b-[1px] border-slate-300 p-4 px-16 flex justify-between items-center'>
      <Link href={'/'} className='text-2xl font-black text-slate-800 flex gap-2 items-center'>TDCU <Badge>BETA</Badge></Link>
      {!!user ? <ProfileDropdown user={user} /> : <SignDialog />}
    </div>
  )
}
