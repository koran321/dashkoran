const { MongoClient } = require('mongodb');

async function test() {
  const uri = "mongodb+srv://assignmentkoran:Z0vXFfXUeYFidF9C@cluster0.p7h1s.mongodb.net/assignmentkoran?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('assignmentkoran');
  const clients = await db.collection('clients').find().toArray();
  console.log("Clients Found:", clients.length);
  if (clients.length > 0) console.log("Sample Client:", JSON.stringify(clients[0], null, 2));
  await client.close();
}

test();
