import { cookiesKeys } from "@/constants/cookies";
import { MatchTeamsEnum, QueueItem, Teams } from "@/flows/queue/types";
import { collections } from "@/services/constants";
import { firestore } from "@/services/firebase";
import { getUserFromToken } from "@/utils/getUsernameFromToken";
import { parseEmailToUsername } from "@/utils/parseUsername";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { UserDTO } from "../../user/types";

export async function POST(request: NextRequest) {
  const { queueId, compositions }: {
    queueId: string,
    compositions: Array<Teams>
  } = await request.json();

  if (!queueId || !compositions) return NextResponse.error();

  try {
    const queueDocRef = doc(firestore, collections.QUEUES, queueId)
    const queueDoc = await getDoc(queueDocRef);
    if (!queueDoc.exists) return NextResponse.error();

    updateDoc(queueDocRef, {
      compositions: compositions.map((composition, index) => ({
        ...composition,
        votes: [],
        id: `${queueDoc.id}-composition-${index}`
      }))
    })

    return NextResponse.json({
      success: true,
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
          votes: [...composition.votes, {
            username: user.username,
            avatar: user.avatar,
            name: user.name
          }]
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

    updateDoc(queueDocRef, {compositions})

    const compositionSelectedToBeTeam = compositions?.find(composition => composition.votes.length >= 6);
    if (!!compositionSelectedToBeTeam) { 
      updateDoc(queueDocRef, {
        compositions,
        readyToStartMatch: true,
        teams: {
          [MatchTeamsEnum.BLUE]: compositionSelectedToBeTeam[MatchTeamsEnum.BLUE],
          [MatchTeamsEnum.RED]: compositionSelectedToBeTeam[MatchTeamsEnum.RED],
        }
      })
    } else {
      updateDoc(queueDocRef, {
        compositions,
        readyToStartMatch: false,
      })
    }

    return NextResponse.json({
      success: true,
      // queueId,
    })
  } catch (error) {
    return NextResponse.error();
  }

}