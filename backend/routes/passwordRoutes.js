const express = require('express');
const router = express.Router();
const db = require('../config/database-hostinger');
const crypto = require('crypto');

// Gerar token de recuperação
router.post('/recuperar', async (req, res) => {
  try {
    const { email } = req.body;
    
    console.log('📝 Solicitação de recuperação para:', email);
    
    const [usuario] = await db.query('SELECT id, nome FROM usuarios WHERE email = ?', [email]);
    
    if (!usuario) {
      console.log('❌ Email não encontrado:', email);
      return res.json({ 
        success: true, 
        message: 'Se o email existir, você receberá as instruções de recuperação.' 
      });
    }
    
    console.log('✅ Usuário encontrado:', usuario.nome);
    
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);
    
    await db.query(
      'INSERT INTO recuperacao_senha (usuario_id, token, expires_at) VALUES (?, ?, ?)',
      [usuario.id, token, expiresAt]
    );
    
    const resetLink = `http://localhost:5173/redefinir-senha?token=${token}`;
    console.log(`🔗 Link de recuperação para ${email}: ${resetLink}`);
    
    res.json({ 
      success: true, 
      message: 'Link de recuperação enviado para o email.',
      debugLink: resetLink
    });
    
  } catch (error) {
    console.error('❌ Erro na recuperação:', error);
    res.status(500).json({ error: 'Erro ao processar solicitação' });
  }
});

// Redefinir senha
router.post('/redefinir', async (req, res) => {
  try {
    const { token, novaSenha } = req.body;
    
    console.log('🔑 Tentativa de redefinição com token:', token);
    
    const [recuperacao] = await db.query(
      'SELECT usuario_id FROM recuperacao_senha WHERE token = ? AND expires_at > NOW() AND used = 0',
      [token]
    );
    
    if (!recuperacao) {
      console.log('❌ Token inválido ou expirado');
      return res.status(400).json({ error: 'Token inválido ou expirado' });
    }
    
    console.log('✅ Token válido, redefinindo senha para usuário ID:', recuperacao.usuario_id);
    
    await db.query('UPDATE usuarios SET senha = ? WHERE id = ?', [novaSenha, recuperacao.usuario_id]);
    await db.query('UPDATE recuperacao_senha SET used = 1 WHERE token = ?', [token]);
    
    console.log('✅ Senha redefinida com sucesso!');
    res.json({ success: true, message: 'Senha redefinida com sucesso!' });
    
  } catch (error) {
    console.error('❌ Erro ao redefinir:', error);
    res.status(500).json({ error: 'Erro ao redefinir senha' });
  }
});

module.exports = router;
