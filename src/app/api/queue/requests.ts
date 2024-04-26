import { fetchApi } from "@/utils/fetchApi";
import { StartQueueResponseDTO } from "./types";
import { MatchModesEnum } from "@/flows/home/components/MatchOptionCard/types";

export async function startQueue(name: string, mode: MatchModesEnum): Promise<StartQueueResponseDTO> {
  try {
    const response = await fetchApi('queue', {
      method: 'POST',
      body: JSON.stringify({
        name,
        mode,
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}