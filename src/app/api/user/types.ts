import { Player } from "@/flows/queue/types";

export type UserDTO = { 
  username: string;
  name: string;
  score?: number;
  avatar?: string;
  ready?: boolean;
}

export type GetUserResponseDTO = UserDTO | null;