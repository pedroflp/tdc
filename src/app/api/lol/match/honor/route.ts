import { MatchItem } from "@/flows/lol/queue/types";
import { collections } from "@/services/constants";
import { firestore } from "@/services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { UserDTO } from "../../../user/types";
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
  const { bricklayer, mvp, hostage } = honors;

  const [mvpPlayer, hostagePlayer, bricklayerPlayer] = [mvp, hostage, bricklayer].reduce((acc, honor) => {
    const mostHonoredUser = honor.length > 0
      ? honor.sort((playerA, playerB) => playerB.votes.length - playerA.votes.length)[0]
      : null;

    if (mostHonoredUser) {
      const { username, votes } = mostHonoredUser!;
      const { avatar, name } = match.players.find(player => player.username === username)!;

      acc.push({
        player: {
          username,
          avatar,
          name
        },
        votes
      });
    }
    else acc.push(null);

    return acc;
  }, [] as Array<HonorPlayerDTO | null>);

  const data = {
    mvp: mvpPlayer,
    hostage: hostagePlayer,
    bricklayer: bricklayerPlayer,
    honors: { ...match.honors, finished: true }
  };

  await updateDoc(doc(firestore, collections.MATCHES, matchId), data);

  async function distributeStatistics(username: string) {
    if (!username) return;

    const userDocRef = doc(firestore, collections.USERS, username);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.data() as UserDTO;
    const isUserWinnerOfMatch = match.teams[match.winner].some(player => username === player.username);

    const points = calculateMatchPontuation(!!isUserWinnerOfMatch, {
      mvp: mvpPlayer?.player.username === username, 
      bricklayer: bricklayerPlayer?.player.username === username, 
      hostage: hostagePlayer?.player.username === username
    });

    const statistics = {
      points: userData.statistics.points + points,
      played: userData?.statistics?.played + 1,
      mvps: mvpPlayer?.player.username === username ? userData?.statistics?.mvps + 1 : userData?.statistics?.mvps,
      bricklayer: bricklayerPlayer?.player.username === username ? userData?.statistics?.bricklayer + 1 : userData?.statistics?.bricklayer,
      hostage: hostagePlayer?.player.username === username ? userData?.statistics?.hostage + 1 : userData?.statistics?.hostage,
      won: isUserWinnerOfMatch ?  userData?.statistics?.won + 1 :  userData?.statistics?.won,
    }

    await updateDoc(userDocRef, { statistics } as UserDTO);
  }

  await deleteQueue({ matchId });
  await Promise.all([match.players.map(user => distributeStatistics(user.username))]);

  return NextResponse.json({ success: true, message: 'Honras foram distribuídas para os jogadores com mais votos' });
}