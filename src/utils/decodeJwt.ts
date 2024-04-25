import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export function decodeJwt(token: RequestCookie | string) {
  if (!token) return;

  const parsedToken = String(token)
  
  return JSON.parse(Buffer.from(parsedToken.split('.')[1], 'base64').toString());
}