import { cookiesKeys } from "@/constants/cookies";
import { collections } from "@/services/constants";
import { auth, firestore } from "@/services/firebase";
import { parseUsernameToEmail } from "@/utils/parseUsername";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { SignInErrors, signInErrorsMessages } from "./types";

export async function POST(request: NextRequest) {
  try {
    const body: { username: string, password: string } = await request.json();
    const email = parseUsernameToEmail(body.username);
    
    const response = await signInWithEmailAndPassword(auth, email, body.password);
    const { token } = await response.user.getIdTokenResult();

    cookies().set(cookiesKeys.TOKEN, token);

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
  } catch (err) {
    const error = err as { code: SignInErrors };
    console.log(error.code)
    return NextResponse.json(
      { success: false, error: signInErrorsMessages[error.code] },
      { status: 400 }
    );
  }
}