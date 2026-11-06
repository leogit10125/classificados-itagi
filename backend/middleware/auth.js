// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const db = require('../config/db');

module.exports = async (req, res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET;

  // 🛡️ Trava de segurança: impede requisições se a chave mestra não estiver carregada
  if (!JWT_SECRET) {
    console.error('❌ [AUTH] Erro crítico: JWT_SECRET não configurado.');
    return res.status(500).json({ error: 'Erro de configuração interna de autenticação.' });
  }

  const authHeader = req.headers.authorization;

  // 1. Valida se o cabeçalho Authorization veio no padrão correto
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  if (!token || token.trim() === '') {
    return res.status(401).json({ error: 'Token de autenticação ausente ou malformado.' });
  }

  let decoded;

  // 2. Validação criptográfica do JWT (Sem vazar erros para o cliente)
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (jwtError) {
    if (jwtError.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Sua sessão expirou. Por favor, faça login novamente.',
        code: 'TOKEN_EXPIRED' 
      });
    }

    // Token falsificado, malformado ou assinatura incorreta
    return res.status(401).json({ 
      error: 'Token de autenticação inválido.',
      code: 'INVALID_TOKEN' 
    });
  }

  // 3. Validação do usuário no Banco de Dados
  try {
    const [users] = await db.query(
      'SELECT id, nome, email, telefone, role, anuncios_gratuitos_restantes, pacote_anuncios FROM usuarios WHERE id = ?',
      [decoded.id]
    );

    if (!users || users.length === 0) {
      return res.status(401).json({ error: 'Usuário associado a este token não foi encontrado.' });
    }

    const usuarioAutenticado = users[0];

    // 🛡️ Disponibiliza o usuário nas duas formas mais comuns do Express
    req.usuario = usuarioAutenticado;
    req.user = usuarioAutenticado;

    next();

  } catch (dbError) {
    // 🛡️ Se o MariaDB falhar, o erro é 500 do servidor (e não 401 de token falso!)
    console.error('❌ [AUTH] Falha ao consultar usuário no banco:', dbError.message);
    return res.status(500).json({ error: 'Erro interno ao validar dados da sessão.' });
  }
};