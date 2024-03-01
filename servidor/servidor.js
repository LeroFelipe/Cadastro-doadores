const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

const { MongoClient, ServerApiVersion } = require("mongodb");

app.use(express.json());

// Conectar ao MongoDB
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
    await client.connect();
    console.log('Conectado ao MongoDB');

    // Rota para receber dados do formulário
    app.post('/cadastro', async (req, res) => {
      try {

        console.log("CHEGUEI AQUI!!!");
        const db = client.db();
        const collection = db.collection('doadores');

        // Obter dados do corpo da solicitação
        const { nome, endereco, celular, dataNascimento, cpf, tipoSanguineo, genero } = req.body;

        // Validar os dados recebidos conforme necessário

        // Criar um documento
        const doc = {
          nome,
          endereco,
          celular,
          dataNascimento,
          cpf,
          tipoSanguineo,
          genero,
        };

        // Inserir documento na coleção
        const result = await collection.insertOne(doc);

        // Responder com sucesso
        res.status(200).json({ message: 'Cadastro realizado com sucesso!', insertedId: result.insertedId });
      } catch (error) {
        console.error('Erro ao processar o cadastro:', error);
        res.status(500).send('Erro ao processar o cadastro.');
      }
    });

    // Iniciar o servidor
    app.listen(port, () => {
      console.log(`Servidor está rodando em http://localhost:${port}`);
    });

  } finally {
    // Ensures that the client will close when you finish/error
    // client.close();
  }
}
run().catch(console.dir);