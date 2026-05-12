import { getDb } from "@/lib/mongodb";

export class LoggerService {
  static async log(action: string, details: string) {
    try {
      const db = await getDb();
      await db.collection("logs").insertOne({
        action,
        details,
        timestamp: new Date()
      });
    } catch (err) {
      console.error("[LoggerService] Failed to log action:", err);
    }
  }

  static async getAll(limit = 50) {
    const db = await getDb();
    return db.collection("logs").find().sort({ timestamp: -1 }).limit(limit).toArray();
  }
}
