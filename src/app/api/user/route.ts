import { cookiesKeys } from "@/constants/cookies";
import { collections } from "@/services/constants";
import discordAuth from "@/services/discord";
import { firestore } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { signOut } from "../auth/signout/requests";
import { getUserDataByToken } from "./requests";
import { getUserFromToken } from "@/utils/getUsernameFromToken";
import { parseEmailToUsername } from "@/utils/parseUsername";

export async function GET(request: Request) {
  const token = request.headers.get(cookiesKeys.TOKEN);
  if (!token) return NextResponse.json({ error: true }, { status: 400 });

 const { username } = await discordAuth.getUser(token);

  try {
    const userDoc = await getDoc(doc(firestore, collections.USERS, username));

    if (!userDoc.exists()) { 
      await signOut();
      return NextResponse.json(null);
    };
    
    const userData = userDoc.data();
    return NextResponse.json(userData);
  } catch (error) {
    return NextResponse.error();
  }
}