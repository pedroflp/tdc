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
};

export async function calculateAndDistributePlayersHonors({ matchId }: { matchId: string }): Promise<ApiResponse<{
  matchId: string
}>> {
  const response = await fetchApi('match/honor', {
    method: 'PUT',
    body: JSON.stringify({ matchId }),
  });

  const data = await response.json();

  if (data.success) {
    await fetchApi('queue', {
      method: 'DELETE',
      body: JSON.stringify({ queueId: matchId })
    });
  }

  return data;
};