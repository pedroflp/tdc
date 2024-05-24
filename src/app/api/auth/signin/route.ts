import { cookiesKeys } from "@/constants/cookies";
import { collections } from "@/services/constants";
import { auth, firestore } from "@/services/firebase";
import { parseEmailToUsername, parseUsernameToEmail } from "@/utils/parseUsername";
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

    if (!response?.user?.email) return;

    const { token } = await response.user.getIdTokenResult();
    cookies().set(cookiesKeys.TOKEN, token);
    localStorage.setItem(cookiesKeys.TOKEN, token);

    return NextResponse.json({
      success: true,
      token,
      userId: response.user.uid
    })
  } catch (err) {
    const error = err as { code: SignInErrors };
    return NextResponse.json(
      { success: false, error: signInErrorsMessages[error.code] },
      { status: 400 }
    );
  }
}