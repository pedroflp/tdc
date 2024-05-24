import { Host, MatchItem, QueueMatch, Teams } from "@/flows/queue/types";
import { collections } from "@/services/constants";
import { firestore } from "@/services/firebase";
import { addDoc, collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { CreateMatchRequestDTO } from "./types";
import { match } from "assert";
import { HonorPlayersTimerMinutes } from "./honor/types";

export async function POST(request: Request) {
  const { teams, hoster, name, queueId, players }: CreateMatchRequestDTO = await request.json();

  if (!teams) return;

  const matchId = queueId;
  await setDoc(doc(firestore, collections.MATCHES, queueId), {
    teams,
    hoster,
    name,
    queueId,
    id: queueId,
    players,
    winner: null,
    matchIdInLoL: "",
    finished: false,
    createdAt: new Date().toISOString(),
  });

  const queueDocRef = doc(firestore, collections.QUEUES, queueId);
  await updateDoc(queueDocRef, { 
    match: {
      id: matchId,
      started: true
    }
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