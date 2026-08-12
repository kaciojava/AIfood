const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'delivery_db',
  password: process.env.DB_PASS || 'postgrespassword',
  port: 5432,
});

app.get('/health', (req, res) => {
  return res.json({ status: 'Order Service rodando liso!' });
});

app.post('/orders', async (req, res) => {
  const { user_id, product_name, quantity, total_price } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO orders (user_id, product_name, quantity, total_price, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, product_name, quantity || 1, total_price, 'CRIADO']
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar pedido: ' + error.message });
  }
});

app.put('/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { new_status } = req.body;

  try {
    const currentStateResult = await pool.query('SELECT status FROM orders WHERE id = $1', [id]);
    const order = currentStateResult.rows[0];

    if (!order) {
      return res.status(404).json({ error: 'Pedido não localizado no registro.' });
    }

    const updateResult = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING id, status, created_at',
      [new_status, id]
    );

    return res.json(updateResult.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: 'Falha na transição de estado: ' + error.message });
  }
});

app.get('/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

const PORT = 3003;

// Condição elegante: Só inicia a porta se não estiver rodando via Jest
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Order Service rodando na porta ${PORT}`);
  });
}

module.exports = app;