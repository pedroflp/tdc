import { Host, MatchItem, QueueMatch, Teams } from "@/flows/queue/types";
import { collections } from "@/services/constants";
import { firestore } from "@/services/firebase";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { HonorPlayersRequestDTO, HonorPlayersTimer } from "./types";

export async function POST(request: Request) {
  const { honors, matchId, honoredBy }: HonorPlayersRequestDTO = await request.json();

  if (!honors || !matchId || !honoredBy) return NextResponse.error();

  const matchDoc = await getDoc(doc(firestore, collections.MATCHES, matchId));
  const match = matchDoc.data() as MatchItem;
  
  const voting = match.voting!;
  const honorList = Object.entries(honors);

  const matchHonors = honorList.reduce((acc, [honor, playerUsername]) => {
    if (!playerUsername) return acc; 

    type Honor = 'mvp' | 'hostage' | 'bricklayer';

    const honors = voting[honor as Honor] ?? [];
    const honoredPlayer = honors?.length > 0 && honors.find((player) => player.username === playerUsername);
    
    const newVoting = voting;

    if (honoredPlayer) {
      newVoting[honor as Honor] = honors.map((player) => {
        if (player.username === playerUsername) {
          return {
            ...player,
            votes: [
              ...player.votes,
              honoredBy
            ]
          }
        }
        return player
      })
    } else {
      newVoting[honor as Honor] = [
        ...newVoting[honor as Honor],
         {
          username: playerUsername,
          votes: [honoredBy]
        }
      ];
    }


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

export async function PUT(request: Request) { 
  const { matchId }: { matchId: string } = await request.json();

  if (!matchId) return NextResponse.error();

  async function distributeHonors() {
    const matchDoc = await getDoc(doc(firestore, collections.MATCHES, matchId));
    const match = matchDoc.data() as MatchItem;
    const voting = match.voting!;
    const mvp = voting.mvp;
    const hostage = voting.hostage;
    const bricklayer = voting.bricklayer;

    const mvpPlayer = mvp.sort((a, b) => b.votes.length - a.votes.length)[0];
    const hostagePlayer = hostage.sort((a, b) => b.votes.length - a.votes.length)[0];
    const bricklayerPlayer = bricklayer.sort((a, b) => b.votes.length - a.votes.length)[0];
    
    await updateDoc(doc(firestore, collections.MATCHES, matchId), {
      mvp: mvpPlayer ?? null,
      hostage: hostagePlayer ?? null,
      bricklayer: bricklayerPlayer ?? null
    });

    return NextResponse.json({ success: true, message: 'Honras foram distribuídas para os jogadores com mais votos' });
  }
  
  const timeout = setTimeout(() => {
    distributeHonors();
    return () => clearTimeout(timeout);
  }, HonorPlayersTimer);

  return NextResponse.json({ success: true })
}