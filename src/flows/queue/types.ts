import { UserDTO } from "@/app/api/user/types";
import { MatchModesEnum } from "../home/components/MatchOptionCard/types";
import { HonorPlayerDTO } from "@/app/api/match/honor/types";

export type Player = Pick<UserDTO, "name" | "avatar" | "username">

export interface Teams {
  [MatchTeamsEnum.BLUE]: Array<Player>;
  [MatchTeamsEnum.RED]: Array<Player>;
}
export interface QueueMatch {
  id: string;
  started: boolean;
  finished: boolean;
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
  match: QueueMatch;
  mode: MatchModesEnum;
  readyToStartMatch: boolean;
  teams: Teams;
  compositions: Array<Composition>;
  players: Array<Player>;
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
  finished: boolean;
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
