import { UserDTO } from "@/app/api/user/types";

export type Player = UserDTO

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
  password?: string;
  createdAt: string;
  hoster: Host;
  match: QueueMatch;
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
}
