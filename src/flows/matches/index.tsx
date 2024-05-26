import { getMatches } from "@/app/api/matches/requests";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchItem, MatchTeamsEnum, Player } from "../queue/types";
import { UserDTO } from "@/app/api/user/types";
import Avatar from "@/components/Avatar";
import { AvatarStack } from "@/components/Avatar/avatar-stack";
import Image from "next/image";
import { MatchModesEnum, MatchModesIcons, MatchModesNames } from "../home/components/MatchOptionCard/types";
import { formatDate } from "@/utils/formatDate";
import UserAvatarAndName from "@/components/UserAvatarAndName";
import Link from "next/link";
import { routeNames } from "@/app/route.names";
import { Button } from "@/components/ui/button";

export default async function MatchesPage({ user }: { user?: UserDTO }) {
	const { matches } = await getMatches();
	return (
		<div className="xl:max-w-[50%] md:max-w-[80%] max-w-[90%] flex flex-col m-auto gap-8">
			<div className="flex justify-between gap-16 items-center">
				<div className="space-y-2">
					<h1 className="text-3xl font-bold">Partidas finalizadas</h1>
					<p className="text-muted-foreground">Visualize abaixo as partidas jogadas e finalizadas por você e outros jogadores!</p>
				</div>
				<Link href={routeNames.HOME}>
					<Button variant="outline">Voltar para o início</Button>
				</Link>
			</div>
			<div className="grid grid-cols-1 gap-8">
				{matches.length > 0 ? matches.map((match: MatchItem) => (
					<Link key={match.id} href={routeNames.MATCH(match.id)}>
						<Card>
							<CardHeader className="flex flex-row justify-between gap-16 items-start mb-4">
								<div className='flex flex-col gap-1'>
									<div className="flex items-center gap-3">
										<CardTitle className='text-xl'>{match.name}</CardTitle>
									</div>
									<div className="text-xs text-muted-foreground/60 flex gap-1 items-center">
										<p>Criada por</p>
										<div className="flex gap-1 items-center">
											<UserAvatarAndName name={{size: "text-md"}} size={6} user={match.hoster} />
										</div>
									</div>
								</div>
								<div className="flex flex-col items-end text-sm text-muted-foreground">
									<p className='flex gap-1 items-center'>
										Modo de jogo 
										<Image
											src={MatchModesIcons[match.mode ?? MatchModesEnum.CLASSIC]}
											width={1000}
											height={1000}
											objectFit='cover'
											className='w-6 h-6'
											alt={`Badge modo de partida ${MatchModesNames[match.mode ?? MatchModesEnum.CLASSIC]}`}
										/>
										<strong>{MatchModesNames[match.mode]}</strong>
									</p>
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
										<AvatarStack avatarClassName="border-2 border-yellow-500" spacing="2xl" maxAvatarsAmount={10} avatars={match.teams[match.winner] } />
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
											<UserAvatarAndName name={{size: "text-md"}} user={match.mvp} />
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
											<UserAvatarAndName name={{size: "text-md"}} user={match.hostage} />
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
											<UserAvatarAndName name={{size: "text-md"}} user={match.bricklayer} />
										</div>
									)}
								</div>
								<Button variant="secondary">Visualizar detalhes da partida</Button>
							</CardContent>
						</Card>
					</Link>
				)) : (
				<Card>
					<CardHeader>
						<CardTitle className="text-xl text-primary/70">Nenhuma partida encontrada!</CardTitle>
					</CardHeader>
					<CardContent>
						<CardDescription className="text-primary/50">
							Não foi possível encontrar nenhuma partida com base nos filtros selecionados.
							<strong> Troque alguns filtros ou crie uma nova partida para talvez encontrarmos a partida que você procura!</strong>
						</CardDescription>
					</CardContent>
				</Card>
				)}
			</div>
		</div>
	)
} 