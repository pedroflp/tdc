import { cookiesKeys } from "@/constants/cookies";
import { MatchTeamsEnum } from "@/flows/queue/types";
import { collections } from "@/services/constants";
import { firestore } from "@/services/firebase";
import { addDoc, collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const {name}: { name: string, password: string } = await request.json();
  const userId = cookies().get(cookiesKeys.CONNECTED_AS)?.value;

  const userDoc = await getDoc(doc(firestore, collections.USERS, userId!))
  const userData = userDoc.data()!;

  try {
    const queue = await addDoc(collection(firestore, collections.QUEUES), {
      name,
      active: true,
      hoster: {
        id: userDoc.id,
        name: userData.name,
        avatar: userData.avatar ?? "",
      },
      players: [],
      teams: {
        [MatchTeamsEnum.BLUE]: {},
        [MatchTeamsEnum.RED]: {}
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
    console.log(error)
    return NextResponse.json({
      error: true,
    })
  }

}