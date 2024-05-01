import { UserDTO } from "@/app/api/user/types"
import { QueueItem } from "../queue/types"

export type QueueCompositionSelectProps = {
  queue: QueueItem,
  user: UserDTO,
}