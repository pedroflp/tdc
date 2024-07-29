import { UserDTO } from "@/app/api/user/types";
import { MatchModesEnum } from "../queues/components/MatchOptionCard/types";
import { HonorPlayerDTO } from "@/app/api/lol/match/honor/types";

export type Player = Pick<UserDTO, "name" | "avatar" | "username">

export interface Teams {
  [MatchTeamsEnum.BLUE]: Array<Player>;
  [MatchTeamsEnum.RED]: Array<Player>;
}

export enum MatchTeamsEnum {
  BLUE = "blue",
  RED = "red",
}

export interface Host {
  name: string;
  avatar: string;
  username: string;
}

export interface Composition extends Teams {
  id: string,
  votes: Array<Player>,
}

export interface QueueItem {
  id: string;
  name: string;
  createdAt: string;
  hoster: Host;
  matchId: string;
  mode: MatchModesEnum;
  readyToStartMatch: boolean;
  teams: Teams;
  compositions: Array<Composition>;
  players: Array<Player>;
  blackList?: Array<Player['username']>;
  protection: {
    enabled: boolean;
    code: string;
  } | null
}

export interface MatchItem {
  id: string;
  name: string;
  createdAt: string;
  hoster: Host;
  teams: Teams;
  winner: MatchTeamsEnum,
  finished: boolean,
  mode: MatchModesEnum,
  matchIdInLoL: string,
  queueId: string,
  players: Array<Player & {
    alreadyHonored?: boolean
  }>,
  mvp?: Player,
  hostage?: Player,
  bricklayer?: Player,
  honors?: {
    finished: boolean,
    endDate: string,
    mvp: Array<HonorPlayerDTO> | [],
    hostage: Array<HonorPlayerDTO> | [],
    bricklayer: Array<HonorPlayerDTO> | [],
  }
}
