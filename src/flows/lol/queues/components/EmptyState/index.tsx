import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchX } from 'lucide-react'

export default function EmptyState() {
  return (
    <Card className='flex flex-col items-center border-2 border-dashed border-spacing-4'>
      <CardHeader>
        <SearchX className='m-auto' size={56} />
      </CardHeader>
      <CardTitle className="text-2xl mb-2">Sem salas disponíveis</CardTitle>
      <CardDescription className=" w-[60%] text-center text-primary/60">
        Não encontramos nenhuma sala disponível para você poder competir. <br />
        <strong> Você pode criar uma nova sala e liderar a competição!</strong>
      </CardDescription>
    </Card>
  )
}
