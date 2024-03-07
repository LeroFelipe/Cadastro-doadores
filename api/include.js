require('dotenv').config();

const { MongoClient, ServerApiVersion } = require("mongodb");

module.exports = async (req, res) => {

    // Recuperar os parâmetros do corpo da solicitação
    const { doadorId, dataDoacao, protocolo } = req.body;
    console.log(doadorId, dataDoacao, protocolo);

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

        // Realizar a operação de atualização
        const result = await collection.updateOne({ _id: '65e8e3a5cb4be23d18388428' }, { $set: { doacao: '10/10/10', prot:'SEXO'} });

        // Responder com os dados atualizados
        res.status(200).json({ message: 'Informações atualizadas com sucesso!', result });
    } catch (error) {
        console.error('Erro ao processar a inclusão:', error);
        res.status(500).send('Erro ao processar a inclusão.');
    } finally {
        await client.close();
    }
};
