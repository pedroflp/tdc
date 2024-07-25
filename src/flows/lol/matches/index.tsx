import { getMatches } from "@/app/api/lol/matches/requests";
import { UserDTO } from "@/app/api/user/types";
import { routeNames } from "@/app/route.names";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/router";
import { MatchItem } from "../queue/types";
import { MatchCard } from "./components/MatchCard";

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
					<MatchCard key={match.id} match={match} />
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