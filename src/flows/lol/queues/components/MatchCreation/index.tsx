import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useMemo, useState } from 'react';
import MatchOptionCard from '../MatchOptionCard';
import { MatchModesEnum, MatchModesIcons, MatchModesNames } from '../MatchOptionCard/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { Plus } from 'lucide-react';

export default function MatchCreation({
  creatingQueue,
  onCreateMatch,
  disableCreation
}: { disableCreation?: boolean, creatingQueue: boolean, onCreateMatch: (name: string, mode: MatchModesEnum, protectMode: { enabled: boolean, code: string }) => void }) {
  const [name, setName] = useState("");
  const [selectedMode, setSelectedMode] = useState<MatchModesEnum>(MatchModesEnum.CLASSIC);
  const [protectMode, setProtectMode] = useState({
    enabled: false,
    code: ""
  })

  const matchName = useMemo(() => {
    return name.length > 0 ? name : "Personalizada"
  }, [name]);
  
  function handleCreateMatch() {
    onCreateMatch(matchName, selectedMode, protectMode);
  };

  const { canCreateQueue, createQueueAlert } = useMemo(() => {
    if (creatingQueue) return {
      canCreateQueue: false,
      createQueueAlert: "Criando sala..."
    }

    if (protectMode.enabled && protectMode.code.length !== 6) return {
        canCreateQueue: false,
        createQueueAlert: "Preencha os 6 dígitos da senha para continuar"
      }

    if (!selectedMode) return {
      canCreateQueue: false,
      createQueueAlert: "Selecione um modo de jogo para continuar"
    }

    return {
      canCreateQueue: true,
      createQueueAlert: "Confirmar criação da sala"
    }
  }, [creatingQueue, selectedMode, protectMode])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={disableCreation} className='gap-1 py-6 text-md'>
          <Plus />
          Criar sala
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-2xl'>Criar sala</DialogTitle>
        </DialogHeader>
        <DialogDescription>Aqui você manda na competição. Defina o modo de jogo da sua sala e chame os amigos para competir!</DialogDescription>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label>Escolha o modo da partida</Label>
            <div className="grid grid-cols-2 gap-4">
              <MatchOptionCard
                name={MatchModesNames[MatchModesEnum.CLASSIC]}
                mode={MatchModesEnum.CLASSIC}
                selected={selectedMode === MatchModesEnum.CLASSIC}
                src={MatchModesIcons[MatchModesEnum.CLASSIC]}
                alt="Badge de experiência do modo clássico"
                onClick={setSelectedMode}
                description="Os jogadores serão aleatoriamente escolhidos para os times. Os jogadores do time vencedor ganharão pontuação pela vitória."
              />
              <MatchOptionCard
                name={MatchModesNames[MatchModesEnum.HARDCORE]}
                mode={MatchModesEnum.HARDCORE}
                selected={selectedMode === MatchModesEnum.HARDCORE}
                src={MatchModesIcons[MatchModesEnum.HARDCORE]}
                alt="Troféu vitorioso do modo hardcore"
                onClick={setSelectedMode}
                disabled
                description="Os jogadores serão aleatoriamente escolhidos para o time com a role predefinida. Os jogadores do time vencedor ganharão pontos pela vitória e desempenho individual."
              />
            </div>
          </div>
          <div className='space-y-2'>
            <Label>Nome de exibição da sala (opcional)</Label>
            <Input placeholder='Personalizada' value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className='space-y-4'>
           <div className='flex gap-2 items-center'>
            <Label>Solicitar senha para entrar na sala (opcional)</Label>
            <Switch checked={protectMode.enabled} onCheckedChange={value => setProtectMode({ ...protectMode, enabled: value })} />
            </div>
            {protectMode.enabled && (
              <InputOTP value={protectMode.code} onChange={e => setProtectMode({ ...protectMode, code: e })} maxLength={6}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            )}
          </div>
        </div>
        <Button disabled={disableCreation || !canCreateQueue} onClick={handleCreateMatch} className='w-full mt-4'>
          {createQueueAlert}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
