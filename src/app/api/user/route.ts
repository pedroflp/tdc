import { cookiesKeys } from "@/constants/cookies";
import { collections } from "@/services/constants";
import { firestore } from "@/services/firebase";
import { getUserFromToken } from "@/utils/getUsernameFromToken";
import { parseEmailToUsername } from "@/utils/parseUsername";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const token = request.headers.get(cookiesKeys.TOKEN)!;

  try {
    const username = parseEmailToUsername(getUserFromToken(token, "email"));
    const userDoc = await getDoc(doc(firestore, collections.USERS, username));

    if (!userDoc.exists()) return NextResponse.json(null);

    const userData = userDoc.data();
    return NextResponse.json(userData);
  } catch (error) {
    return NextResponse.json({ }, { status: 400 });
  }
}