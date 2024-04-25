import { fetchApi } from "@/utils/fetchApi";

export async function signOut() {
  try {
    const response = await fetchApi('auth/signout', {
      method: 'POST',
    });

    const data = await response.json();
    return data;
  } catch (error) {
    
  }
}