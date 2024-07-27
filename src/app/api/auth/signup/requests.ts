import { fetchApi } from "@/services/api/fetchApi";
import { DiscordUserDTO } from "../../user/types";
import { SignUpResponseDTO } from "./types";

export async function signUp(user: DiscordUserDTO): Promise<SignUpResponseDTO> {
  const response = await fetchApi('auth/signup', {
    method: 'POST',
    body: JSON.stringify({user}),
  });

  const data = await response.json();
  
  return data;
}