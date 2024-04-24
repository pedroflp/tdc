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

    cookies().set(cookiesKeys.TOKEN, response.user.uid)

    const col = collection(firestore, collections.USERS)
    await setDoc(doc(col, response.user.uid), {
      name: body.username,
      uid: response.user.uid,
      createdAt: new Date().toISOString(),
      score: 0,
    })

    return NextResponse.json({
      success: true,
      token: token,
    })
  } catch (error) {
    return NextResponse.json({
      error: true
    })
  }
}