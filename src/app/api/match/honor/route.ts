import { Host, MatchItem, QueueMatch, Teams } from "@/flows/queue/types";
import { collections } from "@/services/constants";
import { firestore } from "@/services/firebase";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { HonorPlayersRequestDTO } from "./types";

export async function POST(request: Request) {
  const { honors, matchId, honoredBy }: HonorPlayersRequestDTO = await request.json();

  if (!honors || !matchId || !honoredBy) return NextResponse.error();

  const matchDoc = await getDoc(doc(firestore, collections.MATCHES, matchId));
  const match = matchDoc.data() as MatchItem;
  
  const voting = match.voting!;
  const honorList = Object.entries(honors);

  const matchHonors = honorList.reduce((acc, [honor, playerUsername]) => {
    if (!playerUsername) return acc; 

    const honors = voting[honor as 'mvp' | 'hostage' | 'bricklayer'] ?? [];
    const honoredPlayer = honors?.length > 0 && honors.find((player) => player.username === playerUsername);
    
    const newVoting = voting;
    newVoting[honor as 'mvp' | 'hostage' | 'bricklayer'] = [
      ...newVoting[honor as 'mvp' | 'hostage' | 'bricklayer'],
      honoredPlayer ? {
        ...honoredPlayer,
        votes: [
          ...honoredPlayer.votes,
          honoredBy
        ]
      } : {
        username: playerUsername,
        votes: [honoredBy]
      }
    ];

    acc = newVoting;
    return acc;
  }, voting);
  
  await updateDoc(doc(firestore, collections.MATCHES, matchId), {
    voting: matchHonors
  })

  return NextResponse.json({
    success: true,
  })
}