// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const db = require('../config/db');

// ---------------- CONFIGURAÇÃO DE EMAIL ----------------
const emailConfigurado = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Helper para validar formato de e-mail
const isEmailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Helper para criar hash SHA-256 seguro do token de redefinição
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

// ---------------- ROTAS DE AUTENTICAÇÃO ----------------

// 📌 Rota de Registro (Aceita tanto 'nome/senha' quanto 'name/password')
router.post(['/register', '/registro'], async (req, res) => {
  try {
    const nome = req.body.nome || req.body.name;
    const email = req.body.email;
    const senha = req.body.senha || req.body.password;
    const telefone = req.body.telefone || req.body.phone || '';
    const whatsapp_publico = req.body.whatsapp_publico;

    // 1. Validação obrigatória
    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
    }

    if (senha.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
    }

    if (!isEmailValido(email)) {
      return res.status(400).json({ error: 'Formato de e-mail inválido.' });
    }

    const emailLimpo = email.toLowerCase().trim();

    // 2. Verifica se o e-mail já existe
    const [existing] = await db.query('SELECT id FROM usuarios WHERE email = ?', [emailLimpo]);
    if (existing && existing.length > 0) {
      return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
    }

    // 3. Criptografa a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    // 4. Insere no banco com 2 anúncios gratuitos e permissão de WhatsApp
    const [result] = await db.query(
      `INSERT INTO usuarios 
       (nome, email, senha, telefone, anuncios_gratuitos_restantes, whatsapp_publico) 
       VALUES (?, ?, ?, ?, 2, ?)`,
      [
        nome.trim(),
        emailLimpo,
        hashedPassword,
        telefone.trim(),
        whatsapp_publico === true ? 1 : 0
      ]
    );

    const userId = result.insertId;

    // 5. Gera token JWT completo
    const token = jwt.sign(
      { id: userId, email: emailLimpo, nome: nome.trim() },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Usuário registrado com sucesso. ID:', userId);

    res.status(201).json({
      message: 'Usuário criado com sucesso!',
      token,
      user: { id: userId, name: nome.trim(), email: emailLimpo }
    });

  } catch (error) {
    console.error('❌ Erro no registro:', error);
    // 🛡️ Segurança: não expõe detalhes internos de erro do banco
    res.status(500).json({ error: 'Erro interno ao realizar cadastro.' });
  }
});

// 📌 Rota de Login
router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;
    const senha = req.body.senha || req.body.password;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    const emailLimpo = email.toLowerCase().trim();

    // Busca usuário no banco
    const [userRows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [emailLimpo]);
    if (!userRows || userRows.length === 0) {
      return res.status(401).json({ error: 'Email ou senha inválidos.' });
    }

    const user = userRows[0];

    // Compara a senha
    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email ou senha inválidos.' });
    }

    // Gera token JWT com dados essenciais de sessão
    const token = jwt.sign(
      { id: user.id, email: user.email, nome: user.nome },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Login bem-sucedido:', user.email);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.nome,
        nome: user.nome,
        email: user.email,
        telefone: user.telefone,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({ error: 'Erro interno ao realizar login.' });
  }
});

// 📌 Rota para verificar token e restaurar sessão do usuário
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [userRows] = await db.query(
      'SELECT id, nome, email, telefone, role, anuncios_gratuitos_restantes, pacote_anuncios FROM usuarios WHERE id = ?', 
      [decoded.id]
    );

    if (!userRows || userRows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json({ user: userRows[0] });

  } catch (error) {
    console.error('❌ Erro na verificação do token:', error);
    res.status(401).json({ error: 'Token inválido ou sessão expirada.' });
  }
});

// =======================================================
// 🔐 ROTAS DE RECUPERAÇÃO DE SENHA (PADRÃO OWASP)
// =======================================================

