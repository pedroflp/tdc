import { UserDTO } from "@/app/api/user/types"
import { QueueItem } from "@/flows/lol/queue/types"

export type QueueSlotProps = {
  player: UserDTO,
  handleKickPlayer: (username: string) => void,
  user: UserDTO,
  queue: QueueItem
  className?: string,
}