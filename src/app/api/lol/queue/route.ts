import { routeNames } from "@/app/route.names";
import { cookiesKeys } from "@/constants/cookies";
import { QueueItem } from "@/flows/lol/queue/types";
import { MatchModesEnum } from "@/flows/lol/queues/components/MatchOptionCard/types";
import { collections } from "@/services/constants";
import { firestore } from "@/services/firebase";
import bcrypt from 'bcrypt';
import { addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getUserDataByToken } from "../../user/requests";
import { UserDTO } from "../../user/types";

export async function POST(request: NextRequest) {
  const { name, mode, protectMode }: { name: string, mode: MatchModesEnum, protectMode: { enabled: boolean, code: string } } = await request.json();
  const token = cookies().get(cookiesKeys.TOKEN);
  const user = await getUserDataByToken();

  if (!token || !user) return NextResponse.error();

  try {
    const hoster = {
      username: user.username,
      name: user.name,
      avatar: user.avatar,
    }
    const queue = await addDoc(collection(firestore, collections.QUEUES), {
      name,
      mode,
      hoster,
      players: [
        hoster,
        ...Array(9).fill({})
      ],
      teams: [],
      createdAt: new Date().toISOString(),
    });

    const queueId = queue.id;
    await updateDoc(queue, { id: queueId });
    await updateDoc(doc(firestore, collections.USERS, user.username), {
      activeMatch: queueId
    })

    if (protectMode.enabled) {
      bcrypt.hash(protectMode.code, 5, async (err, hash) => {
        if (!hash || err) return;
    
        await updateDoc(queue, {
          protection: {
            enabled: true,
            code: hash
          }
        })
      });
    }

    if (!!process.env.NEXT_PUBLIC_discordWebhook) NotifyDiscordWebhook(user, name, queueId);

    return NextResponse.json({
      success: true,
      queueId,
    })
  } catch (error) {
    return NextResponse.error();
  }

}

export async function PUT(request: NextRequest) {
  const {queueId, body}: { queueId: string, body: any } = await request.json();
  const token = cookies().get(cookiesKeys.TOKEN);

  if (!token) return NextResponse.error();

  try {
    const queue = await getDoc(doc(firestore, collections.QUEUES, queueId))

    if (!queue.exists()) return NextResponse.error();

    await updateDoc(doc(firestore, collections.QUEUES, queueId), body);

    return NextResponse.json({
      success: true,
      queueId,
    })
  } catch (error) {
    return NextResponse.error();
  }
}

export async function DELETE(request: NextRequest) {
  const {queueId}: { queueId: string } = await request.json();

  try {
    await deleteDoc(doc(firestore, collections.QUEUES, queueId));

    return NextResponse.json({
      success: true,
      queueId,
    })
  } catch (error) {
    return NextResponse.error();
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  const code = url.searchParams.get('code');
  const queueId = url.searchParams.get('queueId');

  if (!code || !queueId) return NextResponse.error();

  try {
    const queueDoc = await getDoc(doc(firestore, collections.QUEUES, queueId));
    if (!queueDoc.exists()) return NextResponse.error();
    const queueData = queueDoc.data() as QueueItem;

    const queueProtectCode = queueData.protection?.code;

    const isCodeValid = bcrypt.compareSync(code, queueProtectCode!);

    if (!isCodeValid) return NextResponse.json({success: false, error: "O código inserido está incorreto!"});

    return NextResponse.json({success: true});
  } catch (error) {
    return NextResponse.error();
  }
}


async function NotifyDiscordWebhook(user: UserDTO, name: string, queueId: string) { 
  const embedMessage = {
    username: "TDC Salas",
    avatar_url: "https://cdn.discordapp.com/app-icons/446811328267681793/2ef3fefe5e7859fac4cb9f432755720c.png?size=256",
    embeds: [
      {
        id: 998541052,
        title: `Sala ${name} acabou de ser criada!`,
        description: `${user.name} criou uma nova sala para competir!\nEntre agora e dispute a vitória para ganhar pontos!\n\n[**Entrar na sala e participar da partida**](${
          process.env.NEXT_PUBLIC_apiBaseUrl+routeNames.QUEUE(queueId)
        })`,
        url: process.env.NEXT_PUBLIC_apiBaseUrl+routeNames.QUEUE(queueId),
        color: 16777215,
        author: {
          name: `${user.name}`,
          url: process.env.NEXT_PUBLIC_apiBaseUrl+routeNames.PROFILE(user.username),
          icon_url: user.avatar
        },
        thumbnail: {
          url: `${process.env.NEXT_PUBLIC_apiBaseUrl}/_next/image?url=%2Fassets%2Ficons%2Fdefault-match.png&w=2048&q=75`
        }
      }
    ],
  };

  await fetch(process.env.NEXT_PUBLIC_discordWebhook, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(embedMessage),
  });
}