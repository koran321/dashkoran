const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://bsnsone:shihabsolidgets@akcluster0.zax3xwc.mongodb.net/ak_process?retryWrites=true&w=majority";

async function testConnection() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("ak_process");
    const expenses = await db.collection("accounts").find().limit(1).toArray();
    console.log("💰 Sample Expense:", JSON.stringify(expenses, null, 2));
  } finally {
    await client.close();
  }
}
testConnection();
