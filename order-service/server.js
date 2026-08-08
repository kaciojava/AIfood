const express = require('express');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  return res.json({ status: 'Order Service rodando liso!' });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Order Service rodando na porta ${PORT}`);
});