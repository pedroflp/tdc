import { NextRequest, NextResponse } from "next/server";
import { signInAnonymously } from 'firebase/auth'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore'
import { auth, firestore } from "@/services/firebase";
import { cookies } from "next/headers";
import { cookiesKeys } from "@/constants/cookies";
import { collections } from "@/services/constants";

export async function POST(request: NextRequest) {
  try {
    const body: { username: string } = await request.json();
    const response = await signInAnonymously(auth);
    const { token } = await response.user.getIdTokenResult();

    cookies().set(cookiesKeys.TOKEN, token);
    cookies().set(cookiesKeys.CONNECTED_AS, response.user.uid);

    const col = collection(firestore, collections.USERS)
    await setDoc(doc(col, response.user.uid), {
      name: body.username ?? "",
      id: response.user.uid,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      token,
      userId: response.user.uid
    })
  } catch (error) {
    return NextResponse.json({
      error: true
    })
  }
}