// 📌 1. Solicitar redefinição (Aceita '/esqueci-senha' e '/recuperar-senha')
router.post(['/esqueci-senha', '/recuperar-senha'], async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'O email é obrigatório.' });
    }

    const emailLimpo = email.toLowerCase().trim();

    // 🛡️ Segurança: Resposta genérica para evitar enumeração de contas
    const respostaPadrao = { message: 'Se o email estiver cadastrado, você receberá um link de redefinição.' };

    const [userRows] = await db.query('SELECT id, nome FROM usuarios WHERE email = ?', [emailLimpo]);
    if (!userRows || userRows.length === 0) {
      return res.json(respostaPadrao);
    }

    const usuario = userRows[0];

    // Gera token aleatório de 64 caracteres
    const tokenClaro = crypto.randomBytes(32).toString('hex');
    
    // 🛡️ OWASP: Grava no banco apenas o HASH do token (evita roubo se o banco vazar)
    const tokenHash = hashToken(tokenClaro);
    const expiraEm = new Date(Date.now() + 3600000); // 1 hora de validade

    await db.query(
      `INSERT INTO password_resets (usuario_id, token, expira_em) 
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE token = VALUES(token), expira_em = VALUES(expira_em)`,
      [usuario.id, tokenHash, expiraEm]
    );

    const frontendUrl = process.env.FRONTEND_URL || 'https://www.itagiclassificados.com';
    const resetLink = `${frontendUrl}/redefinir-senha?token=${tokenClaro}`;

    if (!emailConfigurado) {
      console.warn('⚠️ EMAIL_USER e EMAIL_PASS não configurados. Link de recuperação:', resetLink);
      return res.json(respostaPadrao);
    }

    await transporter.sendMail({
      from: `"Itagi Classificados" <${process.env.EMAIL_USER}>`,
      to: emailLimpo,
      subject: 'Redefinição de Senha - Itagi Classificados',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #051937;">Recuperação de Senha</h2>
          <p>Olá, <strong>${usuario.nome}</strong>!</p>
          <p>Recebemos uma solicitação para redefinir a sua senha no <strong>Itagi Classificados</strong>.</p>
          <p>Clique no botão abaixo para cadastrar uma nova senha:</p>
          <div style="text-align: center; margin: 25px 0;">
            <a href="${resetLink}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Redefinir Minha Senha</a>
          </div>
          <p style="color: #64748b; font-size: 13px;">Ou copie este link no seu navegador: <br><a href="${resetLink}">${resetLink}</a></p>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 25px;">Este link expira em 1 hora. Se você não solicitou esta alteração, ignore este e-mail com segurança.</p>
        </div>
      `
    });

    console.log('✅ Email de redefinição enviado com sucesso para:', emailLimpo);
    res.json(respostaPadrao);

  } catch (error) {
    console.error('❌ Erro ao solicitar redefinição de senha:', error);
    res.status(500).json({ error: 'Erro ao processar solicitação de recuperação.' });
  }
});

// 📌 2. Verificar se o token é válido
router.get(['/resetar-senha/:token', '/redefinir-senha/:token'], async (req, res) => {
  try {
    const { token } = req.params;
    const tokenHash = hashToken(token);

    const [resets] = await db.query(
      'SELECT id FROM password_resets WHERE token = ? AND expira_em > NOW()',
      [tokenHash]
    );

    if (!resets || resets.length === 0) {
      return res.status(400).json({ error: 'Link de recuperação inválido ou expirado.' });
    }

    res.json({ valid: true });

  } catch (error) {
    console.error('❌ Erro ao verificar token de redefinição:', error);
    res.status(500).json({ error: 'Erro ao validar o link de recuperação.' });
  }
});

// 📌 3. Redefinir a senha (Efetivar nova senha)
router.post(['/resetar-senha/:token', '/redefinir-senha/:token'], async (req, res) => {
  try {
    const { token } = req.params;
    const { senha, novaSenha } = req.body;
    const senhaFinal = novaSenha || senha;

    if (!senhaFinal || senhaFinal.length < 6) {
      return res.status(400).json({ error: 'A nova senha deve ter pelo menos 6 caracteres.' });
    }

    const tokenHash = hashToken(token);

    // Busca o registro com o hash do token dentro do prazo de validade
    const [resetRows] = await db.query(
      'SELECT * FROM password_resets WHERE token = ? AND expira_em > NOW()',
      [tokenHash]
    );

    if (!resetRows || resetRows.length === 0) {
      return res.status(400).json({ error: 'Link de recuperação inválido ou expirado.' });
    }

    const reset = resetRows[0];

    // Criptografa a nova senha com bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senhaFinal, salt);

    // Atualiza a senha do usuário
    await db.query(
      'UPDATE usuarios SET senha = ? WHERE id = ?',
      [hashedPassword, reset.usuario_id]
    );

    // Invalida o token imediatamente para não poder ser reutilizado
    await db.query('DELETE FROM password_resets WHERE usuario_id = ?', [reset.usuario_id]);

    console.log('✅ Senha redefinida com sucesso para o usuário ID:', reset.usuario_id);
    res.json({ message: 'Senha alterada com sucesso! Você já pode entrar com sua nova senha.' });

  } catch (error) {
    console.error('❌ Erro ao redefinir senha:', error);
    res.status(500).json({ error: 'Erro interno ao redefinir a senha.' });
  }
});

module.exports = router;