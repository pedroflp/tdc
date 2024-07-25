import { fetchLOLApi } from "@/services/api/fetchLOLApi";

export async function getMatches() {
    const response = await fetchLOLApi("matches");
    const data  = await response.json();

    return data;
}