require('dotenv').config();
const jwt = require('jsonwebtoken');

const users = [
  { id: 1, usuario: 'sebastiao', password: '01020304' },
  // Adicione mais usuários conforme necessário
];

module.exports = async (req, res) => {
  const { usuario, password } = req.body;

  console.log(usuario, password, process.env.JWT_SECRET);

  const user = users.find(u => u.usuario === usuario && u.password === password);

  console.log(user);

  if (user) {
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Usuário ou senha incorretos!'});
  }
};