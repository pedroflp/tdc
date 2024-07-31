import { UserDTO } from "@/app/api/user/types"
import { Player, QueueItem } from "@/flows/lol/queue/types"

export type QueueSlotProps = {
  player: Player,
  user?: UserDTO,
  className?: string,
}