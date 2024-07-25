import { fetchLOLApi } from "@/services/api/fetchLOLApi";
import { SignUpResponseDTO } from "./types";

export async function signUp(username: string, password: string): Promise<SignUpResponseDTO> {
  const response = await fetchLOLApi('auth/signup', {
    method: 'POST',
    body: JSON.stringify({username, password}),
  });

  const data = await response.json();
  
  return data;
}