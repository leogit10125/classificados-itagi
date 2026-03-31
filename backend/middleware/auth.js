// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Log para debug
    console.log('🔍 Auth middleware - Headers:', req.headers.authorization);
    
    // Pegar token do header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // Verificar se token existe
    if (!token) {
      console.log('❌ Token não fornecido');
      return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    }

    console.log('🔍 Token recebido:', token.substring(0, 20) + '...');
    console.log('🔍 JWT_SECRET:', process.env.JWT_SECRET ? 'Configurado' : 'Não configurado');

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log('✅ Token válido! Usuário ID:', decoded.id);
    
    // ✅ ALTERAÇÃO: Adicionar objeto usuario completo à requisição
    req.usuario = {
      id: decoded.id,
      email: decoded.email,
      nome: decoded.nome
    };
    
    next();
  } catch (error) {
    console.log('❌ Erro na verificação do token:', error.message);
    res.status(401).json({ error: 'Token inválido: ' + error.message });
  }
};