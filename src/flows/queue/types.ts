// queue-data.d.ts

export interface Player {
  id?: string;
  name: string;
  score?: number;
  avatar?: string;
  ready?: boolean;
}

export interface Team {
  players: {
    [id: string]: Player
  };
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
  id: string;
  name: string;
  avatar: string;
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
  players: {
    [id: string]: Player
  };
}
