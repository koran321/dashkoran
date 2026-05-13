import { NextResponse } from "next/server";
import { SecurityService } from "@/lib/services/securityService";

export async function POST(req: Request) {
  try {
    const { password, type } = await req.json();
    
    let dbName = "";
    if (type === "main") dbName = "CRUD main password";
    else if (type === "reveal") dbName = "Client phone reveal password";
    else if (type === "invoice") dbName = "Invoice Downloading Password";
    else if (type === "public") dbName = "public entry password";
    else return NextResponse.json({ error: "Invalid verification type" }, { status: 400 });

    const isValid = await SecurityService.verifyPassword(password, dbName);
    
    if (isValid) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
