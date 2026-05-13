import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { ClientService } from "./clientService";
import { TaskService } from "./taskService";

export interface Application {
  _id?: string | ObjectId;
  name: string;
  phone: string;
  email?: string;
  workType: string;
  details: string;
  status: "pending" | "accepted" | "rejected";
  token: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ApplicationService {
  static async getAll(filter: any = {}) {
    const db = await getDb();
    const applications = await db.collection("applications")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();
    return applications.map(app => ({ ...app, _id: app._id.toString() }));
  }

  static async create(data: Partial<Application>) {
    const db = await getDb();
    const token = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const newApp = {
      ...data,
      status: "pending",
      token,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection("applications").insertOne(newApp);
    return { id: result.insertedId, token };
  }

  static async updateStatus(id: string, status: "accepted" | "rejected" | "pending") {
    const db = await getDb();
    
    // If accepting, we need to create client and task
    if (status === "accepted") {
      const app = await db.collection("applications").findOne({ _id: new ObjectId(id) });
      if (!app) throw new Error("Application not found");

      // 1. Check if client exists by phone, or create new
      const clients = await db.collection("clients").find({ phone: app.phone }).toArray();
      let clientId;
      if (clients.length > 0) {
        clientId = clients[0]._id.toString();
      } else {
        clientId = await ClientService.create({
          name: app.name,
          phone: app.phone,
          university: "", // Placeholder
          country: "Bangladesh",
          program: "None",
          subject: "None"
        });
      }

      // 2. Create Task
      await TaskService.create({
        title: `${app.workType}: ${app.name}`,
        details: app.details,
        workType: app.workType,
        client: clientId,
        status: "pending",
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days as Date object
        totalValue: 0,
        advancePaid: 0,
        assignedTo: "Unassigned"
      } as any);
    }

    await db.collection("applications").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } }
    );
  }

  static async delete(id: string) {
    const db = await getDb();
    await db.collection("applications").deleteOne({ _id: new ObjectId(id) });
  }
}
