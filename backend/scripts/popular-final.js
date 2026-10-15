const mysql = require('mysql2');

// Configuração com opções de autenticação
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Sua senha (provavelmente vazia)
  database: 'itagi_classificados',
  port: 3306,
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from('')
  }
});

console.log('🔄 Conectando ao banco...');

connection.connect((err) => {
  if (err) {
    console.error('❌ Erro de conexão:', err);
    console.log('\n💡 Tentando método alternativo...');
    
    // Segunda tentativa com parâmetros diferentes
    const conn2 = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'itagi_classificados',
      port: 3306,
      authSwitchHandler: (data, cb) => {
        cb(null, Buffer.from(''));
      }
    });
    
    conn2.connect((err2) => {
      if (err2) {
        console.error('❌ Também falhou:', err2);
        console.log('\n📌 SOLUÇÃO: Vamos mudar a autenticação do banco');
        return;
      }
      
      console.log('✅ Conectado! Inserindo dados...');
      inserirDados(conn2);
    });
  } else {
    console.log('✅ Conectado! Inserindo dados...');
    inserirDados(connection);
  }
});

function inserirDados(conn) {
  // Primeiro, criar tabelas se não existirem
  conn.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      telefone VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  conn.query(`
    CREATE TABLE IF NOT EXISTS anuncios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      titulo VARCHAR(255) NOT NULL,
      descricao TEXT,
      preco DECIMAL(10,2),
      categoria VARCHAR(100),
      usuario_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )
  `);
  
  // Limpar dados existentes
  conn.query('DELETE FROM anuncios');
  conn.query('DELETE FROM usuarios');
  
  // Inserir usuários
  conn.query(`
    INSERT INTO usuarios (nome, email, telefone) VALUES 
    ('Admin', 'admin@email.com', '11999999999'),
    ('João Silva', 'joao@email.com', '11988888888'),
    ('Maria Santos', 'maria@email.com', '11977777777'),
    ('Pedro Oliveira', 'pedro@email.com', '11966666666')
  `, (err) => {
    if (err) console.error('Erro usuários:', err);
    else console.log('✅ Usuários inseridos');
  });
  
  // Inserir anúncios
  conn.query(`
    INSERT INTO anuncios (titulo, descricao, preco, categoria, usuario_id) VALUES 
    ('Fusca 1978', 'Fusca azul em bom estado', 15000.00, 'Veículos', 1),
    ('Celular Samsung', 'Samsung Galaxy S21', 2500.00, 'Eletrônicos', 2),
    ('Geladeira Brastemp', 'Frost free', 3200.00, 'Eletrodomésticos', 3),
    ('Notebook Dell', 'Core i7, 16GB', 4500.00, 'Informática', 1),
    ('Casa para alugar', '3 quartos', 2500.00, 'Imóveis', 2),
    ('PlayStation 5', 'Console', 3800.00, 'Games', 3),
    ('Bicicleta Caloi', 'Aro 29', 1800.00, 'Esportes', 4),
    ('Sofá 3 lugares', 'Retrátil', 1500.00, 'Móveis', 1)
  `, (err) => {
    if (err) console.error('Erro anúncios:', err);
    else console.log('✅ Anúncios inseridos');
  });
  
  // Verificar resultados
  setTimeout(() => {
    conn.query('SELECT COUNT(*) as total FROM usuarios', (err, result) => {
      console.log(`📊 Total usuários: ${result[0].total}`);
    });
    
    conn.query('SELECT COUNT(*) as total FROM anuncios', (err, result) => {
      console.log(`📊 Total anúncios: ${result[0].total}`);
      conn.end();
    });
  }, 1000);
}