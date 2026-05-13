import { getDb } from "../mongodb";

export class SecurityService {
  static async verifyPassword(password: string, name: string): Promise<boolean> {
    const db = await getDb("ak_process");
    const security = await db.collection("security").findOne({ 
      name: { $regex: name, $options: "i" },
      password 
    });
    return !!security;
  }

  static async getPasswordByName(name: string): Promise<string | null> {
    const db = await getDb("ak_process");
    const security = await db.collection("security").findOne({ 
      name: { $regex: name, $options: "i" }
    });
    return security ? security.password : null;
  }
}
