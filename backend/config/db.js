
const mysql = require('mysql2/promise');

const connectionString = process.env.DATABASE_URL;

const pool = connectionString
  ? mysql.createPool(connectionString)
  : mysql.createPool({
      host: process.env.DB_HOST || 'mysql',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'itagi_classificados',
      port: Number(process.env.DB_PORT) || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Banco de dados conectado com sucesso.');
    connection.release();
  } catch (error) {
    console.error('Erro ao conectar ao banco:', error.message);
  }
}

testConnection();

module.exports = pool;
