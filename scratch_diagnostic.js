import { MongoClient } from "mongodb";
import fs from "fs";

const envPath = "./.env.local";
let mongoUri = "";

try {
  const envContent = fs.readFileSync(envPath, "utf8");
  const match = envContent.match(/MONGODB_URI=(.*)/);
  if (match && match[1]) {
    mongoUri = match[1].trim();
  }
} catch (err) {
  console.error("Failed to read .env.local", err);
}

if (!mongoUri) {
  console.error("MONGODB_URI not found");
  process.exit(1);
}

async function run() {
  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
    const db = client.db("ak_process");

    const tasks = await db.collection("assignment").find().toArray();
    console.log(`\n--- Tasks Diagnostic (${tasks.length} total) ---`);
    tasks.forEach(t => {
      if (!t.title) {
        console.warn(`Task [${t._id}] is missing a title!`);
      }
      if (!t.orderId) {
        console.warn(`Task [${t._id}] "${t.title || 'Untitled'}" is missing orderId!`);
      }
      if (t.deadline) {
        const d = new Date(t.deadline);
        if (isNaN(d.getTime())) {
          console.warn(`Task [${t._id}] "${t.title}" has invalid deadline:`, t.deadline);
        }
      } else {
        console.warn(`Task [${t._id}] "${t.title}" is missing deadline.`);
      }
    });

  } catch (err) {
    console.error("Error during diagnostics:", err);
  } finally {
    await client.close();
  }
}

run();
