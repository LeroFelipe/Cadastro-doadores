require('dotenv').config();

const { MongoClient, ServerApiVersion } = require("mongodb");

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

        const query = { _id: doadorId };
        const update = {
            $set: {
                dataDoacao: dataDoacao,
                protocolo: protocolo
            }
        };

        collection.updateOne(query, update);
        // Realizar a operação de atualização
        //const result =  await collection.updateOne(query, update);
        //const result =  await collection.updateOne(query, update);
        //console.log(query, update);

        // Responder com os dados atualizados
        res.status(200).json({ message: 'Informações atualizadas com sucesso!', result });
    } catch (error) {
        console.error('Erro ao processar a inclusão:', error);
        res.status(500).send('Erro ao processar a inclusão.');
    } finally {
        await client.close();
    }
};
