import { UserDTO } from "@/app/api/user/types"
import { QueueItem } from "../types"

export type QueueCompositionSelectProps = {
  queue: QueueItem,
  user: UserDTO,
}