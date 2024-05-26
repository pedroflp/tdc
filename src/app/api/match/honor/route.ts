import { MatchItem } from "@/flows/queue/types";
import { collections } from "@/services/constants";
import { firestore } from "@/services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { HonorPlayerDTO, HonorPlayersRequestDTO, HonorPlayersTimerMinutes } from "./types";
import { UserDTO } from "../../user/types";
import { calculateMatchPontuation } from "./utils";
import { CloudCog } from "lucide-react";

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
    players: match.players.map((player) => honoredBy === player.username ? ({...player, alreadyHonored: true}) : player)
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
    if (!matchDoc.exists()) return;

    const match = matchDoc.data() as MatchItem;
    const honors = match.honors!;
    const mvp = honors.mvp;
    const hostage = honors.hostage;
    const bricklayer = honors.bricklayer;

    const [mvpPlayer, hostagePlayer, bricklayerPlayer] = [mvp, hostage, bricklayer].reduce((acc, honor) => {
      const honoredPlayer = honor.length > 0 
        ? honor.sort((playerA, playerB) => playerA.votes.length - playerB.votes.length)[0]
        : undefined;
      acc.push(honoredPlayer);
      return acc;
    }, [] as Array<HonorPlayerDTO | undefined>)

    await updateDoc(doc(firestore, collections.MATCHES, matchId), {
      mvp: mvpPlayer,
      hostage: hostagePlayer,
      bricklayer: bricklayerPlayer
    });

    match.players.map(async player => {
      const userDocRef = doc(firestore, collections.USERS, player.username);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) return player;

      const userData = userDoc.data() as UserDTO;
      const isUserWinnerOfMatch = match.teams[match.winner].some(player => userData.username === player.username);
  
      const points = calculateMatchPontuation(!!isUserWinnerOfMatch, {
        mvp: mvpPlayer?.username === player.username, 
        bricklayer: bricklayerPlayer?.username === player.username, 
        hostage: hostagePlayer?.username === player.username
      });

      await updateDoc(userDocRef, {
        activeMatch: "",
        statistics: {
          points,
          played: userData?.statistics?.played + 1,
          mvps: mvpPlayer?.username === player.username ? userData?.statistics?.mvps + 1 : userData?.statistics?.mvps,
          bricklayer: bricklayerPlayer?.username === player.username ? userData?.statistics?.bricklayer + 1 : userData?.statistics?.bricklayer,
          hostage: hostagePlayer?.username === player.username ? userData?.statistics?.hostage + 1 : userData?.statistics?.hostage,
          won: isUserWinnerOfMatch ?  userData?.statistics?.won + 1 :  userData?.statistics?.won,
        }
      } as UserDTO);
    });

    return NextResponse.json({ success: true, message: 'Honras foram distribuídas para os jogadores com mais votos' });
  }
  
  const timeout = setTimeout(() => {
    distributeHonors();
    return () => clearTimeout(timeout);
  }, HonorPlayersTimerMinutes * 60 * 1000);

  return NextResponse.json({ success: true })
}