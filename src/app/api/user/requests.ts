import { cookiesKeys } from "@/constants/cookies";
import { fetchApi } from "@/services/api/fetchApi";
import { cookies } from "next/headers";
import { UserDTO } from "./types";

export async function getUserDataByToken(options?: RequestInit): Promise<UserDTO | null> {
  const token = cookies().get(cookiesKeys.TOKEN);
  if (!token) return null;

  const response = await fetchApi('user', {
    method: 'GET',
    headers: {
      [cookiesKeys.TOKEN]: token.value
    },
    ...options,
  });

  const data = await response.json();
  return data;
}