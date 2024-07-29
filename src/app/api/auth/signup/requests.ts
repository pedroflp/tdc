import { fetchApi } from "@/services/api/fetchApi";
import { DiscordUserDTO } from "../../user/types";

export async function signUp(user: DiscordUserDTO) {
  const response = await fetchApi('auth/signup', {
    method: 'POST',
    body: JSON.stringify({user}),
  });

  const data = await response.json();
  
  return data;
}