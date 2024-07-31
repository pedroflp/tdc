import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchX } from 'lucide-react'

export default function EmptyState() {
  return (
    <Card className='flex flex-col items-center justify-center border-2 border-dashed border-spacing-4 h-full'>
      <CardHeader>
        <SearchX className='m-auto' size={56} />
      </CardHeader>
      <CardContent className='text-center'>
        <CardTitle className="text-2xl mb-2">Sem salas disponíveis</CardTitle>
        <CardDescription className="text-center text-primary/60">
          Não encontramos nenhuma sala disponível para você poder competir. <br />
          <strong> Você pode criar uma nova sala e liderar a competição!</strong>
        </CardDescription>
      </CardContent>
    </Card>
  )
}
