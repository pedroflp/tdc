import { cookiesKeys } from "@/constants/cookies";
import { MatchTeamsEnum, QueueItem, Team } from "@/flows/queue/types";
import { collections } from "@/services/constants";
import { firestore } from "@/services/firebase";
import { getUserFromToken } from "@/utils/getUsernameFromToken";
import { parseEmailToUsername } from "@/utils/parseUsername";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { UserDTO } from "../../user/types";

export async function POST(request: NextRequest) {
  const { queueId, compositions }: {
    queueId: string,
    compositions: Array<{
      [MatchTeamsEnum.BLUE]: Team;
      [MatchTeamsEnum.RED]: Team;
    }>
  } = await request.json();

  if (!queueId || !compositions) return NextResponse.error();

  try {
    const queueDocRef = doc(firestore, collections.QUEUES, queueId)
    const queueDoc = await getDoc(queueDocRef);

    if (!queueDoc.exists) return NextResponse.error();

    const queueData = queueDoc.data();

    setDoc(queueDocRef, {
      ...queueData,
      compositions: compositions.map((composition, index) => ({
        ...composition,
        votes: [],
        id: `${queueDoc.id}-composition-${index}`
      }))
    })

    return NextResponse.json({
      success: true,
      // queueId,
    })
  } catch (error) {
    return NextResponse.error();
  }

}
export async function PUT(request: NextRequest) {
  const { queueId, compositionId, user }: {
    queueId: string,
    compositionId: string,
    user: UserDTO,
  } = await request.json();
  if (!queueId) return NextResponse.error();


  try {
    const queueDocRef = doc(firestore, collections.QUEUES, queueId)
    const queueDoc = await getDoc(queueDocRef);

    if (!queueDoc.exists) return NextResponse.error();
    const queueData = queueDoc.data() as QueueItem;

    const compositions = queueData.compositions?.map(composition => {
      if (composition.id === compositionId) {
        return {
          ...composition,
          votes: [...composition.votes, user]
        }
      }

      if (composition.votes.find(vote => vote.username === user.username)) {
        return {
          ...composition,
          votes: composition.votes.filter(vote => vote.username !== user.username)
        }
      }

      return composition
    })

    setDoc(queueDocRef, {
      ...queueData,
      compositions
    })

    return NextResponse.json({
      success: true,
      // queueId,
    })
  } catch (error) {
    return NextResponse.error();
  }

}