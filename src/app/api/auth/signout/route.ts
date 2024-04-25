import { cookiesKeys } from "@/constants/cookies";
import { auth } from "@/services/firebase";
import { signOut } from "firebase/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  await signOut(auth);
  cookies().delete(cookiesKeys.TOKEN);
  
  return NextResponse.json({success: true});
}
