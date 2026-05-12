import { NextResponse } from "next/server";
import { ClientService } from "@/lib/services/clientService";
import { TaskService } from "@/lib/services/taskService";

export async function GET(req: Request) {
  try {
    const clientId = req.headers.get("authorization");
    if (!clientId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const clients = await ClientService.getAll();
    const client = clients.find((c: any) => c._id.toString() === clientId);
    if (!client) return NextResponse.json({ error: "Client profile not found" }, { status: 404 });

    const allTasks = await TaskService.getAll();
    const clientTasks = allTasks.filter((t: any) => 
      (t.client?.toString() === clientId) || 
      (t.client?._id?.toString() === clientId)
    );

    return NextResponse.json({
      profile: client,
      tasks: clientTasks
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
