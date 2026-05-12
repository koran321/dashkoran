import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await getDb();
    const cleanId = (params.id || "").replace(/^#/, "").trim().toUpperCase();

    if (!cleanId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    // Try to find by orderId first (most common case for clients)
    let task = await db.collection("assignment").findOne({ orderId: cleanId });

    // Fallback: try by MongoDB _id if it looks like one
    if (!task && cleanId.length === 24 && /^[0-9A-F]+$/i.test(cleanId)) {
      try {
        task = await db.collection("assignment").findOne({ _id: new ObjectId(cleanId.toLowerCase()) });
      } catch {
        // Invalid ObjectId format, ignore
      }
    }

    if (!task) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Safely get client name without crashing on null/missing client
    let clientName = "Valued Client";
    if (task.client) {
      try {
        const clientIdStr = task.client.toString();
        const client = await db.collection("clients").findOne({
          _id: new ObjectId(clientIdStr)
        });
        if (client?.name) clientName = client.name;
      } catch {
        // Client lookup failed — not critical, continue
      }
    }

    return NextResponse.json({
      _id: task._id.toString(),
      orderId: task.orderId,
      title: task.title,
      status: task.status,
      workType: task.workType,
      deadline: task.deadline,
      assignedTo: task.assignedTo || null,
      clientName,
    });
  } catch (error: any) {
    console.error("[TRACK API ERROR]", error?.message, error?.stack);
    return NextResponse.json({ 
      error: error?.message || "Unknown server error",
    }, { status: 500 });
  }
}
