import { Host, Player, Teams } from "@/flows/queue/types"
import { UserDTO } from "../../user/types"

export type HonorPlayersRequestDTO = {
  matchId: string,
  honors: {
    mvp: UserDTO["username"],
    hostage: UserDTO["username"],
    bricklayer: UserDTO["username"],
  }
  honoredBy: UserDTO["username"]
}

export type HonorPlayerDTO = {
  username: string,
  votes: Array<UserDTO["username"]>
}

export const HonorPlayersTimer = 1000 * 60 * 2; // 2 minutes