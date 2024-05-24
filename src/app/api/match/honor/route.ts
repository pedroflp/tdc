import { MatchItem } from "@/flows/queue/types";
import { collections } from "@/services/constants";
import { firestore } from "@/services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { HonorPlayersRequestDTO, HonorPlayersTimerMinutes } from "./types";

export async function POST(request: Request) {
  const { honors, matchId, honoredBy }: HonorPlayersRequestDTO = await request.json();

  if (!honors || !matchId || !honoredBy) return NextResponse.error();

  const matchDoc = await getDoc(doc(firestore, collections.MATCHES, matchId));
  const match = matchDoc.data() as MatchItem;
  const honorList = Object.entries(honors);
  const voting = match.honors!;

  const matchHonors = honorList.reduce((acc, [honor, playerUsername]) => {
    type Honor = 'mvp' | 'hostage' | 'bricklayer';
    if (!playerUsername) return acc; 

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
    honors: matchHonors,
    players: match.players.map((player) => ({...player, alreadyHonored: true}))
  })

  match.players.forEach(async (player) => {
    await updateDoc(doc(firestore, collections.USERS, player.username), {
      activeMatch: "",
    })
  });

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

    const honors = match.honors!;
    const mvp = honors.mvp;
    const hostage = honors.hostage;
    const bricklayer = honors.bricklayer;

    const mvpPlayer = mvp?.length > 0 && mvp.reduce((acc, player) => player.votes.length > acc.votes.length ? player : acc);
    const hostagePlayer = hostage?.length > 0 && hostage.reduce((acc, player) => player.votes.length > acc.votes.length ? player : acc);
    const bricklayerPlayer = bricklayer?.length > 0 && bricklayer.reduce((acc, player) => player.votes.length > acc.votes.length ? player : acc);
    
    await updateDoc(doc(firestore, collections.MATCHES, matchId), {
      mvp: mvpPlayer,
      hostage: hostagePlayer,
      bricklayer: bricklayerPlayer
    });

    return NextResponse.json({ success: true, message: 'Honras foram distribuídas para os jogadores com mais votos' });
  }
  
  const timeout = setTimeout(() => {
    distributeHonors();
    return () => clearTimeout(timeout);
  }, HonorPlayersTimerMinutes * 60 * 1000);

  return NextResponse.json({ success: true })
}