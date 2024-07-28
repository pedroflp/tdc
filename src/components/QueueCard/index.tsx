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
import { useRouter } from 'next/navigation'

export default function QueueCard({
  queue,
  user,
  disabledJoinByAuth,
  disabledJoinByStarted,
  disabledJoinByHasMatchActive,
  handleEnterQueue
}: QueueCardProps) {
  const { push } = useRouter();
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
    push(routeNames.QUEUE(queue.id));
  }

  async function handleValidateProtectionCode() {
    if (!protectionInput.code) return;

    const response = await validateQueueProtectionCode(queue.id, protectionInput.code);

    if (!response?.success) {
      setProtectionInput({ ...protectionInput, error: response?.error! });
      return
    }

    handleEnterQueue(queue.id, user);
    push(routeNames.QUEUE(queue.id));
  }

  const QueueJoinButton = useCallback(({
    disabledJoinByAuth,
    disabledJoinByStarted,
    disabledJoinByHasMatchActive,
    onClick
  }: Pick<QueueCardProps, 'disabledJoinByAuth' | 'disabledJoinByStarted' | 'disabledJoinByHasMatchActive'> & {
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
    if (disabledJoinByHasMatchActive) return <Button disabled>Você já está em uma sala ou partida ativa</Button>
    if (queue.blackList?.includes(user?.username)) return <Button disabled>Você está bloqueado para entrar</Button>
    return <Button onClick={onClick}>Participar e entrar na sala</Button>;
  }, [user, queue]);

  return (
    <Card className="relative bg-gradient-to-r from-secondary/80 to-transparent min-w-[500px] w-full overflow-hidden">
      <CardHeader className="flex flex-row justify-between gap-16 items-start mb-4">
        <div className='flex flex-col gap-2'>
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <CardTitle className='text-2xl'>{queue.name}</CardTitle>
            <Badge className='w-max'>{queue.matchId ? "Partida iniciada" : "Sala em preparação"}</Badge>
          </div>
          <div className='flex items-center gap-4'>
            <div className="flex gap-2 items-center">
              <p className='text-xs text-muted-foreground'>Criada por</p>
              <UserAvatarAndName size={6} name={{size: "text-xs", color: 'text-muted-foreground'}} user={queue.hoster} />
            </div>
            <div className='flex items-center gap-1'>
              <Image
                src={MatchModesIcons[queue?.mode]}
                width={1000}
                height={1000}
                objectFit='cover'
                className='w-6 h-6'
                alt={`Badge modo de partida ${MatchModesNames[queue?.mode]}`}
              />
              <span className='text-xs text-muted-foreground'>Modo {MatchModesNames[queue.mode]}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex justify-between items-end gap-4">
        <AvatarStack
          highlightUser={user?.username}
          canOpenProfileByAvatar
          spacing="xl"
          id="avatar-stack"
          maxAvatarsAmount={10}
          avatars={queue.players.filter((player: Player) => !!player?.username)}
        />
        {/* <div className="text-sm text-muted-foreground">
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
        </div> */}
        <div className='flex flex-col gap-4 items-end 2xl:flex-row'>
          {queue.protection?.enabled && (
            <Badge className='bg-secondary/70 text-secondary-foreground/50 p-3 px-6'>
              <span className='flex gap-2 items-center'>
                <Lock size={16} />
                Sala com senha
              </span>
            </Badge>
          )}
          <div className='relative z-[2]'>
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
                disabledJoinByHasMatchActive={disabledJoinByHasMatchActive}
                onClick={joinQueue}
              />
            )}
          </div>
          <Image
            src={MatchModesIcons[queue?.mode]}
            width={1000}
            height={1000}
            objectFit='cover'
            className='absolute -top-6 -right-16 -rotate-12 w-64 h-64 z-0 blur-md opacity-20'
            alt={`Badge modo de partida ${MatchModesNames[queue?.mode]}`}
          />
        </div>
      </CardContent>
    </Card>
  )
}
