import { Host, Player, Teams } from "@/flows/lol/queue/types"

export type CreateMatchRequestDTO = {
  teams: Teams, hoster: Host, name: string, queueId: string, players: Array<Player>
}