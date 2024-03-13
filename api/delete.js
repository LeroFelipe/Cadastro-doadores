require('dotenv').config();
const authenticateToken = require('./auth');

const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");

module.exports = async (req, res) => {

    // Recuperar os parâmetros do corpo da solicitação
    const { doadorId } = req.body;

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

            // Converter o ID para o formato ObjectId
            const objectIdDoadorId = new ObjectId(String(doadorId));

            // Realizar a operação exclusão
            const result =  await collection.deleteOne({_id: objectIdDoadorId});
            console.log('DELETAR DOADOR ID: ', objectIdDoadorId);
            // Responder com os dados atualizados
            res.status(200).json({ message: 'Doador excluído com sucesso!', result });

            await client.close();
        });
    } catch (error) {
        console.error('Erro ao excluir doador:', error);
        res.status(500).send('Erro ao excluir doador.');
    }
};
