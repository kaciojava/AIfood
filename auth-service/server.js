const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'chave_super_secreta_para_dev';

// Rota para testar se o serviço tá vivo
app.get('/health', (req, res) => {
  return res.json({ status: 'Auth Service rodando liso!' });
});

// Rota fake de login para validar o fluxo de JWT
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Mock temporário enquanto não conecta no PostgreSQL
  if (email === 'cliente@email.com' && password === '123456') {
    const token = jwt.sign(
      { user_id: '123', email, role: 'CLIENTE' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({ token });
  }

  return res.status(401).json({ error: 'Credenciais inválidas' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Auth Service rodando na porta ${PORT}`);
});