import { fetchApi } from "@/utils/fetchApi";
import { SignInResponseDTO } from "./types";

export async function signUp(username: string, password: string) {
  try {
    const response = await fetchApi('auth/signup', {
      method: 'POST',
      body: JSON.stringify({username, password}),
    });

    const data = await response.json();
    
    return data;
  } catch (error) {
    return null;
  }
}