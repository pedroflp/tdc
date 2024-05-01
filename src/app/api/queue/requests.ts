import { fetchApi } from "@/utils/fetchApi";
import { StartQueueResponseDTO } from "./compositions/types";
import { MatchModesEnum } from "@/flows/home/components/MatchOptionCard/types";
import { ApiResponse } from "../types";
import { QueueItem } from "@/flows/queue/types";

export async function startQueue(name: string, mode: MatchModesEnum): Promise<ApiResponse<StartQueueResponseDTO>> {
  const response = await fetchApi('queue', {
    method: 'POST',
    body: JSON.stringify({
      name,
      mode,
    })
  });
  
  const data = await response.json();
  return data;
}

export async function updateQueue(queueId: string, body: QueueItem) {
  const response = await fetchApi('queue', {
    method: 'PUT',
    body: JSON.stringify({
      queueId,
      body,
    })
  });
  
  const data = await response.json();
  return data;
}