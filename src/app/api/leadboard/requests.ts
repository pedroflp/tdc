import { fetchApi } from "@/utils/fetchApi";
import { UserDTO } from "../user/types";
import { ApiResponse } from "../types";

export async function getLeadBoard(): Promise<ApiResponse<{ data: UserDTO[] }>> {
	const response = await fetchApi("leadboard");
	const data  = await response.json();

	return data;
}