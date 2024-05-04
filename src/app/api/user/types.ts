import { Player } from "@/flows/queue/types";

export type UserDTO = { 
  username: string;
  name: string;
  avatar: string;
  createdAt: string;
  statistics: UserStatistics;
}

export type UserStatistics = {
  played: number;
  won: number;
  points: number;
  mvps: number;
}

export type GetUserResponseDTO = UserDTO | null;