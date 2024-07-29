import { getUserDataByToken } from '@/app/api/user/requests';
import { ToastProvider } from '@/components/ui/toast';
import BaseLayoutElements from './layout';

export default async function BaseLayout({ children }: any) {
  const user = await getUserDataByToken();

  return (
    <ToastProvider>
      <BaseLayoutElements
        user={user}
      >
        {children}
      </BaseLayoutElements>
    </ToastProvider>
  )
}
