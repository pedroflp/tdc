import { collections } from "@/services/constants";
import { firestore } from "@/services/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
    const leadBoardQuery = query(
        collection(firestore, collections.USERS),
        orderBy("statistics.points", "desc"),
    );

    const leadBoardsDocs = await getDocs(leadBoardQuery)
    const leadBoards = leadBoardsDocs.docs.map(leadBoard => leadBoard.data());

    return NextResponse.json({
        success: true,
        data: leadBoards
    })
}