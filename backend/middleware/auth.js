// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const db = require('../config/database-hostinger');

const JWT_SECRET = process.env.JWT_SECRET || 'seu-segredo-super-secreto-2024';

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('🔍 Auth - Header recebido:', authHeader ? 'Sim' : 'Não');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ Token não fornecido');
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  
  const token = authHeader.split(' ')[1];
  console.log('🔍 Token (primeiros 30 chars):', token.substring(0, 30) + '...');
  
  try {
    // Decodificar token JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token decodificado - ID:', decoded.id, 'Email:', decoded.email);
    
    // Buscar usuário no banco
    const users = await db.query('SELECT id, nome, email, telefone FROM usuarios WHERE id = ?', [decoded.id]);
    
    if (!users || users.length === 0) {
      console.log('❌ Usuário não encontrado para ID:', decoded.id);
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }
    
    req.usuario = users[0];
    console.log('✅ Usuário autenticado:', req.usuario.nome);
    next();
    
  } catch (error) {
    console.error('❌ Erro no auth:', error.message);
    res.status(401).json({ error: 'Token inválido: ' + error.message });
  }
};