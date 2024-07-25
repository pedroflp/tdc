import { fetchLOLApi } from "@/services/api/fetchLOLApi";
import { StartQueueResponseDTO } from "../types";
import { MatchModesEnum } from "@/flows/home/components/MatchOptionCard/types";
import { UserDTO } from "../../../user/types";

export async function createQueueCompositions(queueId: string): Promise<StartQueueResponseDTO> {
  try {
    const response = await fetchLOLApi('queue/compositions', {
      method: 'POST',
      body: JSON.stringify({ queueId })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

export async function selectQueueCompositions(queueId: string, compositionId: string, user: UserDTO): Promise<StartQueueResponseDTO> {
  try {
    const response = await fetchLOLApi('queue/compositions', {
      method: 'PUT',
      body: JSON.stringify({
        queueId,
        compositionId: `${queueId}-${compositionId}`,
        user,
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}