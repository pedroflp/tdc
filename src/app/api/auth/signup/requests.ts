import { fetchLOLApi } from "@/services/api/fetchLOLApi";
import { SignUpResponseDTO } from "./types";
import { fetchApi } from "@/services/api/fetchApi";

export async function signUp(username: string, password: string): Promise<SignUpResponseDTO> {
  const response = await fetchApi('auth/signup', {
    method: 'POST',
    body: JSON.stringify({username, password}),
  });

  const data = await response.json();
  
  return data;
}