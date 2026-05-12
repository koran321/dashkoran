import { NextResponse } from "next/server";
import { ClientService } from "@/lib/services/clientService";

export async function GET() {
  try {
    const clients = await ClientService.getAll();
    return NextResponse.json(clients);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const id = await ClientService.create(data);
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
