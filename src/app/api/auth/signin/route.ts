import { cookiesKeys } from "@/constants/cookies";
import { collections } from "@/services/constants";
import discordAuth from "@/services/discord";
import { firestore } from "@/services/firebase";
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where,  } from "firebase/firestore";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { signUp } from "../signup/requests";
import { UserDTO } from "../../user/types";
import { signOut } from "../signout/requests";

export async function POST(request: NextRequest) {
  const { accessToken, expires, refreshToken } = await request.json();

  const isInvalidToken = accessToken.split("").includes(".");
  if (isInvalidToken) {
    await signOut();
    return NextResponse.json({ success: false, message: "Token inválido!" });
  }

  const { id, avatar, username: discordUsername, email } = await discordAuth.getUser(accessToken);

  const queryIfUserIdAlreadyExistsInOtherUsername = query(collection(firestore, collections.USERS), where("id", "==", id));
  const queryUser = (await getDocs(queryIfUserIdAlreadyExistsInOtherUsername)).docs[0];
  
  if (queryUser) {
    const queryUserData = queryUser.data() as UserDTO;

    if (queryUserData.username !== discordUsername) {
      await setDoc(doc(firestore, collections.USERS, discordUsername), {
        ...queryUserData,
        username: discordUsername
      })
  
      await deleteDoc(doc(firestore, collections.USERS, queryUserData.username));
    }
  } else {
    await signUp({ avatar, email, id, username: discordUsername });
  }

  cookies().set(cookiesKeys.TOKEN, accessToken, { expires: new Date().setSeconds(expires) });
  cookies().set(cookiesKeys.REFRESH_TOKEN, refreshToken);
  
  return NextResponse.json({ success: true });
}
