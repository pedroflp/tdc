import { fetchApi } from "@/utils/fetchApi";
import { StartQueueResponseDTO } from "./types";

export async function startQueue(): Promise<StartQueueResponseDTO> {
  try {
    const response = await fetchApi('queue', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Personalizada',
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}