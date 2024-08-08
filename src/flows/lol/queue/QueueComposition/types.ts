import { UserDTO } from "@/app/api/user/types"
import { QueueItem } from "../types"

export type QueueCompositionSelectProps = {
  queue: QueueItem,
  user: UserDTO,
}

export const QueueRoleIconsByPlayer = {
  0: {
    icon: '/assets/icons/lol/top.png',
    label: 'Top Lane'
  },
  1: {
    icon: '/assets/icons/lol/jungle.png',
    label: 'Jungle'
  },
  2: {
    icon: '/assets/icons/lol/mid.png',
    label: 'Mid Lane'
  },
  3: {
    icon: '/assets/icons/lol/bot.png',
    label: 'Bot Lane'
  },
  4: {
    icon: '/assets/icons/lol/support.png',
    label: 'Support'
  }
} as {
  [key: number]: {
    icon: string, label: string
} }