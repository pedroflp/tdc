import { MatchItem } from "@/flows/lol/queue/types";
import { fetchLOLApi } from "@/services/api/fetchLOLApi";
import { ApiResponse } from "../../../types";
import { HonorPlayersRequestDTO } from "./types";
 "./types";

export async function honorPlayers({ matchId, honors, honoredBy }: HonorPlayersRequestDTO): Promise<ApiResponse<{
  matchId: string
}>> {
  const response = await fetchLOLApi('match/honor', {
    method: 'POST',
    body: JSON.stringify({ matchId, honors, honoredBy }),
  });
  
  const data = await response.json();
  return data;
};

export async function calculateAndDistributePlayersHonors({ matchId }: { matchId: string }) {
  const response = await fetchLOLApi('match/honor', {
    method: 'PUT',
    body: JSON.stringify({ matchId }),
  });

  const data = await response.json();
  return data;
};

export async function deleteQueue({ matchId }: { matchId: string }) {
  await fetchLOLApi('queue', {
    method: 'DELETE',
    body: JSON.stringify({ queueId: matchId })
  });
}