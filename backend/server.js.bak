// =====================================
// IMPORTS
// =====================================
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// =====================================
// CONFIGURAÇÃO INICIAL
// =====================================
dotenv.config();

// Debug das configurações no terminal do Docker
console.log('📦 Configuração carregada:');
console.log(`   DB_HOST: ${process.env.DB_HOST}`);
console.log(`   DB_NAME: ${process.env.DB_NAME}`);

// =====================================
// CRIAÇÃO DO APP (tem que vir ANTES de usar app.use)
// =====================================
const app = express();  // ✅ APP CRIADO AQUI

// =====================================
// CONEXÃO COM BANCO
// =====================================
const db = require('./config/database-hostinger');

// =====================================
// IMPORTS DAS ROTAS (depois do app, mas antes de usar)
// =====================================
const authRoutes = require('./routes/authRoutes');
const adRoutes = require('./routes/adRoutes');
const statsRoutes = require('./routes/statsRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');  // ✅ IMPORT CORRETO

// =====================================
// MIDDLEWARES
// =====================================
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =====================================
// ROTAS DA API (agora app já existe!)
// =====================================

// Rota de categorias (NOVA)
if (categoriaRoutes && typeof categoriaRoutes === 'function') {
    app.use('/api/categorias', categoriaRoutes);  // ✅ AGORA FUNCIONA
}

if (authRoutes && typeof authRoutes === 'function') {
    app.use('/api/auth', authRoutes);
}

if (adRoutes && typeof adRoutes === 'function') {
    app.use('/api/ads', adRoutes);
}

// Rota de estatísticas
if (statsRoutes && typeof statsRoutes === 'function') {
    app.use('/api', statsRoutes);
}

// =====================================
// ROTAS DE TESTE E STATUS
// =====================================
app.get('/api/status', (req, res) => {
  res.json({
    servidor: 'online',
    banco: 'MariaDB',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test', async (req, res) => {
  try {
    const usuarios = await db.query('SELECT COUNT(*) as total FROM usuarios');
    res.json({ status: '✅ Conexão OK', total_usuarios: usuarios[0].total });
  } catch (error) {
    res.status(500).json({ error: 'Erro no banco', detalhes: error.message });
  }
});

// =====================================
// INICIA SERVIDOR
// =====================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em: http://localhost:${PORT}`);
});