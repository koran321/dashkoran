const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://bsnsone:shihabsolidgets@akcluster0.zax3xwc.mongodb.net/ak_process?retryWrites=true&w=majority";

async function checkSecurity() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("ak_process");
    const security = await db.collection("security").find({}).toArray();
    console.log(JSON.stringify(security, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

checkSecurity();
