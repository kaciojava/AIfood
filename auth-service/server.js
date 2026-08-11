const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta_jwt_2026';

// Conexão com o Postgres do Docker no Codespaces
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'delivery_db',
  password: 'postgrespassword',
  port: 5432,
});

app.get('/health', (req, res) => {
  return res.json({ status: 'Auth Service rodando liso com PostgreSQL!' });
});

// Cadastrar novo usuário
app.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role',
      [email, hashedPassword, role || 'CLIENTE']
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao registrar: ' + error.message });
  }
});

// Autenticar usuário
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { user_id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ error: 'Erro no servidor: ' + error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Auth Service rodando na porta ${PORT}`);
});