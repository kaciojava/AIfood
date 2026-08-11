const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Conexão com o MongoDB rodando no Docker
mongoose.connect('mongodb://localhost:27017/catalog_db')
  .then(() => console.log('🍃 Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar no MongoDB:', err));

// Schema do Produto/Cardápio
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  available: { type: Boolean, default: true }
});

const Product = mongoose.model('Product', ProductSchema);

// Rota de Health Check
app.get('/health', (req, res) => {
  return res.json({ status: 'Catalog Service rodando liso!' });
});

// Listar todos os produtos
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Cadastrar novo produto
app.post('/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json(product);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`🚀 Catalog Service rodando na porta ${PORT}`);
});