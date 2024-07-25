
export type UserDTO = { 
  username: string;
  name: string;
  avatar: string;
  createdAt: string;
  statistics: UserStatistics;
  activeMatch?: string;
}

export type UserStatistics = {
  played: number;
  won: number;
  points: number;
  mvps: number;
  bricklayer: number;
  hostage: number;
}