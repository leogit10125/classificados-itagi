// =====================================
// IMPORTS
// =====================================
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');

// =====================================
// CONFIGURAÇÃO INICIAL E AMBIENTE
// =====================================
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Trava de segurança no boot
if (!JWT_SECRET) {
  console.error('❌ ERRO CRÍTICO: JWT_SECRET não configurado nas variáveis de ambiente!');
  process.exit(1);
}

console.log('📦 Configuração carregada:');
console.log(`   DB_HOST: ${process.env.DB_HOST || 'não informado'}`);
console.log(`   DB_NAME: ${process.env.DB_NAME || 'não informado'}`);

// =====================================
// CRIAÇÃO DO APP
// =====================================
const app = express();

// 🛡️ Remove a assinatura "X-Powered-By: Express"
app.disable('x-powered-by');

// 🛡️ CRUCIAL: Identifica o IP real do usuário atrás de Nginx/Cloudflare/Dado Cloud
app.set('trust proxy', 1);

// =====================================
// CONEXÃO COM O BANCO DE DADOS
// =====================================
const db = require('./config/db');

// =====================================
// CABEÇALHOS DE SEGURANÇA HTTP (OWASP DEFENSE)
// =====================================
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});

// =====================================
// CONTROLE DE ACESSO (CORS)
// =====================================
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://www.itagiclassificados.com',
  'https://itagiclassificados.com',
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ========================================================
// 🛡️ SISTEMA COMPLETO DE RATE LIMITING (POR CATEGORIA)
// ========================================================

// 1. LIMITADOR DE LOGIN (Anti-Brute Force inteligente: só bloqueia tentativas COM FALHA!)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5,                   // Bloqueia após 5 tentativas de senha incorreta
  skipSuccessfulRequests: true, // ✅ NÃO penaliza quem acertou a senha!
  standardHeaders: true,
  legacyHeaders: false,
  message: { 
    error: 'Muitas tentativas com senha incorreta. Por segurança, aguarde 15 minutos.' 
  }
});

// 2. LIMITADOR DE CADASTRO (Anti-Spam de contas e bots)
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5,                   // Máximo de 5 contas criadas por IP por hora
  standardHeaders: true,
  legacyHeaders: false,
  message: { 
    error: 'Limite de criação de contas atingido para este endereço. Tente novamente mais tarde.' 
  }
});

// 3. LIMITADOR DE RECUPERAÇÃO DE SENHA (Anti-Spam de e-mails)
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3,                   // Máximo de 3 pedidos de recuperação por hora
  standardHeaders: true,
  legacyHeaders: false,
  message: { 
    error: 'Muitas solicitações de recuperação de senha. Tente novamente em 1 hora.' 
  }
});

// 4. LIMITADOR DE PAGAMENTOS / COMPRA DE CRÉDITOS
const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,                  // Evita flood de chamadas ao Mercado Pago
  standardHeaders: true,
  legacyHeaders: false,
  message: { 
    error: 'Muitas solicitações de pagamento. Aguarde alguns minutos.' 
  }
});

// 5. LIMITADOR GLOBAL DA API (Proteção DoS geral)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas requisições. Tente novamente mais tarde.' }
});

// Aplicação dos limitadores nas rotas correspondentes
app.use('/api/', apiLimiter);
app.use('/api/auth/login', loginLimiter);
app.use('/api/login', loginLimiter);
app.use('/api/auth/registro', registerLimiter);
app.use('/api/registro', registerLimiter);
app.use('/api/recuperar-senha', passwordResetLimiter);
app.use('/api/password/recuperar', passwordResetLimiter);
app.use('/api/pacotes/comprar', checkoutLimiter);

// =====================================
// PARSERS E ARQUIVOS ESTÁTICOS
// =====================================
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Log de requisições
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

