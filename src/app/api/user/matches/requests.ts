import { fetchApi } from "@/utils/fetchApi";
import { ApiResponse } from "../../types";

export async function getUserMatches(username: string): Promise<ApiResponse<{}>> {
  const response = await fetchApi(`user/matches?username=${username}`, {
    method: 'GET',
  });

  const data = await response.json();
  return data;
}