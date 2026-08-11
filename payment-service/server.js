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
  return res.json({ status: 'Payment Service rodando liso!' });
});

// Processar pagamento de um pedido
app.post('/payments', async (req, res) => {
  const { order_id, amount, payment_method } = req.body;
  try {
    // Registra o pagamento como APROVADO
    const result = await pool.query(
      'INSERT INTO payments (order_id, amount, payment_method, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [order_id, amount, payment_method || 'PIX', 'APROVADO']
    );

    // Atualiza o status do pedido para 'PAGO' na tabela de pedidos
    await pool.query('UPDATE orders SET status = $1 WHERE id = $2', ['PAGO', order_id]);

    return res.status(201).json({
      message: 'Pagamento processado com sucesso!',
      payment: result.rows[0]
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao processar pagamento: ' + error.message });
  }
});

const PORT = 3004;
app.listen(PORT, () => {
  console.log(`🚀 Payment Service rodando na porta ${PORT}`);
});