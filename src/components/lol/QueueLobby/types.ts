import { UserDTO } from "@/app/api/user/types"
import { QueueItem } from "../../../flows/lol/queue/types"

export type QueueLobbyProps = {
  user?: UserDTO,
  queue: QueueItem,
  isQueueReadyToPlay: boolean,
  handleExitFromQueue: (username: string) => void,
  handleUnlockUserToJoin: (username: string) => void,
  deleteQueue: () => void,
  generateQueueCompositions: () => void,
  handleNavigateToComposition: () => void,
}