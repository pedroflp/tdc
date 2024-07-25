import { cookiesKeys } from "@/constants/cookies";
import { collections } from "@/services/constants";
import { firestore } from "@/services/firebase";
import mux from "@/services/mux";
import { addDoc, collection, doc, getDocs, setDoc } from "firebase/firestore";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getUserDataByToken } from "../user/requests";

export async function GET() {
  const videos = await getDocs(collection(firestore, collections.VIDEOS));
  const videosData = videos.docs.map(video => video.data());

  return NextResponse.json({ success: true, data: videosData });
}

export async function POST(request: Request) {
  const { title, category, uploadId } = await request.json();
  
  const user = await getUserDataByToken();
  if (!user) return NextResponse.json({ success: false }, { status: 403 });

  const upload = await mux.video.uploads.retrieve(uploadId);
  if (!upload) return NextResponse.json({ success: false }, { status: 404 });

  const asset = await mux.video.assets.retrieve(upload?.asset_id!);
  const videoData = {
    asset,
    title: title ? title : `[${user.username}]${new Date().toISOString()}`,
    category: category ? category : 'geral',
    id: uploadId,
    creator: {
      username: user.username,
      name: user.name,
      avatar: user.avatar,
    },
    views: 0,
    likes: 0,
    deslikes: 0,
    createdAt: new Date().toISOString(),
  }

  setDoc(doc(firestore, collections.VIDEOS, uploadId), videoData);

  return NextResponse.json({ success: true });
}