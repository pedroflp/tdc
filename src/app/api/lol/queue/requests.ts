import { fetchLOLApi } from "@/services/api/fetchLOLApi";
import { StartQueueResponseDTO } from "./compositions/types";
import { MatchModesEnum } from "@/flows/lol/queues/components/MatchOptionCard/types";
import { ApiResponse } from "../../types";
import { QueueItem } from "@/flows/lol/queue/types";

export async function validateQueueProtectionCode(queueId: string, code: string): Promise<ApiResponse<StartQueueResponseDTO>> {
  const response = await fetchLOLApi(`queue?queueId=${queueId}&code=${code}`, {
    method: 'GET',
  });
  
  const data = await response.json();
  return data;
}
export async function startQueue(name: string, mode: MatchModesEnum, protectMode: { enabled: boolean, code: string }): Promise<ApiResponse<StartQueueResponseDTO>> {
  const response = await fetchLOLApi('queue', {
    method: 'POST',
    body: JSON.stringify({
      name,
      mode,
      protectMode,
    })
  });
  
  const data = await response.json();
  return data;
}

export async function updateQueue(queueId: string, body: QueueItem) {
  const response = await fetchLOLApi('queue', {
    method: 'PUT',
    body: JSON.stringify({
      queueId,
      body,
    })
  });
  
  const data = await response.json();
  return data;
}