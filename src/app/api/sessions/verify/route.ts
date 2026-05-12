import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json({ valid: false });
    }

    const db = await getDb("ak_process");
    const session = await db.collection("sessions").findOne({
      _id: new ObjectId(sessionId),
      expiresAt: { $gt: new Date() }
    });

    return NextResponse.json({ valid: !!session });
  } catch (error) {
    return NextResponse.json({ valid: false });
  }
}
