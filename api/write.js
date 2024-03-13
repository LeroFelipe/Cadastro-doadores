require('dotenv').config();
const authenticateToken = require('./auth'); 

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
    authenticateToken(req, res, async () => { 
      await client.connect();
      console.log('Conectado ao MongoDB');

      const db = client.db('mymongodb');
      const collection = db.collection('doadores');

      // Obter dados do corpo da solicitação
      const { nome, endereco, celular, dataNascimento, cpf, tipoSanguineo, genero } = req.body;

      // Criar um documento
      const doc = {
      nome,
      endereco,
      celular,
      dataNascimento,
      cpf,
      tipoSanguineo,
      genero
      };

      console.log('Dados para inserção: ', doc);

      // Inserir documento na coleção
      const result = await collection.insertOne(doc);
      // Responder com sucesso
      res.status(200).json({ message: 'Cadastro realizado com sucesso!', insertedId: result.insertedId });
      await client.close();
    });
  } catch (error) {
    console.error('Erro ao processar o cadastro:', error);
    res.status(500).send('Erro ao processar o cadastro.');
  }  
};