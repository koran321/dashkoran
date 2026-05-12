import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export interface Client {
  _id?: string | ObjectId;
  name: string;
  phone: string;
  university?: string;
  country?: string;
  program?: string;
  subject?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ClientService {
  static async getAll() {
    const db = await getDb();
    const clients = await db.collection("clients").find().sort({ createdAt: -1 }).toArray();
    return clients.map(c => ({ ...c, _id: c._id.toString() }));
  }

  static async getById(id: string) {
    const db = await getDb();
    const client = await db.collection("clients").findOne({ _id: new ObjectId(id) });
    if (client) {
      return { ...client, _id: client._id.toString() };
    }
    return null;
  }

  static async create(clientData: Partial<Client>) {
    const db = await getDb();
    const { _id, ...data } = clientData;
    const result = await db.collection("clients").insertOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    } as any);
    return result.insertedId;
  }

  static async update(id: string, clientData: Partial<Client>) {
    const db = await getDb();
    const { _id, ...data } = clientData;
    await db.collection("clients").updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } }
    );
  }

  static async delete(id: string) {
    const db = await getDb();
    await db.collection("clients").deleteOne({ _id: new ObjectId(id) });
  }
}
