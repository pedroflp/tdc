import { cookiesKeys } from "@/constants/cookies";
import { fetchApi } from "@/services/api/fetchApi";
import { cookies } from "next/headers";
import { ApiResponse } from "../../types";
import { UserDTO } from "../types";

export async function getUserData(username: string, options?: RequestInit): Promise<ApiResponse<UserDTO> | null> {
  const token = cookies().get(cookiesKeys.TOKEN);
  if (!token) return null;

  const response = await fetchApi(`user/${username}`, {
    method: 'GET',
    headers: {
      [cookiesKeys.TOKEN]: token.value
    },
    ...options,
  });

  const data = await response.json();
  return data;
}