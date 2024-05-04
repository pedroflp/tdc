import { UserDTO } from "@/app/api/user/types"
import { QueueItem } from "../../types"

export type QueueLobbyProps = {
  user: UserDTO,
  queue: QueueItem,
  playerAlreadyInQueue: boolean,
  isQueueReadyToPlay: boolean,
  joinQueue: (position: number) => void,
  handleRemove: (position: number) => void,
  deleteQueue: () => void,
  generateQueueCompositions: () => void,
  handleNavigateToComposition: () => void,
}