import { NextResponse } from "next/server";
import { TaskService } from "@/lib/services/taskService";

export async function GET() {
  try {
    const tasks = await TaskService.getAll();
    return NextResponse.json(tasks);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const id = await TaskService.create(data);
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
