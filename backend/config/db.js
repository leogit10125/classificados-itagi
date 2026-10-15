const mysql = require('mysql2/promise');

// Pool de conexões usando as variáveis de ambiente do Docker
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'itagi_classificados',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Teste de conexão inicial simplificado
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('🚀 [Banco de Dados] Conectado ao MariaDB com sucesso!');
    connection.release();
  } catch (error) {
    console.error('❌ [Banco de Dados] Erro ao conectar no MariaDB:', error.message);
  }
};

// Executa o teste assim que o arquivo é importado pelo backend
testConnection();

module.exports = pool;