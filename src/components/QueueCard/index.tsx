import { validateQueueProtectionCode } from '@/app/api/lol/queue/requests'
import { routeNames } from '@/app/route.names'
import { MatchModesIcons, MatchModesNames } from '@/flows/lol/queues/components/MatchOptionCard/types'
import { Player } from '@/flows/lol/queue/types'
import { cn } from '@/lib/utils'
import { formatDate } from '@/utils/formatDate'
import { Lock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { AvatarStack } from '../Avatar/avatar-stack'
import UserAvatarAndName from '../UserAvatarAndName'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '../ui/input-otp'
import { QueueCardProps } from './types'

export default function QueueCard({
  queue,
  user,
  disabledJoinByAuth,
  disabledJoinByStarted,
  handleEnterQueue
}: QueueCardProps) {
  const [protectionInput, setProtectionInput] = useState<{show?: boolean, code?: string, error?: string | null}>({
    show: false,
    code: "",
    error: null,
  });

  const joinQueue = () => {
    if (queue.protection?.enabled && !queue.players.some(player => player?.username === user?.username)) {
      setProtectionInput({show: true, code: ""});
      return;
    }

    handleEnterQueue(queue.id, user);
  }

  async function handleValidateProtectionCode() {
    if (!protectionInput.code) return;

    const response = await validateQueueProtectionCode(queue.id, protectionInput.code);

    if (!response?.success) {
      setProtectionInput({ ...protectionInput, error: response?.error! });
      return
    }

    handleEnterQueue(queue.id, user);
  }

  const QueueBadgeStatus = useCallback(({matchId}: {matchId: string}) => {
    if (matchId) return <Badge>Partida Iniciada</Badge>
    return <Badge variant="secondary">Sala em preparação</Badge>;
  }, []);

  const QueueJoinButton = useCallback(({
    disabledJoinByAuth,
    disabledJoinByStarted,
    onClick
  }: Pick<QueueCardProps, 'disabledJoinByAuth' | 'disabledJoinByStarted'> & {
      onClick: () => void,
    }) => {
    
    if (disabledJoinByAuth) return <Button disabled>Faça login para participar</Button>
    if (queue?.players.some((player: Player) => player?.username === user?.username)) return (
      <Link href={routeNames.QUEUE(queue.id)}>
        <Button>Voltar para a sala</Button>
      </Link>
    )
    if (disabledJoinByStarted) return (
      <Link href={routeNames.MATCH(queue?.matchId)}>
        <Button>Visualizar essa partida</Button>
      </Link>
    )
    return <Button onClick={onClick}>Participar e entrar na sala</Button>;
  }, [user, queue]);

  return (
    <Card className="min-w-[500px] w-full">
      <CardHeader className="flex flex-row justify-between gap-16 items-start mb-4">
        <div className='flex flex-col gap-1'>
          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            <CardTitle className='text-2xl'>{queue.name}</CardTitle>
            <div className='flex items-center gap-2'>
              <QueueBadgeStatus matchId={queue.matchId} />
            </div>
          </div>
        </div>
        <AvatarStack
          highlightUser={user?.username}
          canOpenProfileByAvatar
          spacing="xl"
          id="avatar-stack"
          maxAvatarsAmount={10}
          avatars={queue.players.filter((player: Player) => !!player?.username)}
        />
      </CardHeader>
      <CardContent className="flex justify-between items-end gap-4">
        <div className="text-sm text-muted-foreground">
          <div className="flex gap-1 items-center">
            <p>Criada por</p>
            <UserAvatarAndName canOpenProfileByAvatar size={8} name={{size: "text-sm", color: 'text-muted-foreground'}} user={queue.hoster} />
          </div>
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
