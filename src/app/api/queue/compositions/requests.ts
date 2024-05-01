import { fetchApi } from "@/utils/fetchApi";
import { StartQueueResponseDTO } from "../types";
import { MatchModesEnum } from "@/flows/home/components/MatchOptionCard/types";
import { UserDTO } from "../../user/types";

export async function createQueueCompositions(queueId: string, compositions: any): Promise<StartQueueResponseDTO> {
  try {
    const response = await fetchApi('queue/compositions', {
      method: 'POST',
      body: JSON.stringify({
        queueId,
        compositions,
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

export async function selectQueueCompositions(queueId: string, compositionId: string, user: UserDTO): Promise<StartQueueResponseDTO> {
  try {
    const response = await fetchApi('queue/compositions', {
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