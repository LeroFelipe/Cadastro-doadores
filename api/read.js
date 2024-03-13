// read.js
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const authenticateToken = require('./auth'); 

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

        // Aplicar o middleware de autenticação
        authenticateToken(req, res, async () => {            
            // Se o token for válido, realizar a operação de leitura no banco de dados
            let result = await collection.find({}).toArray();

            // Responder com os dados lidos
            res.status(200).json(result);

            await client.close();
        });
        
    } catch (error) {
        console.error('Erro ao processar a leitura:', error);
        res.status(500).send('Erro ao processar a leitura.');
    }
};
