require('dotenv').config();

const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");

module.exports = async (req, res) => {

    // Recuperar os parâmetros do corpo da solicitação
    const { doadorId, dataDoacao, protocolo } = req.body;

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

        // Converter o ID para o formato ObjectId
        const objectIdDoadorId = new ObjectId(String(doadorId));

        const query = { _id: objectIdDoadorId };
        const update = {
            $set: {
                dataDoacao: dataDoacao,
                protocolo: protocolo
            }
        };

        // Realizar a operação de atualização
        const result =  await collection.updateOne(query, update);

        // Responder com os dados atualizados
        res.status(200).json({ message: 'Informações atualizadas com sucesso!', result });
    } catch (error) {
        console.error('Erro ao processar a inclusão:', error);
        res.status(500).send('Erro ao processar a inclusão.');
    } finally {
        await client.close();
    }
};
