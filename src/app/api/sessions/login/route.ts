import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    
    // Verify password against DB
    const { SecurityService } = await import("@/lib/services/securityService");
    const isValid = await SecurityService.verifyPassword(password, "public entry password");
    
    if (!isValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const db = await getDb("ak_process");
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 1); // 1 month from now

    const result = await db.collection("sessions").insertOne({
      createdAt: new Date(),
      expiresAt: expiry,
      type: "public_entry"
    });

    return NextResponse.json({ 
      success: true, 
      sessionId: result.insertedId 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
