import { cookiesKeys } from "@/constants/cookies";
import { auth } from "@/services/firebase";
import { signOut } from "firebase/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  cookies().delete(cookiesKeys.TOKEN);
  cookies().delete(cookiesKeys.REFRESH_TOKEN);
  
  return NextResponse.json({success: true});
}
