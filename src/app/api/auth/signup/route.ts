import { collections } from "@/services/constants";
import { firestore } from "@/services/firebase";
import { collection, doc, setDoc } from 'firebase/firestore';
import { NextRequest, NextResponse } from "next/server";
import { DiscordUserDTO } from "../../user/types";


export async function POST(request: NextRequest) {
  const { user }: { user: DiscordUserDTO } = await request.json();

  await setDoc(doc(collection(firestore, collections.USERS), user.username), {
    id: user.id,
    email: user.email,
    avatar: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
    name: user.username,
    username: user.username,
    createdAt: new Date().toISOString(),
    statistics: {
      won: 0,
      played: 0,
      mvps: 0,
      bricklayer: 0,
      hostage: 0,
      points: 0
    }
  });

  return NextResponse.json({ success: true });
}
