import { fetchApi } from "@/utils/fetchApi";

export async function getMatches() {
    const response = await fetchApi("matches");
    const data  = await response.json();

    return data;
}