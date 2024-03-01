const express = require('express');
require('dotenv').config();

const { MongoClient, ServerApiVersion } = require("mongodb");
// Replace the placeholder with your Atlas connection string
const uri = process.env.MONGODB_URI;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri,  {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
);

async function run() {
  try {

    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
  
    const db = client.db("mymongodb");
    const coll = db.collection("doadores");

    const doc = {
      nome: "Exemplo",
      endereco: "Rua Exemplo, 123",
      celular: "123456789",
      dataNascimento: "1990-01-01",
      cpf: "123.456.789-00",
      tipoSanguineo: "A+",
      genero: "Masculino",
      dataDoacao: "2024-02-29",
      protocolo: "123ABC"
    };
    
    const result = await coll.insertOne(doc);
    console.log(
      `A document was inserted with the _id: ${result.insertedId}`,
    );

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);