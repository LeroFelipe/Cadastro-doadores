require('dotenv').config();
const jwt = require('jsonwebtoken');

const users = [
  { id: 1, username: 'usuario1', password: 'senha123' },
  // Adicione mais usuários conforme necessário
];

module.exports = async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Usuário ou senha incorretos' });
  }
};