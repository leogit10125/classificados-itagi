// backend/config/database-hostinger.js
const mariadb = require('mariadb');

// Pool de conexões - VERSÃO CORRIGIDA
const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'mysql', // ← IMPORTANTE: no Docker é 'mysql', não 'localhost'
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'itagi_classificados',
  connectionLimit: 5,
  acquireTimeout: 30000,
  
  // 👇 CORREÇÃO DO ERRO SSL
  ssl: false,
  
  // 👇 FORÇAR AUTENTICAÇÃO TRADICIONAL
  permitLocalInfile: true,
  charset: 'utf8mb4',
  
  // IMPORTANTE: Converter BigInt para Number automaticamente
  insertIdAsNumber: true,
  bigIntAsNumber: true
});

// Testar conexão com mais detalhes
(async () => {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('✅ MariaDB conectado com sucesso!');
    console.log(`📊 Banco: ${process.env.DB_NAME}`);
    console.log(`👤 Usuário: ${process.env.DB_USER}`);
    
    // Teste rápido
    const result = await conn.query('SELECT COUNT(*) as total FROM anuncios');
    console.log(`📦 Anúncios no banco: ${result[0]?.total || 0}`);
    
    conn.release();
  } catch (err) {
    console.error('❌ ERRO - MariaDB não disponível:', err.message);
    console.error('🔍 Detalhes:', err);
    
    // Sugestão automática
    if (err.message.includes('SSL')) {
      console.log('💡 DICA: Adicione "ssl: false" na configuração (já adicionamos!)');
    }
    if (err.message.includes('connect')) {
      console.log('💡 DICA: Verifique se o DB_HOST está correto (no Docker use "mysql")');
    }
  }
})();

// Query helper - retorna array de resultados (converte BigInt automaticamente)
pool.query = async (sql, params) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(sql, params);
    
    // Converter qualquer BigInt restante para Number
    return JSON.parse(JSON.stringify(rows, (key, value) =>
      typeof value === 'bigint' ? Number(value) : value
    ));
  } catch (err) {
    console.error('❌ Erro na query:', err.message);
    console.error('📝 SQL:', sql);
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

// Execute helper - para INSERT, UPDATE, DELETE
pool.execute = async (sql, params) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(sql, params);
    
    return {
      insertId: result.insertId ? Number(result.insertId) : null,
      affectedRows: result.affectedRows || 0
    };
  } catch (err) {
    console.error('❌ Erro no comando:', err.message);
    console.error('📝 SQL:', sql);
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

module.exports = pool;