import { database } from "@/services/firebase";
import { onValue, ref } from "firebase/database";
import { StartQueueResponseDTO } from "./types";

export async function startQueue(): Promise<StartQueueResponseDTO> {
  try {
    const response = await fetch('/api/queue', {
      method: 'POST',
      body: JSON.stringify({
        password: '123',
        name: 'Personalizada',
      })
    });
    const data = await response.json();

    return data;
  } catch (error) {
    return null;
  }
}