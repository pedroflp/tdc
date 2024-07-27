'use client';

import { signInWithUsername } from "@/app/api/auth/signin/requests";
import DiscordOAuth from "@/components/DiscordOAuth";
import ErrorCard from "@/components/ErrorCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
;

export function SignDialog({ authCode }: { authCode: string | null }) {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [isSignInDialogOpened, setIsSignInDialogOpened] = useState(false);

  async function handleSignIn() {
    setIsAuthenticating(true);
    setAuthError(null);

    const response = await signInWithUsername(String(username).toLocaleLowerCase(), password);

    if (!response.success && response.error) {
      setAuthError(response.error)
      setIsAuthenticating(false);
      return;
    }

    router.refresh();
  }

  useEffect(() => {
    setIsSignInDialogOpened(!!authCode)
  }, [authCode]);

  return (
    <Dialog open={isSignInDialogOpened} onOpenChange={setIsSignInDialogOpened}>
      <DialogTrigger asChild>
        <Button variant="outline">Entrar na conta</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>

          <DialogTitle className="text-2xl">Entrar na conta</DialogTitle>
          <DialogDescription>
            Entre em sua conta para ingressar em partidas e criar a sua própria competição!
          </DialogDescription>

        </DialogHeader>
        
        <Alert className="bg-yellow-400/20 border-yellow-600/60">
          <AlertTitle>O acesso por Username e Senha será <strong>descontinuado</strong>! </AlertTitle>
          <AlertDescription>
            Caso já possua uma conta criada, entre nela para depois <strong>fazer a migração para acesso por Discord</strong>.
          </AlertDescription>
        </Alert>

        <div className={cn(isAuthenticating && "pointer-events-none")}>
          <div className="space-y-1">
            <Label>Username</Label>
            <Input disabled={isAuthenticating} value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="space-y-1 mb-4">
            <Label>Senha</Label>
            <Input disabled={isAuthenticating} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <ErrorCard error={authError} />

          <Button disabled={!username || !password || isAuthenticating} onClick={handleSignIn} className="w-full mt-4">
            {isAuthenticating ? "Entrando..." : "Entrar"}
          </Button>
        </div>


        <div className="relative my-4">
          <span className="absolute -top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background text-muted-foreground/60 p-4 text-sm">Ou</span>
          <Separator className="h-[1px] bg-border w-full" />
        </div>

        <DiscordOAuth
          authCode={authCode}
          disabled={isAuthenticating}
          onSuccess={() => setIsSignInDialogOpened(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
