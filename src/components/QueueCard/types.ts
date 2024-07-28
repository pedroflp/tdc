import { UserDTO } from "@/app/api/user/types"
import { QueueItem } from "@/flows/lol/queue/types"

export type QueueCardProps = {
  queue: QueueItem,
  user: UserDTO,
  disabledJoinByAuth: boolean,
  disabledJoinByStarted: boolean,
  handleEnterQueue: (queueId: string, user: UserDTO) => void,
}