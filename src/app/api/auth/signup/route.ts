import { NextRequest, NextResponse } from "next/server";
import { createUserWithEmailAndPassword, signInAnonymously, signInWithEmailAndPassword } from 'firebase/auth'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore'
import { auth, firestore } from "@/services/firebase";
import { cookies } from "next/headers";
import { cookiesKeys } from "@/constants/cookies";
import { collections } from "@/services/constants";
import { parseUsernameToEmail } from "@/utils/parseUsername";
import { SignUpErrors, signUpErrorsMessages } from "./types";

export async function POST(request: NextRequest) {
  try {
    const body: { username: string, password: string } = await request.json();
    const email = parseUsernameToEmail(body.username);
    
    const response = await createUserWithEmailAndPassword(auth, email, body.password);
    const { token } = await response.user.getIdTokenResult();
    cookies().set(cookiesKeys.TOKEN, token);

    const coll = collection(firestore, collections.USERS)
    await setDoc(doc(coll, body.username), {
      username: body.username,
      name: body.username,
      id: response.user.uid,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      token,
      userId: response.user.uid
    })
  } catch (err) {
    const error = err as { code: SignUpErrors };
    
    return NextResponse.json(
      { success: false, error: signUpErrorsMessages[error.code] },
      { status: 400 }
    );
  }
}