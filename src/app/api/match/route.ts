import { Host, Match, Teams } from "@/flows/queue/types";
import { collections } from "@/services/constants";
import { firestore } from "@/services/firebase";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { teams, hoster, name, queueId }: {
    name: string, hoster: Host, teams: Teams, queueId: string
  } = await request.json();

  if (!teams) return;

  const match = await addDoc(collection(firestore, collections.MATCHES), {
    teams,
    hoster,
    name,
    queueId,
    winner: null,
    matchIdInLoL: "",
    finished: false,
    createdAt: new Date().toISOString(),
  });

  const matchId = match.id;
  await updateDoc(match, { id: matchId });

  return NextResponse.json({
    success: true,
    matchId,
  })
}

export async function PUT(request: Request) {
  const { matchId, body }: {
    matchId: string, body: Match
  } = await request.json();

  const matchDoc = await getDoc(doc(firestore, collections.MATCHES, matchId))

  if (!matchDoc.exists()) return NextResponse.error();

  const matchData = matchDoc.data();

  await updateDoc(doc(firestore, collections.MATCHES, matchId), {
    ...matchData,
    ...body
  });

  return NextResponse.json({
    success: true,
    matchId,
  })
}