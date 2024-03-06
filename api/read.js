// read.js
require('dotenv').config();

const { MongoClient, ServerApiVersion } = require("mongodb");

module.exports = async (req, res) => {
  // Conectar ao MongoDB
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect();
    console.log('Conectado ao MongoDB');

    const db = client.db('mymongodb');
    const collection = db.collection('doadores');

    // Realizar a operação de leitura, por exemplo, buscar todos os documentos na coleção
    const result = await collection.find({}).toArray();

    // Responder com os dados lidos
    res.status(200).json(result);
  } catch (error) {
    console.error('Erro ao processar a leitura:', error);
    res.status(500).send('Erro ao processar a leitura.');
  } finally {
    await client.close();
  }
};
