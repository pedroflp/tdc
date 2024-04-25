import { cookiesKeys } from "@/constants/cookies";
import { collections } from "@/services/constants";
import { firestore } from "@/services/firebase";
import { decodeJwt } from "@/utils/decodeJwt";
import { getUserFromToken } from "@/utils/getUsernameFromToken";
import { parseEmailToUsername } from "@/utils/parseUsername";
import { getDoc, doc } from "firebase/firestore";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const token = request.headers.get(cookiesKeys.TOKEN)!;

  try {
    const username = parseEmailToUsername(getUserFromToken(token, "email"));
    const userDoc = await getDoc(doc(firestore, collections.USERS, username));
    const userData = userDoc.data();

    return NextResponse.json(userData);
  } catch (error) {
    return NextResponse.error().status;
  }
}