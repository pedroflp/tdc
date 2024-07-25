import { fetchLOLApi } from "@/services/api/fetchLOLApi";
import { ApiResponse } from "../../types";

export async function getUserMatches(username: string): Promise<ApiResponse<{}>> {
  const response = await fetchLOLApi(`user/matches?username=${username}`, {
    method: 'GET',
  });

  const data = await response.json();
  return data;
}