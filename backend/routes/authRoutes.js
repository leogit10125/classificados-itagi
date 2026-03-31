// Importa dependências necessárias
const express = require('express');          // Framework para criar rotas e servidor
const router = express.Router();             // Cria um roteador específico para autenticação
const bcrypt = require('bcryptjs');          // Biblioteca para criptografar e comparar senhas
const jwt = require('jsonwebtoken');         // Biblioteca para gerar e verificar tokens JWT
const crypto = require('crypto');             // Para gerar tokens aleatórios
const nodemailer = require('nodemailer');     // Para enviar emails

// Conexão com o banco de dados (MariaDB configurado na Hostinger)
const db = require('../config/database-hostinger');

// ---------------- CONFIGURAÇÃO DE EMAIL ----------------
// Configurar transporte de email (use variáveis de ambiente)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ---------------- ROTAS DE AUTENTICAÇÃO ----------------

// 📌 Rota de registro de usuário
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body; // Dados enviados pelo frontend

    console.log('📝 Tentativa de registro:', { name, email });

    // 1. Validação básica
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    // 2. Verifica se já existe usuário com esse email
    const existing = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existing && existing.length > 0) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // 3. Criptografa a senha antes de salvar
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Insere usuário no banco
    const result = await db.execute(
      'INSERT INTO usuarios (nome, email, senha, telefone) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, phone || null]
    );

    const userId = result.insertId; // MariaDB retorna insertId

    // 5. Gera token JWT para autenticação
    const token = jwt.sign(
      { id: userId },
      process.env.JWT_SECRET || 'segredo_temporario_123',
      { expiresIn: '7d' }
    );

    console.log('✅ Usuário criado com ID:', userId);

    // 6. Resposta para o frontend
    res.status(201).json({
      message: 'Usuário criado com sucesso!',
      token,
      user: { id: userId, name, email }
    });

  } catch (error) {
    console.error('❌ Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno no servidor', detalhes: error.message });
  }
});

// 📌 Rota de login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validação
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // 2. Busca usuário no banco
    const users = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (!users || users.length === 0) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const user = users[0];

    // 3. Compara senha digitada com a senha criptografada
    const isMatch = await bcrypt.compare(password, user.senha);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    // 4. Gera token JWT
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'segredo_temporario_123',
      { expiresIn: '7d' }
    );

    console.log('✅ Login bem-sucedido:', user.email);

    // 5. Resposta para o frontend
    res.json({
      token,
      user: {
        id: user.id,
        name: user.nome,
        email: user.email,
        telefone: user.telefone,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({ error: 'Erro interno no servidor', detalhes: error.message });
  }
});

// 📌 Rota para verificar token (útil para manter sessão no frontend)
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Pega token do header

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    // Verifica token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'segredo_temporario_123');

    // Busca dados atualizados do usuário
    const users = await db.query(
      'SELECT id, nome, email, telefone, role FROM usuarios WHERE id = ?', 
      [decoded.id]
    );

    if (!users || users.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ user: users[0] });

  } catch (error) {
    console.error('❌ Erro na verificação do token:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
});

// =======================================================
// 🆕 ROTAS DE RECUPERAÇÃO DE SENHA (NOVAS!)
// =======================================================

// 📌 1. SOLICITAR REDEFINIÇÃO DE SENHA
router.post('/esqueci-senha', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }

    console.log('🔑 Solicitação de redefinição para:', email);

    // Verificar se email existe
    const users = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (!users || users.length === 0) {
      // Por segurança, não informamos que o email não existe
      return res.json({ message: 'Se o email existir, você receberá um link de redefinição' });
    }

    const usuarioId = users[0].id;

    // Gerar token único (32 bytes hex)
    const token = crypto.randomBytes(32).toString('hex');
    const expiraEm = new Date(Date.now() + 3600000); // +1 hora

    // Salvar token no banco (criar tabela se não existir)
    await db.execute(
      `INSERT INTO password_resets (usuario_id, token, expira_em) 
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE token = VALUES(token), expira_em = VALUES(expira_em)`,
      [usuarioId, token, expiraEm]
    );

    // Link para redefinição (ajuste a porta conforme seu frontend)
    const resetLink = `http://localhost:5173/resetar-senha/${token}`;

    // Enviar email
    await transporter.sendMail({
      from: '"Itagi Classificados" <noreply@itagi.com>',
      to: email,
      subject: 'Redefinição de senha',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4361ee;">Redefinir sua senha</h2>
          <p>Você solicitou a redefinição de senha no Itagi Classificados.</p>
          <p>Clique no botão abaixo para criar uma nova senha:</p>
          <a href="${resetLink}" style="display: inline-block; background: #4361ee; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Redefinir senha</a>
          <p>Ou copie este link: <a href="${resetLink}">${resetLink}</a></p>
          <p style="color: #666;">Este link expira em 1 hora.</p>
          <p style="color: #666;">Se não foi você, ignore este email.</p>
        </div>
      `
    });

    console.log('✅ Email enviado para:', email);
    res.json({ message: 'Email enviado com sucesso' });

  } catch (error) {
    console.error('❌ Erro ao solicitar redefinição:', error);
    res.status(500).json({ error: 'Erro ao processar solicitação' });
  }
});

// 📌 2. VERIFICAR SE TOKEN É VÁLIDO
router.get('/resetar-senha/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const resets = await db.query(
      'SELECT * FROM password_resets WHERE token = ? AND expira_em > NOW()',
      [token]
    );

    if (!resets || resets.length === 0) {
      return res.status(400).json({ error: 'Link inválido ou expirado' });
    }

    res.json({ valid: true });

  } catch (error) {
    console.error('❌ Erro ao verificar token:', error);
    res.status(500).json({ error: 'Erro ao verificar token' });
  }
});

// 📌 3. REDEFINIR SENHA (CRIAR NOVA SENHA)
router.post('/resetar-senha/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { senha } = req.body;

    if (!senha || senha.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });
    }

    // Buscar token válido
    const resets = await db.query(
      'SELECT * FROM password_resets WHERE token = ? AND expira_em > NOW()',
      [token]
    );

    if (!resets || resets.length === 0) {
      return res.status(400).json({ error: 'Link inválido ou expirado' });
    }

    const reset = resets[0];

    // Criptografar nova senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    // Atualizar senha do usuário
    await db.execute(
      'UPDATE usuarios SET senha = ? WHERE id = ?',
      [hashedPassword, reset.usuario_id]
    );

    // Remover token usado
    await db.execute('DELETE FROM password_resets WHERE token = ?', [token]);

    console.log('✅ Senha redefinida para usuário ID:', reset.usuario_id);
    res.json({ message: 'Senha alterada com sucesso' });

  } catch (error) {
    console.error('❌ Erro ao redefinir senha:', error);
    res.status(500).json({ error: 'Erro ao redefinir senha' });
  }
});

// 📌 Rota para listar usuários (apenas para teste, não usar em produção)
router.get('/users', async (req, res) => {
  try {
    const users = await db.query('SELECT id, nome, email, telefone, role FROM usuarios LIMIT 10');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exporta o roteador para ser usado no server.js
module.exports = router;