import { fetchLOLApi } from "@/services/api/fetchLOLApi";
import { ApiResponse } from "../../types";
import { SignInResponseDTO } from "./types";

export async function signIn(username: string, password: string): Promise<ApiResponse<SignInResponseDTO>> {
  const response = await fetchLOLApi('auth/signin', {
    method: 'POST',
    body: JSON.stringify({username, password}),
  });

  const data = await response.json();
  return data;
}