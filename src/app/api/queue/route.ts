import { database } from "@/services/firebase";
import { ref, set } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const queueId = '123';
  const {name, password}: { name: string, password: string } = await request.json();


  try {
    await set(ref(database, 'queues/' + queueId), {
      createdAt: new Date().toISOString(),
      password,
      name,
      id: queueId,
      players: [],
      teams: [],
      teamWinnerId: null,
      matchFinished: false
    });

    return NextResponse.json({
      success: true,
      queueId
    })
  } catch (error) {
    
    return NextResponse.json({
      hello: "post"
    })
  }

}