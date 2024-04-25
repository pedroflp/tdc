import { StartQueueResponseDTO } from "./types";

export async function startQueue(): Promise<StartQueueResponseDTO> {
  try {
    const response = await fetch('/api/queue', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Personalizada',
      })
    });
    const data = await response.json();
    console.log(data)

    return data;
  } catch (error) {
    return null;
  }
}