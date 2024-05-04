'use client';

import { signIn } from "@/app/api/auth/signin/requests"
import { signUp } from "@/app/api/auth/signup/requests"
import ErrorCard from "@/components/ErrorCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function SignDialog() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  async function handleSignIn() {
    setIsAuthenticating(true);
    setAuthError(null);

    const response = await signIn(String(username).toLocaleLowerCase(), password);

    if (!response.success && response.error) {
      setAuthError(response.error)
      setIsAuthenticating(false);
      return;
    }

    router.refresh();
  }

  async function handleSignUp() {
    setIsCreatingAccount(true);

    const response = await signUp(String(username).toLocaleLowerCase(), password);

    if (!response.success) {
      setIsCreatingAccount(false)
      setAuthError(response.error!) 
    }
  
    router.refresh();
  }
 
  function clearFields() {
    setUsername('')
    setPassword('')
    setAuthError(null)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Entrar ou criar conta</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-2xl">Ingressar na plataforma</DialogTitle>
        <Tabs defaultValue="account">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger disabled={isCreatingAccount || isAuthenticating} onClick={clearFields} value="sigin">Entrar</TabsTrigger>
            <TabsTrigger disabled={isCreatingAccount || isAuthenticating} onClick={clearFields} value="signup">Criar conta</TabsTrigger>
          </TabsList>

          <TabsContent value="sigin">
            <Card>
              <CardHeader>
              <CardTitle>Entrar</CardTitle>
              <CardDescription>
                Entre em sua conta para ingressar em partidas e criar a sua própria competição!
              </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label>Username</Label>
                  <Input disabled={isCreatingAccount || isAuthenticating} value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>Senha</Label>
                  <Input disabled={isCreatingAccount || isAuthenticating} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <ErrorCard error={authError} />
              </CardContent>
              <CardFooter>
                <Button onClick={handleSignIn} disabled={isAuthenticating} className="w-full">
                  {isAuthenticating ? "Entrando..." : "Entrar"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card>
              <CardHeader>
              <CardTitle>Criar conta</CardTitle>
              <CardDescription>
                Crie sua conta para ingressar em partidas e criar a sua própria competição!
              </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Username (esse não será seu nome de exibição)</Label>
                  <Input disabled={isCreatingAccount || isAuthenticating} placeholder="gilsocasboy" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">Senha (min. 6 caracteres)</Label>
                  <Input disabled={isCreatingAccount || isAuthenticating} type="password" placeholder="piupiu123" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <ErrorCard error={authError} />
              </CardContent>
              <CardFooter>
                <Button onClick={handleSignUp} disabled={isCreatingAccount} className="w-full">
                  {isCreatingAccount ? "Criando conta..." : "Criar conta"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
