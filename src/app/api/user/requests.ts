import { cookiesKeys } from "@/constants/cookies";
import { fetchApi } from "@/utils/fetchApi";
import { cookies } from "next/headers";
import { ApiResponse } from "../types";
import { GetUserResponseDTO } from "./types";

export async function getUserData(): Promise<ApiResponse<GetUserResponseDTO> | null> {
  const token = cookies().get(cookiesKeys.TOKEN);

  if (!token) return null;

  const response = await fetchApi('user', {
    method: 'GET',
    headers: {
      [cookiesKeys.TOKEN]: token?.value!
    }
  });

  const data = await response.json();
  return data;
}