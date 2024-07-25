import { fetchApi } from "@/services/api/fetchApi";
import { ApiResponse } from "../../types";
import { SignInResponseDTO } from "./types";

export async function signIn(username: string, password: string): Promise<ApiResponse<SignInResponseDTO>> {
  const response = await fetchApi('auth/signin', {
    method: 'POST',
    body: JSON.stringify({username, password}),
  });

  const data = await response.json();
  return data;
}