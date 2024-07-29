import { cookiesKeys } from "@/constants/cookies";
import { fetchApi } from "@/services/api/fetchApi";
import { cookies } from "next/headers";
import { UserDTO } from "./types";
import { signOut } from "../auth/signout/requests";

export async function getUserDataByToken(): Promise<UserDTO | null> {
  const token = cookies().get(cookiesKeys.TOKEN);
  if (!token) return null;

  const isInvalidToken = token.value.split("").includes(".");
  
  if (isInvalidToken) {
    return await signOut();
  }

  const response = await fetchApi('user', {
    method: 'GET',
    headers: {
      [cookiesKeys.TOKEN]: token.value
    },
  });

  const data = await response.json();
  return data;
}