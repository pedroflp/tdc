import { MatchTeamsEnum, QueueItem } from "@/flows/lol/queue/types";
import { collections } from "@/services/constants";
import { firestore } from "@/services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { UserDTO } from "../../../user/types";
import { handleRandomizeTeam } from "./utils";
import { MatchModesEnum } from "@/flows/lol/queues/components/MatchOptionCard/types";

export async function POST(request: NextRequest) {
  const { queueId }: {queueId: string} = await request.json();
  if (!queueId) return NextResponse.error();

  try {
    const queueDocRef = doc(firestore, collections.QUEUES, queueId)
    const queueDoc = await getDoc(queueDocRef);

    if (!queueDoc.exists) return NextResponse.error();

    const queueData = queueDoc.data() as QueueItem;
    const compositionsQuantityByMode = {
      [MatchModesEnum.CLASSIC]: 4,
      [MatchModesEnum.HARDCORE]: 2
    }
    const QUEUE_COMPOSITIONS_QUANTITY = compositionsQuantityByMode[queueData.mode];

    const compositions = new Array(QUEUE_COMPOSITIONS_QUANTITY).fill(null).map(() => handleRandomizeTeam(queueData.players));

    updateDoc(queueDocRef, {
      compositions: compositions.map((composition, index) => ({
        ...composition,
        id: `${queueDoc.id}-composition-${index}`,
        votes: [],
      }))
    });

    queueData.players.map(async player => {
      if (!player.username) return;
      const playerDocRef = doc(firestore, collections.USERS, player.username)
      if (!playerDocRef) return;
      
      await updateDoc(playerDocRef, {
        activeMatch: queueData.id
      })
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.log(error)
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
  const QUEUE_COMPOSITION_MINIMUM_VOTES_QUANTITY = 1;

  try {
    const queueDocRef = doc(firestore, collections.QUEUES, queueId)
    const queueDoc = await getDoc(queueDocRef);

    if (!queueDoc.exists) return NextResponse.error();
    const queueData = queueDoc.data() as QueueItem;

    const compositions = queueData.compositions?.map(composition => {
      if (composition.id === compositionId) {
        if (composition.votes.some(vote => vote.username === user.username)) {
          return composition;  
        };

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

    const compositionSelectedToBeTeam = compositions?.find(composition => composition.votes.length >= QUEUE_COMPOSITION_MINIMUM_VOTES_QUANTITY);
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
    })
  } catch (error) {
    return NextResponse.error();
  }

}