// =====================================
// IMPORTS DAS ROTAS MODULARES
// =====================================
const authRoutes = require('./routes/authRoutes');
const adRoutes = require('./routes/adRoutes');
const statsRoutes = require('./routes/statsRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const pacotesRoutes = require('./routes/pacotesRoutes');

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

// =====================================
// ROTAS DE AUTENTICAÇÃO DIRETAS (COMPATIBILIDADE)
// =====================================
app.post('/api/registro', async (req, res) => {
  const { nome, email, senha, telefone, whatsapp_publico } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
  }

  if (senha.length < 6) {
    return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Formato de e-mail inválido.' });
  }

  try {
    const [existingUser] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email já cadastrado.' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const [result] = await db.query(
      `INSERT INTO usuarios
       (nome, email, senha, telefone, anuncios_gratuitos_restantes, whatsapp_publico)
       VALUES (?, ?, ?, ?, 2, ?)`,
      [
        nome.trim(),
        email.toLowerCase().trim(),
        hashedPassword,
        telefone || '',
        whatsapp_publico === true ? 1 : 0
      ]
    );

    console.log('✅ Usuário criado com sucesso:', email);
    res.status(201).json({
      success: true,
      message: 'Cadastro realizado com sucesso!',
      userId: result.insertId
    });
  } catch (error) {
    console.error('❌ Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno ao realizar cadastro.' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  try {
    const [users] = await db.query(
      'SELECT id, nome, email, telefone, senha FROM usuarios WHERE email = ?',
      [email.toLowerCase().trim()]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Email ou senha inválidos.' });
    }

    const user = users[0];
    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (senhaValida) {
      console.log('✅ Login bem-sucedido:', email);

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
      res.status(401).json({ error: 'Email ou senha inválidos.' });
    }
  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({ error: 'Erro interno ao realizar login.' });
  }
});

// =====================================
// ROTA MEUS ANÚNCIOS
// =====================================
app.get('/api/meus-anuncios', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Não autorizado. Faça login novamente.',
      anuncios: []
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const anunciosQuery = `
      SELECT a.*, a.categoria as categoria_nome
      FROM anuncios a
      WHERE a.usuario_id = ?
      ORDER BY a.criado_em DESC
    `;

    const [anuncios] = await db.query(anunciosQuery, [userId]);

    res.json({
      success: true,
      anuncios: anuncios || [],
      total: anuncios.length
    });
  } catch (error) {
    console.error('❌ Erro ao buscar anúncios:', error);
    res.status(401).json({
      success: false,
      error: 'Sessão expirada ou token inválido.',
      anuncios: []
    });
  }
});

// =====================================
// ROTAS DE STATUS E HEALTHCHECK
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
    const [rows] = await db.query('SELECT COUNT(*) as total FROM usuarios');
    const usuarios = rows[0];
    res.json({ status: '✅ Conexão OK', total_usuarios: usuarios?.total || 0 });
  } catch (error) {
    console.error('❌ Erro no teste do banco:', error);
    res.status(500).json({ error: 'Falha ao conectar com o banco de dados.' });
  }
});

// =====================================
// SERVIR O FRONTEND REACT (PRODUÇÃO)
// =====================================
const possibleDistPaths = [
  '/usr/share/nginx/html',
  path.join(__dirname, '../frontend/dist'),
  '/app/frontend/dist'
];

const distPath = possibleDistPaths.find(p => fs.existsSync(p));

if (distPath) {
  console.log(`✅ Servindo frontend React da pasta: ${distPath}`);
  app.use(express.static(distPath));

  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'Endpoint da API não encontrado.' });
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.use('/api', (req, res) => {
    res.status(404).json({ error: 'Endpoint da API não encontrado.' });
  });
}

// ========================================================
// 🛡️ TRATAMENTO CENTRALIZADO DE ERROS (ERROR BOUNDARY)
// ========================================================
app.use((err, req, res, next) => {
  console.error('💥 Erro não tratado na aplicação:', err);
  res.status(err.status || 500).json({
    error: 'Ocorreu um erro interno no servidor. Tente novamente mais tarde.'
  });
});

// =====================================
// INICIALIZAÇÃO DO SERVIDOR
// =====================================
const PORT = process.env.PORT || process.env.BACKEND_PORT || 8080;
const migrarBanco = require('./scripts/migrar-banco');

migrarBanco()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor seguro rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ [MIGRAÇÃO] Falha crítica na inicialização:', error.message);
    process.exit(1);
  });