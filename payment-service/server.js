const express = require('express');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  return res.json({ status: 'Payment Service rodando liso!' });
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Payment Service rodando na porta ${PORT}`);
});