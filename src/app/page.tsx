import HomePage from '@/flows/home';
import BaseLayout from '@/layouts/Base';

export default async function Home() {
  return (
    <BaseLayout>
      <HomePage />
    </BaseLayout>
  )
}
