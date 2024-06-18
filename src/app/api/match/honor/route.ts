import { MatchItem } from "@/flows/queue/types";
import { collections } from "@/services/constants";
import { firestore } from "@/services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { UserDTO } from "../../user/types";
import { deleteQueue } from "./requests";
import { HonorPlayerDTO, HonorPlayersRequestDTO } from "./types";
import { calculateMatchPontuation } from "./utils";

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
  });

  await updateDoc(doc(firestore, collections.USERS, honoredBy), {
    activeMatch: ""
  });

  return NextResponse.json({
    success: true,
  })
}

export async function PUT(request: Request) { 
  const { matchId }: { matchId: string } = await request.json();
  const matchDoc = await getDoc(doc(firestore, collections.MATCHES, matchId));
  const match = matchDoc.data() as MatchItem;
  const honors = match.honors!;
  const mvp = honors.mvp;
  const hostage = honors.hostage;
  const bricklayer = honors.bricklayer;

  const [mvpPlayer, hostagePlayer, bricklayerPlayer] = [mvp, hostage, bricklayer].reduce((acc, honor) => {
    const honoredPlayer = honor.length > 0 
      ? honor.sort((playerA, playerB) => playerA.votes.length - playerB.votes.length)[0]
      : null;
    acc.push(honoredPlayer);
    return acc;
  }, [] as Array<HonorPlayerDTO | null>)

  await updateDoc(doc(firestore, collections.MATCHES, matchId), {
    mvp: mvpPlayer,
    hostage: hostagePlayer,
    bricklayer: bricklayerPlayer,
    honors: { ...match.honors, finished: true }
  });

  async function distributeStatistics(username: string) {
    if (!username) return;

    const userDocRef = doc(firestore, collections.USERS, username);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.data() as UserDTO;
    const isUserWinnerOfMatch = match.teams[match.winner].some(player => userData.username === username);

    const points = calculateMatchPontuation(!!isUserWinnerOfMatch, {
      mvp: mvpPlayer?.username === username, 
      bricklayer: bricklayerPlayer?.username === username, 
      hostage: hostagePlayer?.username === username
    });

    const statistics = {
      points,
      played: userData?.statistics?.played + 1,
      mvps: mvpPlayer?.username === username ? userData?.statistics?.mvps + 1 : userData?.statistics?.mvps,
      bricklayer: bricklayerPlayer?.username === username ? userData?.statistics?.bricklayer + 1 : userData?.statistics?.bricklayer,
      hostage: hostagePlayer?.username === username ? userData?.statistics?.hostage + 1 : userData?.statistics?.hostage,
      won: isUserWinnerOfMatch ?  userData?.statistics?.won + 1 :  userData?.statistics?.won,
    }

    await updateDoc(userDocRef, { statistics } as UserDTO);
  }

  await deleteQueue({ matchId });
  await Promise.all([match.players.map(user => distributeStatistics(user.username))]);

  return NextResponse.json({ success: true, message: 'Honras foram distribuídas para os jogadores com mais votos' });
}