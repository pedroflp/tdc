import { UserDTO } from "@/app/api/user/types"
import { Player, QueueItem } from "@/flows/lol/queue/types"

export type QueueSlotProps = {
  player?: Player,
  handleKickPlayer?: (username: string) => void,
  user?: UserDTO,
  queue?: QueueItem
  className?: string,
}