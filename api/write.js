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

  // Verificar se a solicitação é do tipo POST
  if (req.method === 'POST') {
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
  } else {
    // Caso contrário, responda com um erro de método não permitido
    res.status(405).send('Método não permitido');
    }
  } catch (error) {
    console.error('Erro ao processar o cadastro:', error);
    res.status(500).send('Erro ao processar o cadastro.');
  } finally {
    await client.close();
  }
};