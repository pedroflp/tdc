import { decodeJwt } from "./decodeJwt";

export function getUserFromToken(token: string, info?: "user_id" | "email") {
  if (!token) return null;
  
  const user = decodeJwt(token);

  if (!info) return user;

  return user[info];
}