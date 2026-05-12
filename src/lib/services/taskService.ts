import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export interface Task {
  _id?: string | ObjectId;
  orderId?: string;
  title: string;
  details?: string;
  workType: string;
  deadline: Date;
  status: "pending" | "in_progress" | "review" | "done";
  totalValue: number;
  advancePaid: number;
  bonus?: number;
  writerPay: number;
  client: string | ObjectId;
  assignee?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class TaskService {
  static async getAll(query = {}, sort: any = { deadline: 1 }) {
    const db = await getDb();
    return db.collection("assignment").aggregate([
      { $match: query },
      { $sort: sort },
      {
        $lookup: {
          from: "clients",
          let: { clientId: "$client" },
          pipeline: [
            { 
              $match: { 
                $expr: { 
                  $or: [
                    { $eq: ["$_id", "$$clientId"] },
                    { $eq: ["$_id", { $toObjectId: "$$clientId" }] }
                  ] 
                } 
              } 
            }
          ],
          as: "clientData"
        }
      },
      {
        $addFields: {
          client: { $arrayElemAt: ["$clientData", 0] }
        }
      },
      {
        $addFields: {
          "client._id": { $toString: "$client._id" },
          "clientName": "$client.name",
          "clientUniversity": "$client.university",
          "_id": { $toString: "$_id" }
        }
      },
      { $project: { clientData: 0 } }
    ]).toArray();
  }

  static async getById(idOrShort: string) {
    const db = await getDb();
    const cleanId = idOrShort.replace(/^#/, "").trim();
    const isObjectId = cleanId.length === 24 && /^[0-9a-fA-F]+$/.test(cleanId);
    const matchQuery = isObjectId 
      ? { _id: new ObjectId(cleanId) } 
      : { orderId: cleanId.toUpperCase() };

    const tasks = await db.collection("assignment").aggregate([
      { $match: matchQuery },
      {
        $lookup: {
          from: "clients",
          let: { clientId: { $toString: "$client" } },
          pipeline: [
            { 
              $match: { 
                $expr: { $eq: [{ $toString: "$_id" }, "$$clientId"] }
              } 
            }
          ],
          as: "clientData"
        }
      },
      {
        $addFields: {
          clientInfo: { $arrayElemAt: ["$clientData", 0] },
          _id: { $toString: "$_id" }
        }
      },
      {
        $addFields: {
          "clientName": { $ifNull: ["$clientInfo.name", "Client"] },
          "clientUniversity": { $ifNull: ["$clientInfo.university", ""] }
        }
      },
      { $project: { clientData: 0, clientInfo: 0 } }
    ]).toArray();
    return tasks[0];
  }

  static async create(taskData: Partial<Task>) {
    const db = await getDb();
    const { _id, ...data } = taskData;
    const orderId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const result = await db.collection("assignment").insertOne({
      ...data,
      orderId,
      createdAt: new Date(),
      updatedAt: new Date()
    } as any);
    return result.insertedId;
  }

  static async update(id: string, taskData: Partial<Task>) {
    const db = await getDb();
    const { _id, ...data } = taskData;
    await db.collection("assignment").updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } }
    );
  }

  static async delete(id: string) {
    const db = await getDb();
    await db.collection("assignment").deleteOne({ _id: new ObjectId(id) });
  }
}
