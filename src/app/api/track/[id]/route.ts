import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const rawId = String(context?.params?.id || "");
    const cleanId = rawId.replace(/^#/, "").trim().toUpperCase();

    if (!cleanId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("ak_process");

    const task = await db.collection("assignment").findOne({ orderId: cleanId });

    if (!task) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Safely resolve client name
    let clientName = "Client";
    try {
      if (task.client) {
        const { ObjectId } = await import("mongodb");
        const clientDoc = await db.collection("clients").findOne({
          _id: new ObjectId(task.client.toString())
        });
        if (clientDoc?.name) clientName = clientDoc.name;
      }
    } catch {
      // Non-critical — continue without client name
    }

    return NextResponse.json({
      _id: String(task._id),
      orderId: task.orderId,
      title: task.title,
      status: task.status,
      workType: task.workType || "Task",
      deadline: task.deadline,
      assignedTo: task.assignedTo || null,
      clientName,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
