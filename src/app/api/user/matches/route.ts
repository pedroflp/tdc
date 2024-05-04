import { MatchItem, Player } from "@/flows/queue/types";
import { collections } from "@/services/constants";
import { firestore } from "@/services/firebase";
import { and, collection, doc, getDoc, getDocs, onSnapshot, or, query, updateDoc, where } from "firebase/firestore";
import { NextResponse } from "next/server";
import { UserDTO } from "../types";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const username = params.get("username");
  
  if (!username) return NextResponse.json({ error: true }, { status: 400 });

  try {
    const matchesRef = collection(firestore, collections.MATCHES);
    const userMatchesQuery = query(matchesRef, where("finished", "==", true));

    return NextResponse.json({});
  } catch (error) {
    return NextResponse.json({ }, { status: 400 });
  }
}