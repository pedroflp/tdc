import { Host, Player, Teams } from "@/flows/queue/types"

export type CreateMatchRequestDTO = {
  teams: Teams, hoster: Host, name: string, queueId: string, players: Array<Player>
}