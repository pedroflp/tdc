import { fetchApi } from "@/services/api/fetchApi";

export async function signOut() {
  const response = await fetchApi('auth/signout', {
    method: 'POST',
  });

  const data = await response.json();
  return data;
}