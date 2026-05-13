import { NextResponse } from "next/server";
import { TaskService } from "@/lib/services/taskService";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const task = await TaskService.getById(params.id);
    if (!task) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(task);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    await TaskService.update(params.id, data);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("API Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const success = await TaskService.delete(params.id);
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
