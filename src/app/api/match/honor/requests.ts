import { MatchItem } from "@/flows/queue/types";
import { fetchApi } from "@/utils/fetchApi";
import { ApiResponse } from "../../types";
import { HonorPlayersRequestDTO } from "./types";
 "./types";

export async function honorPlayers({ matchId, honors, honoredBy }: HonorPlayersRequestDTO): Promise<ApiResponse<{
  matchId: string
}>> {
  const response = await fetchApi('match/honor', {
    method: 'POST',
    body: JSON.stringify({ matchId, honors, honoredBy }),
  });
  
  const data = await response.json();
  return data;
}