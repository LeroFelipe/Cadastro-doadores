const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Configurando o body-parser para lidar com dados JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir conteúdo estático (HTML, CSS, imagens)
app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.use(express.static(path.join(__dirname)));

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
});

// Criar tabela se não existir
db.query(`CREATE TABLE IF NOT EXISTS doadores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  endereco VARCHAR(255),
  celular VARCHAR(15) NOT NULL,
  nascimento DATE,
  tipo_sanguineo VARCHAR(10) NOT NULL,
  genero VARCHAR(10),
  data_doacao DATE
)`, (err) => {
  if (err) {
    console.error('Erro ao criar tabela:', err);
  } else {
    console.log('Tabela criada ou já existente.');
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../login.html'));
});

app.get('/cadastro.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../cadastro.html'));
});

app.get('/tabela.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../tabela.html'));
});

// Rota para receber dados do formulário
app.post('/cadastro', (req, res) => {

  console.log('Dados recebidos no servidor:', req.body);

  const { nome, endereco, celular, nascimento, tipo_sanguineo, genero } = req.body;

  const query = `INSERT INTO doadores (nome, endereco, celular, nascimento, tipo_sanguineo, genero) VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(query, [nome, endereco, celular, nascimento, tipo_sanguineo, genero], (err, result) => {
    if (err) {
      console.error('Erro ao inserir dados:', err);
      res.status(500).send('Erro ao processar o cadastro.');
    } else {
      console.log('Dados inseridos com sucesso!');
      res.status(200).json({ message: 'Cadastro realizado com sucesso!' });
    }
  });
});

// Rota para obter dados do servidor
app.get('/dados-doadores', (req, res) => {
  // Consulta SQL para obter todos os doadores
  const query = 'SELECT * FROM doadores';

  db.query(query, (err, result) => {
    if (err) {
      console.error('Erro ao obter dados dos doadores:', err);
      res.status(500).send('Erro ao obter dados dos doadores.');
    } else {
      // Enviar os dados dos doadores como resposta em formato JSON
      res.status(200).json(result);
    }
  });
});

// Rota para incluir data de doação 
app.post('/agendar-doador/:id', (req, res) => {
  const doadorId = req.params.id;
  const { dataDoacao } = req.body;

  // Consulta SQL parametrizada para atualizar a data de doação do doador pelo ID
  const query = 'UPDATE doadores SET data_doacao = ? WHERE id = ?';

  db.query(query, [dataDoacao, doadorId], (err, result) => {
    if (err) {
      console.error('Erro ao agendar doador:', err);
      res.status(500).send('Erro ao agendar doador.');
    } else {
      console.log('Doador agendado com sucesso!');
      res.status(200).json({ message: 'Doador agendado com sucesso!' });
    }
  });
});

// Rota para excluir um doador pelo ID
app.delete('/excluir-doador/:id', (req, res) => {
  const doadorId = req.params.id;

  // Consulta SQL para excluir o doador pelo ID
  const query = 'DELETE FROM doadores WHERE id = ?';

  db.query(query, [doadorId], (err, result) => {
    if (err) {
      console.error('Erro ao excluir doador:', err);
      res.status(500).send('Erro ao excluir doador.');
    } else {
      console.log('Doador excluído com sucesso!');
      res.status(200).json({ message: 'Doador excluído com sucesso!' });
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

// Fechar o pool de conexões com o banco de dados ao encerrar o servidor
process.on('SIGINT', () => {
  db.end((err) => {
    if (err) {
      return console.error('Erro ao fechar o pool de conexões:', err.message);
    }
    console.log('Pool de conexões com o banco de dados encerrado.');
    process.exit();
  });
});