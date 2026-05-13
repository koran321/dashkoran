import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    const { SecurityService } = await import("@/lib/services/securityService");
    const isValid = await SecurityService.verifyPassword(password, "CRUD main password");

    if (isValid) {
      const db = await getDb("ak_process");
      // Cleanup expired sessions
      await db.collection("sessions").deleteMany({ 
        expiresAt: { $lt: new Date() } 
      });

      const response = NextResponse.json({ success: true });
      // Set a session cookie
      response.cookies.set("session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      });
      return response;
    }
    
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  // Check session
  return NextResponse.json({ authenticated: true });
}
