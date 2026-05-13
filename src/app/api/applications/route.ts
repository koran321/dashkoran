import { NextResponse } from "next/server";
import { ApplicationService } from "@/lib/services/applicationService";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    let filter = {};
    if (status) {
      const statuses = status.split(",");
      filter = { status: { $in: statuses } };
    }
    
    const applications = await ApplicationService.getAll(filter);
    return NextResponse.json(applications);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const result = await ApplicationService.create(data);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
