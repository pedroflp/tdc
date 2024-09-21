import { Host, Player, Teams } from "@/flows/lol/queue/types"
import { UserDTO } from "../../../user/types"

export type HonorPlayersRequestDTO = {
  matchId: string,
  honors: {
    mvp: UserDTO["username"],
    hostage: UserDTO["username"],
    bricklayer: UserDTO["username"],
  }
  honoredBy: UserDTO["username"]
}

export type HonorUserDTO = {
  username: UserDTO["username"],
  votes: Array<UserDTO["username"]>
}

export type HonorPlayerDTO = {
  player: Player
  votes: Array<UserDTO["username"]>
}

export const HonorPlayersTimerMinutes = 2;