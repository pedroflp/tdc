'use client';

import { routeNames } from "@/app/route.names";
import { AvatarStack } from "@/components/Avatar/avatar-stack";
import UserAvatarAndName from "@/components/UserAvatarAndName";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchModesIcons, MatchModesEnum, MatchModesNames } from "@/flows/home/components/MatchOptionCard/types";
import { MatchItem } from "@/flows/lol/queue/types";
import { formatDate } from "@/utils/formatDate";
import { match } from "assert";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import router from "next/router";

export function MatchCard({ match }: {match: MatchItem}) {
    const router = useRouter();
    return (
    <Card key={match.id} >
        <CardHeader className="flex flex-row justify-between gap-16 items-start mb-4">
            <div className='flex flex-col gap-1'>
                <div className="flex items-center gap-3">
                    <CardTitle className='text-xl'>{match.name}</CardTitle>
                </div>
                <div className="text-xs text-muted-foreground/60 flex gap-1 items-center">
                    <p>Criada por</p>
                    <div className="flex gap-1 items-center">
                        <UserAvatarAndName canOpenProfileByAvatar name={{size: "text-md"}} size={6} user={match.hoster} />
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-end text-sm text-muted-foreground">
                <div className='flex gap-1 items-center'>
                    <p>Modo de jogo </p>
                    <Image
                        src={MatchModesIcons[match.mode ?? MatchModesEnum.CLASSIC]}
                        width={1000}
                        height={1000}
                        objectFit='cover'
                        className='w-6 h-6'
                        alt={`Badge modo de partida ${MatchModesNames[match.mode ?? MatchModesEnum.CLASSIC]}`}
                    />
                    <strong>{MatchModesNames[match.mode]}</strong>
                </div>
                <p>Partida jogada em <strong>{formatDate(match.createdAt)}</strong></p>
            </div>
        </CardHeader>
        <CardContent className="flex justify-between items-end gap-4">
            <div className="flex flex-col gap-4">
                <div className="flex gap-2 items-center">
                    <Image
                        src={MatchModesIcons[match.mode ?? MatchModesEnum.CLASSIC]}
                        width={1000}
                        height={1000}
                        objectFit='cover'
                        className='w-8 h-8'
                        alt={`Badge modo de partida ${MatchModesNames[match.mode ?? MatchModesEnum.CLASSIC]}`}
                    />
                    <AvatarStack canOpenProfileByAvatar avatarClassName="border-2 border-yellow-500" spacing="2xl" maxAvatarsAmount={10} avatars={match.teams[match.winner] } />
                </div>
                {match.mvp && (
                    <div className="flex gap-2 items-center">
                        <Image
                            src="/assets/icons/mvp.png"
                            width={1000}
                            height={1000}
                            objectFit='cover'
                            className='w-8 h-8'
                            alt={`Badge medalha MVP`}
                        />
                        <UserAvatarAndName canOpenProfileByAvatar name={{size: "text-md"}} user={match.mvp} />
                    </div>
                )}
                {match.hostage && (
                    <div className="flex gap-2 items-center">
                        <Image
                            src="/assets/icons/hostage.png"
                            width={1000}
                            height={1000}
                            objectFit='cover'
                            className='w-8 h-8'
                            alt={`Badge medalha Refém`}
                        />
                        <UserAvatarAndName canOpenProfileByAvatar name={{size: "text-md"}} user={match.hostage} />
                    </div>
                )}
                {match.bricklayer && (
                    <div className="flex gap-2 items-center">
                        <Image
                            src="/assets/icons/bricklayer.png"
                            width={1000}
                            height={1000}
                            objectFit='cover'
                            className='w-8 h-8'
                            alt={`Badge medalha Pedreiro`}
                        />
                        <UserAvatarAndName canOpenProfileByAvatar name={{size: "text-md"}} user={match.bricklayer} />
                    </div>
                )}
            </div>
            <Link href={routeNames.MATCH(match.id)}>
                <Button variant="secondary">Visualizar detalhes da partida</Button>
            </Link>
        </CardContent>
    </Card>
    )
}