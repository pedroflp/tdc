import { cookiesKeys } from "@/constants/cookies";
import { collections } from "@/services/constants";
import { firestore } from "@/services/firebase";
import { getUserFromToken } from "@/utils/getUsernameFromToken";
import { parseEmailToUsername } from "@/utils/parseUsername";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { username: string } }) {
  const username = params.username;

  if (!username) return NextResponse.json({ error: true }, { status: 400 });

  try {
    const userDoc = await getDoc(doc(firestore, collections.USERS, username));
    if (!userDoc.exists()) return NextResponse.json(null);

    const userData = userDoc.data();
    return NextResponse.json(userData);
  } catch (error) {
    return NextResponse.error();
  }
}