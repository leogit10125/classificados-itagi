// backend/config/db.js
const mysql = require('mysql2');

// Criar pool de conexões (mais eficiente)
const pool = mysql.createPool({
  host: '127.0.0.1',        // ALTERADO: usar IPv4 explícito
  user: 'root',             // No seu PC local é 'root' (sem senha)
  password: '',             // No XAMPP/WAMP é vazio
  database: 'itagi_db',     // Nome do banco que vamos criar
  port: 3307,               // ADICIONADO: porta do seu XAMPP
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Transformar pool em Promise (para usar async/await)
const promisePool = pool.promise();

// Função para testar conexão e criar tabelas
const initDatabase = async () => {
  try {
    // Testar conexão
    const connection = await promisePool.getConnection();
    console.log('✅ Conectado ao MySQL na porta 3307!');
    
    // Criar banco de dados se não existir
    await promisePool.query('CREATE DATABASE IF NOT EXISTS itagi_db');
    await promisePool.query('USE itagi_db');
    
    // Criar tabela de usuários
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        telefone VARCHAR(20),
        role VARCHAR(20) DEFAULT 'user',
        creditos INT DEFAULT 0,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Criar tabela de anúncios
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS anuncios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(200) NOT NULL,
        descricao TEXT,
        preco DECIMAL(10,2) NOT NULL,
        categoria VARCHAR(50) NOT NULL,
        localizacao VARCHAR(100) NOT NULL,
        imagens TEXT,  // Vamos guardar JSON com URLs
        destaque BOOLEAN DEFAULT FALSE,
        destaque_ate DATE,
        views INT DEFAULT 0,
        usuario_id INT,
        status VARCHAR(20) DEFAULT 'active',
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
      )
    `);
    
    // Criar tabela de pagamentos
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS pagamentos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        anuncio_id INT,
        plano VARCHAR(50),
        valor DECIMAL(10,2),
        status VARCHAR(50) DEFAULT 'pending',
        metodo VARCHAR(50),
        transacao_id VARCHAR(100),
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
        FOREIGN KEY (anuncio_id) REFERENCES anuncios(id)
      )
    `);
    
    console.log('✅ Tabelas criadas/verificadas com sucesso!');
    connection.release();
    return promisePool;
  } catch (error) {
    console.error('❌ Erro no banco de dados:', error);
    throw error;
  }
};

module.exports = { promisePool, initDatabase };