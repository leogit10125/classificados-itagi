// backend/middleware/auth.js
const db = require('../config/database-hostinger');

module.exports = async (req, res, next) => {
  try {
    console.log('🔍 Auth middleware - Headers:', req.headers.authorization);
    
    // Pegar token do header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // Verificar se token existe
    if (!token) {
      console.log('❌ Token não fornecido');
      return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    }

    console.log('🔍 Token recebido:', token.substring(0, 30) + '...');

    // Decodificar token base64 (formato: email:timestamp)
    const decoded = Buffer.from(token, 'base64').toString();
    const email = decoded.split(':')[0];
    
    console.log('📧 Email decodificado:', email);

    // Buscar usuário no banco
    const users = await db.query('SELECT id, nome, email FROM usuarios WHERE email = ?', [email]);
    
    if (!users || users.length === 0) {
      console.log('❌ Usuário não encontrado');
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }
    
    const user = users[0];
    console.log('✅ Usuário autenticado:', user.nome);
    
    // Adicionar usuário à requisição
    req.usuario = {
      id: user.id,
      email: user.email,
      nome: user.nome
    };
    
    next();
  } catch (error) {
    console.error('❌ Erro na verificação do token:', error.message);
    res.status(401).json({ error: 'Token inválido: ' + error.message });
  }
};