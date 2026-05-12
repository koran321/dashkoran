const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://bsnsone:shihabsolidgets@akcluster0.zax3xwc.mongodb.net/ak_process?retryWrites=true&w=majority";

async function listCollections() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("ak_process");
    const collections = await db.listCollections().toArray();
    console.log(collections.map(c => c.name));
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

listCollections();
