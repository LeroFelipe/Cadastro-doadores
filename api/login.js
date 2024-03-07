require('dotenv').config();
const jwt = require('jsonwebtoken');

const users = [
  { id: 1, usuario: 'sebastiao', password: '01020304' },
  // Adicione mais usuários conforme necessário
];

module.exports = async (req, res) => {
  const { usuario, password } = req.body;

  const user = users.find(u => u.usuario === usuario && u.password === password);

  if (user) {
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '2m' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Usuário ou senha incorretos!'});
  }
};