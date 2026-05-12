import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export interface Writer {
  _id?: string | ObjectId;
  name: string;
  phone: string;
  email?: string;
  image?: string;
  dob?: string;
  nid?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class WriterService {
  static async getAll() {
    const db = await getDb();
    const writers = await db.collection("writers").find().sort({ name: 1 }).toArray();
    return writers.map(w => ({ ...w, _id: w._id.toString() }));
  }

  static async create(writerData: Partial<Writer>) {
    const db = await getDb();
    const result = await db.collection("writers").insertOne({
      ...writerData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return result.insertedId;
  }

  static async update(id: string, writerData: Partial<Writer>) {
    const db = await getDb();
    await db.collection("writers").updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...writerData, updatedAt: new Date() } }
    );
  }

  static async delete(id: string) {
    const db = await getDb();
    await db.collection("writers").deleteOne({ _id: new ObjectId(id) });
  }
}
