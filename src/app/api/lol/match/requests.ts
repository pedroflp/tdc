import { MatchItem } from "@/flows/lol/queue/types";
import { fetchLOLApi } from "@/services/api/fetchLOLApi";
import { ApiResponse } from "../../types";
import { CreateMatchRequestDTO } from "./types";
import { calculateAndDistributePlayersHonors } from "./honor/requests";

export async function createMatch({ teams, hoster, name, queueId, players }: CreateMatchRequestDTO): Promise<ApiResponse<{
  matchId: string
}>> {
  const response = await fetchLOLApi('match', {
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

export async function declareMatchWinnerAndStartHonorVotes(matchId: string, winner: MatchItem["winner"]): Promise<ApiResponse<{
  matchId: string
}>> {
  const response = await fetchLOLApi('match', {
    method: 'PUT',
    body: JSON.stringify({matchId, winner})
  });
  
  const data = await response.json();
  return data;
}