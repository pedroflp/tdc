import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SignDialog({ username, setUsername, password, setPassword, isAuthenticating, isCreatingAccount, handleSignUp, handleSignIn, error }: any) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Entrar ou criar conta</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Entrar ou criar conta</DialogTitle>
          <DialogDescription>
            Entre ou crie sua conta para ingressar em partidas ou criar a sua própria competição!
          </DialogDescription>
        </DialogHeader>
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid gap-4 mb-4">
          <div className="flex flex-col gap-2">
            <Label>Username</Label>
            <Input
              className="w-full"
              placeholder="gilsocasboy"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Senha</Label>
            <Input
              className="w-full"
              placeholder="piupiu123"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button className="w-full" disabled={isAuthenticating} onClick={handleSignIn} type="submit">Entrar</Button>
          <Button className="w-full" variant="outline" disabled={isCreatingAccount} onClick={handleSignUp} type="submit">Criar conta</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
