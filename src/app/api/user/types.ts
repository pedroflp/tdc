export type GetUserResponseDTO = IUserData | null;

export type IUserData = {
  name: string;
  avatar: string;
  id: string;
  createdAt: string;
  username: string;
}