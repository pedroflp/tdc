import { MatchItem, QueueItem } from "@/flows/queue/types";
import { collections } from "@/services/constants";
import { firestore } from "@/services/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { HonorPlayersTimerMinutes } from "./honor/types";
import { CreateMatchRequestDTO } from "./types";

export async function POST(request: Request) {
  const { teams, hoster, name, queueId, players }: CreateMatchRequestDTO = await request.json();

  if (!teams) return;

  const matchId = queueId;
  const queueDocRef = doc(firestore, collections.QUEUES, queueId);
  const queueData = (await getDoc(queueDocRef)).data()! as QueueItem;
  updateDoc(queueDocRef, { 
    match: {
      id: matchId,
      started: true
    }
  });


  await setDoc(doc(firestore, collections.MATCHES, queueId), {
    teams,
    hoster,
    name,
    queueId,
    id: queueId,
    mode: queueData.mode,
    players,
    winner: null,
    finished: false,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({
    success: true,
    matchId,
  })
}

export async function PUT(request: Request) {
  const { matchId, winner }: {
    matchId: string, winner: MatchItem["winner"]
  } = await request.json();

  try {
    const matchDoc = await getDoc(doc(firestore, collections.MATCHES, matchId))
  if (!matchDoc.exists()) return NextResponse.error();
  const matchData = matchDoc.data() as MatchItem;

  await updateDoc(doc(firestore, collections.MATCHES, matchId), {
    ...matchData,
    mvp: {},
    hostage: {},
    bricklayer: {},
    winner,
    honors: {
      endDate: new Date(
        new Date().setMinutes(new Date().getMinutes() + HonorPlayersTimerMinutes)
      ).toISOString(),
      mvp: [],
      hostage: [],
      bricklayer: [],
      finished: false
    },
    finished: true
  });

  return NextResponse.json({
    success: true,
    matchId,
  })
  } catch (error) {
    return NextResponse.error();
  }
}