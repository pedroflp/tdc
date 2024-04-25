import HomePage from '@/flows/home';
import BaseLayout from '@/layouts/base';

export default async function Home() {
  return (
    <BaseLayout>
      <HomePage />
    </BaseLayout>
  )
}
