// =====================================
// IMPORTS
// =====================================
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs'); // 💡 Unificado para bcryptjs para evitar quebras em ambientes Docker/Alpine

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'seu-segredo-super-secreto-2024';

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
// CONEXÃO COM BANCO (ATUALIZADO PARA O NOVO POOL DO DOCKER)
// =====================================
const db = require('./config/db');

// =====================================
// IMPORTS DAS ROTAS
// =====================================
const authRoutes = require('./routes/authRoutes');
const adRoutes = require('./routes/adRoutes');
const statsRoutes = require('./routes/statsRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const pacotesRoutes = require('./routes/pacotesRoutes');
const passwordRoutes = require('./routes/passwordRoutes');

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

if (categoriaRoutes && typeof categoriaRoutes === 'function') {
    app.use('/api/categorias', categoriaRoutes);
    console.log('✅ Rota /api/categorias carregada');
}

if (authRoutes && typeof authRoutes === 'function') {
    app.use('/api/auth', authRoutes);
    console.log('✅ Rota /api/auth carregada');
}

if (adRoutes && typeof adRoutes === 'function') {
    app.use('/api/ads', adRoutes);
    console.log('✅ Rota /api/ads carregada');
}

if (statsRoutes && typeof statsRoutes === 'function') {
    app.use('/api', statsRoutes);
    console.log('✅ Rota /api/stats carregada');
}

if (pacotesRoutes && typeof pacotesRoutes === 'function') {
    app.use('/api/pacotes', pacotesRoutes);
    console.log('✅ Rota /api/pacotes carregada');
}

if (passwordRoutes && typeof passwordRoutes === 'function') {
    app.use('/api/password', passwordRoutes);
    console.log('✅ Rota /api/password carregada');
}

// =====================================
// ROTA DE REGISTRO (AJUSTADA PARA MYSQL2/PROMISE)
// =====================================
app.post('/api/registro', async (req, res) => {
  const { nome, email, senha, telefone } = req.body;
  console.log('📝 Tentativa de registro:', email);
  
  try {
    // [existingUser] desestrutura o retorno pegando apenas as linhas (rows)
    const [existingUser] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }
    
    const hashedPassword = await bcrypt.hash(senha, 10);
    
    // 💡 Regra 3: Desestruturação utilizada no retorno do INSERT
    const [result] = await db.query(
      'INSERT INTO usuarios (nome, email, senha, telefone, anuncios_gratuitos_restantes) VALUES (?, ?, ?, ?, 2)',
      [nome, email, hashedPassword, telefone || '']
    );
    
    console.log('✅ Usuário criado com sucesso:', email);
    res.status(201).json({ 
      success: true, 
      message: 'Cadastro realizado com sucesso!',
      userId: result.insertId
    });
  } catch (error) {
    console.error('❌ Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// =====================================
// ROTA DE LOGIN (AJUSTADA PARA MYSQL2/PROMISE)
// =====================================
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;
  console.log('📝 Tentativa de login:', email);
  
  try {
    const [users] = await db.query('SELECT id, nome, email, telefone, senha FROM usuarios WHERE email = ?', [email]);
    
    if (users.length === 0) {
      console.log('❌ Usuário não encontrado:', email);
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }
    
    // 💡 Regra 2: Busca por apenas um registro utilizando índice [0] de forma segura
    const user = users[0];
    const senhaValida = await bcrypt.compare(senha, user.senha);
    
    if (senhaValida) {
      console.log('✅ Login bem sucedido:', email);
      
      const token = jwt.sign(
        { id: user.id, email: user.email, nome: user.nome },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      res.json({ 
        success: true, 
        message: 'Login realizado com sucesso!',
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          telefone: user.telefone
        },
        token: token
      });
    } else {
      console.log('❌ Senha inválida para:', email);
      res.status(401).json({ error: 'Email ou senha inválidos' });
    }
  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// =====================================
// ROTA ESPECÍFICA PARA MEUS ANÚNCIOS (AJUSTADA PARA MYSQL2/PROMISE)
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
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    
    console.log(`👤 Buscando anúncios do usuário ID: ${userId}`);
    
    // 💡 Regra 5: Corrigido created_at para criado_em e removido JOIN de categoria_id que causava conflito
    const anunciosQuery = `
      SELECT a.*, a.categoria as categoria_nome 
      FROM anuncios a
      WHERE a.usuario_id = ?
      ORDER BY a.criado_em DESC
    `;
    
    const [anuncios] = await db.query(anunciosQuery, [userId]);
    
    console.log(`✅ Encontrados ${anuncios.length} anúncios`);
    
    res.json({
      success: true,
      anuncios: anuncios || [],
      total: anuncios.length
    });
    
  } catch (error) {
    console.error('❌ Erro ao buscar meus anúncios:', error);
    res.status(401).json({ 
      success: false, 
      error: 'Token inválido',
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
    // 💡 Regra 2: Capturando a contagem em formato de registro único de agregação
    const [rows] = await db.query('SELECT COUNT(*) as total FROM usuarios');
    const usuarios = rows[0];
    res.json({ status: '✅ Conexão OK', total_usuarios: usuarios?.total || 0 });
  } catch (error) {
    res.status(500).json({ error: 'Erro no banco', detalhes: error.message });
  }
});

// =====================================
// MIDDLEWARE PARA ROTAS NÃO ENCONTRADAS
// =====================================
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
});