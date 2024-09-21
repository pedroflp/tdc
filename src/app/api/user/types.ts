
export type UserDTO = { 
  username: string;
  name: string;
  avatar: string;
  createdAt: string;
  statistics: UserStatistics;
  activeMatch?: string;
  verified: boolean;
  roles: UserRoles;
}

export type UserStatistics = {
  played: number;
  won: number;
  points: number;
  mvps: number;
  bricklayer: number;
  hostage: number;
}

export type DiscordUserDTO = {
  id: string;
  username: string;
  avatar?: string | null;
  email?: string | null;
}

export enum UserRoles {
  ADMIN = "admin"
}