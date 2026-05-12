const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://bsnsone:shihabsolidgets@akcluster0.zax3xwc.mongodb.net/ak_process?retryWrites=true&w=majority";

async function testConnection() {
  console.log("🧪 Testing MongoDB Connection...");
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log("✅ Successfully connected to MongoDB");
    
    const db = client.db("ak_process");
    
    // Check collections
    const collections = await db.listCollections().toArray();
    console.log("📂 Collections found:", collections.map(c => c.name));
    
    // Sample data from 'assignment'
    const tasks = await db.collection("assignment").find().limit(1).toArray();
    console.log("📋 Sample Task:", JSON.stringify(tasks, null, 2));

  } catch (err) {
    console.error("❌ Connection failed:", err);
  } finally {
    await client.close();
  }
}

testConnection();
