import { NextResponse } from "next/server";
import { StatsService } from "@/lib/services/statsService";

export async function GET() {
  try {
    const stats = await StatsService.getWriterStats();
    return NextResponse.json(stats);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
