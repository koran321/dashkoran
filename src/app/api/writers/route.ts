import { NextResponse } from "next/server";
import { WriterService } from "@/lib/services/writerService";

export async function GET() {
  try {
    const writers = await WriterService.getAll();
    return NextResponse.json(writers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const id = await WriterService.create(data);
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
