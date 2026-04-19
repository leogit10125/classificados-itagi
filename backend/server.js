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
// CRIAÇÃO DO APP
// =====================================
const app = express();

// =====================================
// CONEXÃO COM BANCO
// =====================================
const db = require('./config/database-hostinger');

// =====================================
// IMPORTS DAS ROTAS
// =====================================
const authRoutes = require('./routes/authRoutes');
const adRoutes = require('./routes/adRoutes');
const statsRoutes = require('./routes/statsRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');

// =====================================
// MIDDLEWARES
// =====================================
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware para log de todas as requisições (DEBUG)
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

// =====================================
// ROTAS DA API
// =====================================

// Rota de categorias
if (categoriaRoutes && typeof categoriaRoutes === 'function') {
    app.use('/api/categorias', categoriaRoutes);
    console.log('✅ Rota /api/categorias carregada');
}

// Rotas de autenticação
if (authRoutes && typeof authRoutes === 'function') {
    app.use('/api/auth', authRoutes);
    console.log('✅ Rota /api/auth carregada');
}

// Rotas de anúncios (INCLUI /meus-anuncios)
if (adRoutes && typeof adRoutes === 'function') {
    app.use('/api/ads', adRoutes);
    console.log('✅ Rota /api/ads carregada');
}

// Rotas de estatísticas
if (statsRoutes && typeof statsRoutes === 'function') {
    app.use('/api', statsRoutes);
    console.log('✅ Rota /api/stats carregada');
}

// =====================================
// ROTA DE LOGIN (UNIFICADA)
// =====================================
app.post('/api/login', (req, res) => {
  const { email, senha } = req.body;
  console.log('📝 Tentativa de login:', email);
  
  const query = 'SELECT id, nome, email, telefone FROM usuarios WHERE email = ? AND senha = ?';
  
  db.query(query, [email, senha], (err, results) => {
    if (err) {
      console.error('❌ Erro na consulta:', err);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    
    if (results.length > 0) {
      console.log('✅ Login bem sucedido:', email);
      const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
      
      res.json({ 
        success: true, 
        message: 'Login realizado com sucesso!',
        user: results[0],
        token: token
      });
    } else {
      console.log('❌ Falha no login:', email);
      res.status(401).json({ 
        success: false, 
        error: 'Email ou senha inválidos' 
      });
    }
  });
});

// =====================================
// ROTA ESPECÍFICA PARA MEUS ANÚNCIOS
// =====================================
app.get('/api/meus-anuncios', async (req, res) => {
  console.log('🔍 Buscando meus anúncios...');
  
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    console.log('❌ Token não fornecido');
    return res.status(401).json({ 
      success: false, 
      error: 'Não autorizado',
      anuncios: [] 
    });
  }
  
  try {
    const email = Buffer.from(token, 'base64').toString().split(':')[0];
    
    const userQuery = 'SELECT id FROM usuarios WHERE email = ?';
    const users = await db.query(userQuery, [email]);
    
    if (!users || users.length === 0) {
      return res.status(401).json({ 
        success: false, 
        error: 'Usuário não encontrado',
        anuncios: [] 
      });
    }
    
    const userId = users[0].id;
    console.log(`👤 Buscando anúncios do usuário: ${userId}`);
    
    const anunciosQuery = `
      SELECT a.*, c.nome as categoria_nome 
      FROM anuncios a
      LEFT JOIN categorias c ON a.categoria_id = c.id
      WHERE a.usuario_id = ?
      ORDER BY a.created_at DESC
    `;
    
    const anuncios = await db.query(anunciosQuery, [userId]);
    
    console.log(`✅ Encontrados ${anuncios.length} anúncios`);
    
    res.json({
      success: true,
      anuncios: anuncios || [],
      total: anuncios.length
    });
    
  } catch (error) {
    console.error('❌ Erro ao buscar meus anúncios:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor',
      anuncios: [] 
    });
  }
});

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
// MIDDLEWARE PARA ROTAS NÃO ENCONTRADAS (CORRIGIDO)
// =====================================
// IMPORTANTE: Use sem as aspas no '*'
app.use((req, res) => {
  console.log(`❌ Rota não encontrada: ${req.method} ${req.url}`);
  res.status(404).json({ 
    error: 'Rota não encontrada',
    path: req.url 
  });
});

// =====================================
// INICIA SERVIDOR
// =====================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em: http://localhost:${PORT}`);
  console.log(`📋 Rotas disponíveis:`);
  console.log(`   POST /api/login`);
  console.log(`   GET  /api/meus-anuncios`);
  console.log(`   GET  /api/status`);
  console.log(`   GET  /api/test`);
  console.log(`   /api/ads/*`);
  console.log(`   /api/auth/*`);
});