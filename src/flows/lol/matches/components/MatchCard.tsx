'use client';

import { routeNames } from "@/app/route.names";
import { AvatarStack } from "@/components/Avatar/avatar-stack";
import UserAvatarAndName from "@/components/UserAvatarAndName";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchItem } from "@/flows/lol/queue/types";
import { MatchModesEnum, MatchModesIcons, MatchModesNames } from "@/flows/lol/queues/components/MatchOptionCard/types";
import { formatDate } from "@/utils/formatDate";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function MatchCard({ match }: { match: MatchItem }) {
    const honors = [
        {
            icon: '/assets/icons/mvp.png',
            text: 'MVP da partida',
            honored: match.mvp?.player,
        },
        {
            icon: '/assets/icons/hostage.png',
            text: 'Hostage da partida',
            honored: match.hostage?.player,
        },
        {
            icon: '/assets/icons/bricklayer.png',
            text: 'Bricklayer da partida',
            honored: match.bricklayer?.player,
        },
    ];

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
                    <AvatarStack canOpenProfileByAvatar avatarClassName="border-2 border-yellow-500" spacing="2xl" maxAvatarsAmount={10} avatars={match.teams[match.winner]} />
                </div>
                {honors.map(({ icon, text, honored }) => honored && (
                    <div className="flex gap-2 items-center">
                        <Image
                            src={icon}
                            width={1000}
                            height={1000}
                            objectFit='cover'
                            className='w-6 h-6'
                            alt={text}
                        />
                        <UserAvatarAndName canOpenProfileByAvatar size={9} name={{size: "text-md"}} user={honored} />
                    </div>
                ))}
            </div>
            <Link href={routeNames.MATCH(match.id)}>
                <Button variant="secondary">Visualizar detalhes da partida</Button>
            </Link>
        </CardContent>
    </Card>
    )
}