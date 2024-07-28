import { UserDTO } from "@/app/api/user/types"
import { QueueItem } from "../../types"

export type QueueLobbyProps = {
  user: UserDTO,
  queue: QueueItem,
  playerAlreadyInQueue: boolean,
  isQueueReadyToPlay: boolean,
  handleExitFromQueue: (username: string) => void,
  deleteQueue: () => void,
  generateQueueCompositions: () => void,
  handleNavigateToComposition: () => void,
}