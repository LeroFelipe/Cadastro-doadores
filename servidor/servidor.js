const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Servir conteúdo estático (HTML, CSS, imagens)
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname)));

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '2323',
  database: process.env.DB_NAME || 'banco_de_doadores',
  connectionLimit: 10,
});

// Criar tabela se não existir
db.query(`CREATE TABLE IF NOT EXISTS doadores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  endereco VARCHAR(255),
  tipo_sanguineo VARCHAR(10) NOT NULL,
  celular VARCHAR(15) NOT NULL,
  genero VARCHAR(10)
)`, (err) => {
  if (err) {
    console.error('Erro ao criar tabela:', err);
  } else {
    console.log('Tabela criada ou já existente.');
  }
});

// Rotas para suas páginas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../login.html'));
});

app.get('/tabela', (req, res) => {
  res.sendFile(path.join(__dirname, '../tabela.html'));
});

// Rota para receber dados do formulário
app.post('/cadastro', (req, res) => {
  const { nome, endereco, tipo_sanguineo, celular, genero } = req.body;

  const query = `INSERT INTO doadores (nome, endereco, tipo_sanguineo, celular, genero) VALUES (?, ?, ?, ?, ?)`;

  db.query(query, [nome, endereco, tipo_sanguineo, celular, genero], (err, result) => {
    if (err) {
      console.error('Erro ao inserir dados:', err);
      res.status(500).send('Erro ao processar o cadastro.');
    } else {
      console.log('Dados inseridos com sucesso!');
      res.status(200).json({ message: 'Cadastro realizado com sucesso!' });
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

console.log('Caminho completo para assets:', path.join(__dirname, 'assets'));


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