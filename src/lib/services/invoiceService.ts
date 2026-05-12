import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export class InvoiceService {
  static async getAll() {
    const db = await getDb();
    return db.collection("invoices").find().sort({ createdAt: -1 }).toArray();
  }

  static async create(invoiceData: any) {
    const db = await getDb();
    const result = await db.collection("invoices").insertOne({
      ...invoiceData,
      createdAt: new Date()
    });
    return result.insertedId;
  }

  static async delete(id: string) {
    const db = await getDb();
    await db.collection("invoices").deleteOne({ _id: new ObjectId(id) });
  }
}
