import { cookiesKeys } from "@/constants/cookies";
import { collections } from "@/services/constants";
import discordAuth from "@/services/discord";
import { firestore } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { signUp } from "../signup/requests";

export async function POST(request: NextRequest) {
  const { accessToken, expires, refreshToken } = await request.json();

  const { id, avatar, username: discordUsername, email } = await discordAuth.getUser(accessToken);
  const user = await getDoc(doc(firestore, collections.USERS, discordUsername));

  if (!user.exists()) {
    await signUp({ avatar, email, id, username: discordUsername });
  }

  cookies().set(cookiesKeys.TOKEN, accessToken, { expires: new Date().setSeconds(expires) });
  cookies().set(cookiesKeys.REFRESH_TOKEN, refreshToken);
  
  return NextResponse.json({ success: true });
}
