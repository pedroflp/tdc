import { NextRequest, NextResponse } from "next/server";
import { createUserWithEmailAndPassword, signInAnonymously, signInWithEmailAndPassword } from 'firebase/auth'
import { addDoc, collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, firestore } from "@/services/firebase";
import { cookies } from "next/headers";
import { cookiesKeys } from "@/constants/cookies";
import { collections } from "@/services/constants";
import { parseUsernameToEmail } from "@/utils/parseUsername";
import { SignUpErrors, signUpErrorsMessages } from "./types";

export async function POST(request: NextRequest) {
  try {
    const body: { username: string, password: string } = await request.json();
    
    const usernameHasValidChars = RegExp(/^([a-z]+)$/).test(body.username);
    if (!usernameHasValidChars) {
      return NextResponse.json({
        success: false,
        error: "O Username deve conter apenas letras minúsculas (sem espaços, números ou caracteres especiais)"
      }, { status: 400 })
    }

    const email = parseUsernameToEmail(body.username);
    
    const response = await createUserWithEmailAndPassword(auth, email, body.password);
    const { token } = await response.user.getIdTokenResult();
    cookies().set(cookiesKeys.TOKEN, token, {
      expires: new Date().setDate(new Date().getDate() + 24), // 24 days
    });

    const coll = collection(firestore, collections.USERS)
    const user = await getDoc(doc(coll, body.username));

    if (user.exists()) {
      updateDoc(doc(coll, body.username), {
        id: response.user.uid
      });
    } else {
      await setDoc(doc(coll, body.username), {
        username: String(body.username).toLocaleLowerCase(),
        name: body.username,
        id: response.user.uid,
        createdAt: new Date().toISOString(),
        avatar: "",
        statistics: {
          won: 0,
          played: 0,
          mvps: 0,
          bricklayer: 0,
          hostage: 0,
          points: 0
        }
      });
    }

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