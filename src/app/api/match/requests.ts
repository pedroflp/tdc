import { Host, MatchItem, Teams } from "@/flows/queue/types";
import { fetchApi } from "@/utils/fetchApi";
import { ApiResponse } from "../types";

export async function createMatch(teams: Teams, hoster: Host, name: string, queueId: string): Promise<ApiResponse<{
  matchId: string
}>> {
  const response = await fetchApi('match', {
    method: 'POST',
    body: JSON.stringify({
      teams,
      hoster,
      name,
      queueId
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