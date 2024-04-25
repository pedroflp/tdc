import { cookiesKeys } from "@/constants/cookies";
import { fetchApi } from "@/utils/fetchApi";
import { cookies } from "next/headers";
import { GetUserResponseDTO } from "./types";

export async function getUserData(): Promise<GetUserResponseDTO> {
  const token = cookies().get(cookiesKeys.TOKEN);

  if (!token) return null;

  try {
    const response = await fetchApi('user', {
      method: 'GET',
      headers: {
        [cookiesKeys.TOKEN]: token.value
      }
    })
    const data = await response.json();
    
    return data;
  } catch (error) {
    return null;
  }
}