const bcrypt = require('bcrypt');
const db = require('../config/database-hostinger');

async function hashExistingPasswords() {
  try {
    console.log('🔄 Buscando usuários com senha em texto puro...');
    
    const users = await db.query('SELECT id, senha FROM usuarios');
    
    for (const user of users) {
      // Verificar se a senha já está hash (começa com $2b$)
      if (!user.senha || !user.senha.startsWith('$2b$')) {
        console.log(`🔒 Convertendo senha do usuário ID: ${user.id}`);
        const hashedPassword = await bcrypt.hash(user.senha || '123456', 10);
        await db.query('UPDATE usuarios SET senha = ? WHERE id = ?', [hashedPassword, user.id]);
        console.log(`✅ Usuário ${user.id} atualizado`);
      } else {
        console.log(`⏭️ Usuário ${user.id} já tem senha hash`);
      }
    }
    
    console.log('🎉 Todas as senhas foram convertidas com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

hashExistingPasswords();
