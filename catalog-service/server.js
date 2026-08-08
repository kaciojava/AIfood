const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  return res.json({ status: 'Catalog Service rodando liso!' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Catalog Service rodando na porta ${PORT}`);
});