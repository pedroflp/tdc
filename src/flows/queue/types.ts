import { UserDTO } from "@/app/api/user/types";

export type Player = UserDTO

export interface Team {
  players: Array<Player>
}

export interface Match {
  id: string;
  started: boolean;
  finished: boolean;
  teamWinner?: MatchTeamsEnum;
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

export interface Composition {
  id: string,
  votes: Array<Player>,
  teams: {
    [MatchTeamsEnum.BLUE]: Team;
    [MatchTeamsEnum.RED]: Team;
  },
}

export interface QueueItem {
  id: string;
  name: string;
  password?: string;
  createdAt: string;
  hoster: Host;
  match: Match;
  teams: {
    [MatchTeamsEnum.BLUE]: Team;
    [MatchTeamsEnum.RED]: Team;
  };
  compositions?: Array<Composition>
  players: Array<Player>
}
