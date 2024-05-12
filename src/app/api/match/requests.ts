import { MatchItem } from "@/flows/queue/types";
import { fetchApi } from "@/utils/fetchApi";
import { ApiResponse } from "../types";
import { CreateMatchRequestDTO } from "./types";

export async function createMatch({ teams, hoster, name, queueId, players }: CreateMatchRequestDTO): Promise<ApiResponse<{
  matchId: string
}>> {
  const response = await fetchApi('match', {
    method: 'POST',
    body: JSON.stringify({
      teams,
      hoster,
      name,
      queueId,
      players
    })
  });
  
  const data = await response.json();
  return data;
}

export async function updateMatch(matchId: string, queueId: string, body: MatchItem,): Promise<ApiResponse<{
  matchId: string
}>> {
  const response = await fetchApi('match', {
    method: 'PUT',
    body: JSON.stringify({
      matchId, body
    })
  });
  
  const data = await response.json();

  if (data.success) {
    await fetchApi('queue', {
      method: 'DELETE',
      body: JSON.stringify({queueId})
    })
  }

  return data;
}