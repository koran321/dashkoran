import { NextResponse } from "next/server";
import { TaskService } from "@/lib/services/taskService";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (orderId) {
      // Tracking lookup — return single task by orderId
      const tasks = await TaskService.getAll({ orderId: orderId.toUpperCase() });
      if (!tasks || tasks.length === 0) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
      return NextResponse.json(tasks[0]);
    }

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
