import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useMemo, useState } from 'react';
import MatchOptionCard from '../MatchOptionCard';
import { MatchModesEnum } from '../MatchOptionCard/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function MatchCreation({
  onCreateMatch
}: { onCreateMatch: (name: string, mode: MatchModesEnum) => void }) {
  const [name, setName] = useState("");
  const [selectedMode, setSelectedMode] = useState<MatchModesEnum>();

  const matchName = useMemo(() => {
    return name.length > 0 ? name : "Personalizada"
  }, [name]);
  
  function handleCreateMatch() {
    onCreateMatch(matchName, selectedMode!);
  }

  return (
    <Dialog>
      <DialogTrigger>
        <span className="p-3 px-6 bg-black rounded text-white font-bold text-sm hover:bg-gray-800">Criar nova partida</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar nova partida</DialogTitle>
        </DialogHeader>
        <DialogDescription>Aqui você manda na competição. Defina o modo de jogo da sua partida e chame os amigos para competir!</DialogDescription>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label>Defina o nome da sala (opcional)</Label>
            <Input placeholder='Personalizada' value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className='space-y-2'>
            <Label>Escolha o modo</Label>
            <div className="grid grid-cols-2 gap-4">
              <MatchOptionCard
                name="Clássico"
                mode={MatchModesEnum.CLASSIC}
                selected={selectedMode === MatchModesEnum.CLASSIC}
                src="/assets/icons/default-match.png"
                alt="Badge de experiência do modo clássico"
                onClick={setSelectedMode}
                description="Os jogadores serão aleatoriamente escolhidos para os times. Os jogadores do time vencedor ganharão pontuação pela vitória."
              />
              <MatchOptionCard
                name="Hardcore"
                mode={MatchModesEnum.HARDCORE}
                selected={selectedMode === MatchModesEnum.HARDCORE}
                src="/assets/icons/hardcore-match.png"
                alt="Troféu vitorioso do modo hardcore"
                onClick={setSelectedMode}
                disabled
                description="Os jogadores serão aleatoriamente escolhidos para o time com a role predefinida. Os jogadores do time vencedor ganharão pontos pela vitória e desempenho individual."
              />
            </div>
          </div>
        </div>
        <Button disabled={!selectedMode} onClick={handleCreateMatch} className='w-full mt-4'>
          {selectedMode ? `Confirmar criação da ${matchName.length > 0 ? matchName : "Personalizada"}` : "Selecione o modo de jogo para continuar!" }
        </Button>
      </DialogContent>
    </Dialog>
  )
}
