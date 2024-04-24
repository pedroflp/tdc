import { SignInResponseDTO } from "./types";

export async function signIn(username: string): Promise<SignInResponseDTO> {
  try {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({username}),
    });

    const data = await response.json();
    
    return data;
  } catch (error) {
    return null;
  }
}