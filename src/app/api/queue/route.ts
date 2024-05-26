import { cookiesKeys } from "@/constants/cookies";
import { MatchModesEnum } from "@/flows/home/components/MatchOptionCard/types";
import { collections } from "@/services/constants";
import { firestore } from "@/services/firebase";
import { getUserFromToken } from "@/utils/getUsernameFromToken";
import { parseEmailToUsername } from "@/utils/parseUsername";
import { addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { QueueItem } from "@/flows/queue/types";

export async function POST(request: NextRequest) {
  const { name, mode, protectMode }: { name: string, mode: MatchModesEnum, protectMode: { enabled: boolean, code: string } } = await request.json();
  
  const token = cookies().get(cookiesKeys.TOKEN);
  if (!token) return NextResponse.error();

  try {
    const username = parseEmailToUsername(getUserFromToken(token.value, "email"));
    const userDoc = await getDoc(doc(firestore, collections.USERS, username));
    const userData = userDoc.data()!;
    
    const user = {
      username: userData.username,
      name: userData.name,
      avatar: userData.avatar,
    };

    const queue = await addDoc(collection(firestore, collections.QUEUES), {
      name,
      mode,
      hoster: user,
      players: [
        user,
        ...Array(9).fill({})
      ],
      teams: [],
      createdAt: new Date().toISOString(),
    });

    const queueId = queue.id;
    await updateDoc(queue, { id: queueId });

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

    if (!!process.env.NEXT_PUBLIC_discordWebhook) {
      const embedMessage = {
        username: "TDCU Beta",
        avatar_url: "https://firebasestorage.googleapis.com/v0/b/plol-tst.appspot.com/o/users%2Fenvy%2Fprofile%2Favatar?alt=media&token=5efc109b-fbce-4e54-af93-09871fb98454",
        embeds: [
          {
            id: 998541052,
            title: `Sala ${name}!`,
            description: `[${userData.name}](https://beta.plol.pedroflp.dev/${userData.username}) acabou de criar uma nova sala para competir!\nEntre agora e dispute a vitória para ganhar pontos!\n\n[**Entrar na sala e participar da partida**](${`https://beta.plol.pedroflp.dev/queue/${queueId}`})`,
            url: `https://beta.plol.pedroflp.dev/queue/${queueId}`,
            color: 16777215,
            author: {
              name: `${userData.name}`,
              url: `https://beta.plol.pedroflp.dev/${userData.username}`,
              icon_url: userData.avatar
            },
            thumbnail: {
              url: "https://beta.plol.pedroflp.dev/_next/image?url=%2Fassets%2Ficons%2Fdefault-match.png&w=2048&q=75"
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