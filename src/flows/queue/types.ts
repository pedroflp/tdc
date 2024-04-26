// queue-data.d.ts

export interface Player {
  username: string;
  name: string;
  score?: number;
  avatar?: string;
  ready?: boolean;
}

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
  players: Array<Player>
}
