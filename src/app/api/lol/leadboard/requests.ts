import { fetchLOLApi } from "@/services/api/fetchLOLApi";
import { ApiResponse } from "../../types";
import { UserDTO } from "../../user/types";

export async function getLeadBoard(): Promise<ApiResponse<{ data: UserDTO[] }>> {
	const response = await fetchLOLApi("leadboard");
	const data = await response.json();

	return data;
}