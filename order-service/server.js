const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

// Conexão com o PostgreSQL do Docker
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'delivery_db',
  password: 'postgrespassword',
  port: 5432,
});

app.get('/health', (req, res) => {
  return res.json({ status: 'Order Service rodando liso!' });
});

// Criar um novo pedido
app.post('/orders', async (req, res) => {
  const { user_id, product_name, quantity, total_price } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO orders (user_id, product_name, quantity, total_price) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, product_name, quantity || 1, total_price]
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar pedido: ' + error.message });
  }
});

// Listar todos os pedidos
app.get('/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`🚀 Order Service rodando na porta ${PORT}`);
});