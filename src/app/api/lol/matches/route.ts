import { collections } from "@/services/constants";
import { firestore } from "@/services/firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { CloudCog } from "lucide-react";
import { NextResponse } from "next/server";

export async function GET() {
    const matchQuery = query(
        collection(firestore, collections.MATCHES),
        where("finished", "==", true),
        orderBy("createdAt", "desc"),
    );

    const matchesDocs = await getDocs(matchQuery)

    const matches = matchesDocs.docs.map(match => match.data());

    return NextResponse.json({
        success: true,
        matches
    })
}

export const dynamic = "force-dynamic";