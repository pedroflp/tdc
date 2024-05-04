import { Player, QueueMatch } from '@/flows/queue/types'
import { formatDate } from '@/utils/formatDate'
import { useCallback, useState } from 'react'
import { AvatarStack } from '../Avatar/avatar-stack'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { QueueCardProps } from './types'
import Avatar from '../Avatar'
import { Lock } from 'lucide-react'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '../ui/input-otp'
import { validateQueueProtectionCode } from '@/app/api/queue/requests'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { routeNames } from '@/app/route.names'
import { MatchModesEnum, MatchModesIcons, MatchModesNames } from '@/flows/home/components/MatchOptionCard/types'
import Image from 'next/image'

export default function QueueCard({
  queue,
  user,
  disabledJoinByAuth,
  disabledJoinByStarted,
  handleEnterQueue
}: QueueCardProps) {
  const router = useRouter();

  const [protectionInput, setProtectionInput] = useState<{show?: boolean, code?: string, error?: string | null}>({
    show: false,
    code: "",
    error: null,
  });

  const joinQueue = () => {
    if (queue.protection?.enabled && !queue.players.some(player => player.username === user?.username)) {
      setProtectionInput({show: true, code: ""});
      return;
    }

    handleEnterQueue(queue.id);
  }

  async function handleValidateProtectionCode() {
    if (!protectionInput.code) return;

    const response = await validateQueueProtectionCode(queue.id, protectionInput.code);

    if (!response?.success) {
      setProtectionInput({ ...protectionInput, error: response?.error! });
      return
    }

    handleEnterQueue(queue.id);
  }

  const QueueBadgeStatus = useCallback(({match}: {match: QueueMatch}) => {
    if (match?.started) return <Badge>Partida Iniciada</Badge>
    if (match?.finished) return <Badge variant="outline">Partida Finalizada</Badge>
    return <Badge variant="secondary">Partida em preparação</Badge>;
  }, []);

  const QueueJoinButton = useCallback(({
    disabledJoinByAuth,
    disabledJoinByStarted,
    onClick
  }: Pick<QueueCardProps, 'disabledJoinByAuth' | 'disabledJoinByStarted'> & {
      onClick: () => void,
  }) => {
    if (disabledJoinByAuth) return <Button disabled>Faça login para participar</Button>
    if (queue.players.find((player: Player) => player.username === user?.username)) return <Button variant="outline" onClick={onClick}>Voltar para a sala</Button>
    if (disabledJoinByStarted) return <Button onClick={() => router.push(`${routeNames.MATCH}/${queue?.match?.id}`)}>Visualizar essa partida</Button>
    return <Button onClick={onClick}>Entrar na sala da partida</Button>;
  }, [user]);

  return (
    <Card className="min-w-[500px] w-full">
      <CardHeader className="flex flex-row justify-between gap-16 items-start mb-4">
        <div className='flex flex-col gap-1'>
          <div className="flex items-center gap-3">
            <CardTitle className='text-xl'>{queue.name}</CardTitle>
            <QueueBadgeStatus match={queue.match} />
          </div>
          <div className="text-xs text-muted-foreground/60 flex gap-1 items-center">
            <p>Criada por</p>
            <div className="flex gap-1 items-center">
              <Avatar className='w-6 h-6' image={queue.hoster.avatar} fallback={String(queue.hoster.name).slice(0, 2)} size={120} fallbackSize='text-xs' />
              <strong className="flex items-center gap-1 text-muted-foreground">{queue.hoster.name}</strong>
            </div>
          </div>
        </div>
      <AvatarStack spacing="lg" id="avatar-stack" maxAvatarsAmount={6} avatars={queue.players.filter((player: Player) => !!player.username)} />
      </CardHeader>
      <CardContent className="flex justify-between items-end gap-4">
        <div className="text-sm text-muted-foreground">
          <p className='flex gap-1 items-center'>
            Modo
            <Image
              src={MatchModesIcons[queue?.mode]}
              width={1000}
              height={1000}
              objectFit='cover'
              className='w-8 h-8'
              alt={`Badge modo de partida ${MatchModesNames[queue?.mode]}`}
            />
            <strong>{MatchModesNames[queue.mode]}</strong>
          </p>
          <p>Iniciado em <strong>{formatDate(queue.createdAt)}</strong></p>
        </div>
        <div className='flex flex-col gap-4 items-end 2xl:flex-row'>
          {queue.protection?.enabled && (
            <Badge className='bg-secondary/70 text-secondary-foreground/50 p-3 px-6'>
              <span className='flex gap-2 items-center'>
                <Lock size={16} />
                Sala com senha
              </span>
            </Badge>
          )}
          {protectionInput.show ? (
             <div className="flex flex-col gap-2">
              <InputOTP value={protectionInput.code} onChange={e => setProtectionInput({ ...protectionInput, error: null, code: e })} maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot className={cn(protectionInput.error && 'border-destructive')} index={0} />
                <InputOTPSlot className={cn(protectionInput.error && 'border-destructive')} index={1} />
                <InputOTPSlot className={cn(protectionInput.error && 'border-destructive')} index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot className={cn(protectionInput.error && 'border-destructive')} index={3} />
                <InputOTPSlot className={cn(protectionInput.error && 'border-destructive')} index={4} />
                <InputOTPSlot className={cn(protectionInput.error && 'border-destructive')} index={5} />
              </InputOTPGroup>
              </InputOTP>
              <Button
                onClick={handleValidateProtectionCode}
                disabled={protectionInput?.code?.length !== 6}
              >
                Entrar na sala da partida
              </Button>
            </div>
          ) : (     
            <QueueJoinButton
              disabledJoinByAuth={disabledJoinByAuth}
              disabledJoinByStarted={disabledJoinByStarted}
              onClick={joinQueue}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
