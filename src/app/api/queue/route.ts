import { cookiesKeys } from "@/constants/cookies";
import { MatchModesEnum } from "@/flows/home/components/MatchOptionCard/types";
import { MatchTeamsEnum } from "@/flows/queue/types";
import { collections } from "@/services/constants";
import { firestore } from "@/services/firebase";
import { decodeJwt } from "@/utils/decodeJwt";
import { getUserFromToken } from "@/utils/getUsernameFromToken";
import { parseEmailToUsername } from "@/utils/parseUsername";
import { addDoc, collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const {name, mode}: { name: string, mode: MatchModesEnum } = await request.json();
  const token = cookies().get(cookiesKeys.TOKEN);

  if (!token) return NextResponse.error();

  try {
    const username = parseEmailToUsername(getUserFromToken(token.value, "email"));
    const userDoc = await getDoc(doc(firestore, collections.USERS, username));
    const userData = userDoc.data()!;

    const queue = await addDoc(collection(firestore, collections.QUEUES), {
      name,
      mode,
      active: true,
      hoster: {
        username: userData.username,
        name: userData.name,
        avatar: userData.avatar,
      },
      players: Array(10).fill({}),
      teams: {
        [MatchTeamsEnum.BLUE]: [],
        [MatchTeamsEnum.RED]: []
      },
      match: {
        id: null,
        started: false,
        finished: false,
        teamWinner: null
      },
      matchFinished: false,
      createdAt: new Date().toISOString(),
    });

    const queueId = queue.id;
    await updateDoc(queue, { id: queueId });

    return NextResponse.json({
      success: true,
      queueId,
    })
  } catch (error) {
    return NextResponse.error();
  }

}