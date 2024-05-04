import { cookiesKeys } from "@/constants/cookies";
import { fetchApi } from "@/utils/fetchApi";
import { cookies } from "next/headers";
import { ApiResponse } from "../types";
import { GetUserResponseDTO } from "./types";

export async function getUserData(username?: string, options?: RequestInit): Promise<ApiResponse<GetUserResponseDTO> | null> {
  const token = cookies().get(cookiesKeys.TOKEN);

  if (!token) return null;

  const urlToFetch = username ? `user?username=${username}` : 'user';
  const response = await fetchApi(urlToFetch, {
    method: 'GET',
    headers: {
      [cookiesKeys.TOKEN]: token.value
    },
    ...options,
  });

  const data = await response.json();
  return data;
}