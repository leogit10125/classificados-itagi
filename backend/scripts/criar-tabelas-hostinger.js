
// backend/scripts/criar-tabelas-hostinger.js
const mariadb = require('mariadb');

// 🔑 COLE SUA SENHA AQUI
const SUA_SENHA = 'lgc101225@'; // ← ALTERE ESTA LINHA!

async function criarTabelas() {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║   🚀 CRIANDO TABELAS NO MARIADB (MODO HOSTINGER)         ║
╚══════════════════════════════════════════════════════════╝
  `);

  let conn;
  
  try {
    // Conectar ao MariaDB
    conn = await mariadb.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: SUA_SENHA
    });
    
    console.log('✅ Conectado ao MariaDB com sucesso!\n');

    // Criar banco de dados
    console.log('📦 Criando banco de dados...');
    await conn.query('CREATE DATABASE IF NOT EXISTS itagi_classificados');
    console.log('✅ Banco "itagi_classificados" verificado/criado\n');

    // Usar o banco
    await conn.query('USE itagi_classificados');

    // Criar tabela usuarios
    console.log('📦 Criando tabela: usuarios...');
    await conn.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        telefone VARCHAR(20),
        role VARCHAR(20) DEFAULT 'user',
        creditos INT DEFAULT 0,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabela "usuarios" criada\n');

    // Criar tabela anuncios
    console.log('📦 Criando tabela: anuncios...');
    await conn.query(`
      CREATE TABLE IF NOT EXISTS anuncios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(200) NOT NULL,
        descricao TEXT,
        preco DECIMAL(10,2) NOT NULL,
        categoria VARCHAR(50) NOT NULL,
        localizacao VARCHAR(100) NOT NULL,
        imagens JSON,
        destaque BOOLEAN DEFAULT FALSE,
        destaque_ate DATE,
        views INT DEFAULT 0,
        usuario_id INT,
        status VARCHAR(20) DEFAULT 'active',
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
        INDEX idx_categoria (categoria),
        INDEX idx_usuario (usuario_id),
        INDEX idx_destaque (destaque),
        FULLTEXT INDEX idx_busca (titulo, descricao)
      )
    `);
    console.log('✅ Tabela "anuncios" criada\n');

    // Criar tabela pagamentos
    console.log('📦 Criando tabela: pagamentos...');
    await conn.query(`
      CREATE TABLE IF NOT EXISTS pagamentos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        anuncio_id INT,
        plano VARCHAR(50),
        valor DECIMAL(10,2),
        status VARCHAR(20) DEFAULT 'pending',
        metodo VARCHAR(50),
        transacao_id VARCHAR(100),
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
        FOREIGN KEY (anuncio_id) REFERENCES anuncios(id),
        INDEX idx_status (status),
        INDEX idx_usuario (usuario_id)
      )
    `);
    console.log('✅ Tabela "pagamentos" criada\n');

    // Inserir usuário de teste
    console.log('👤 Inserindo usuário de teste...');
    try {
      await conn.query(`
        INSERT INTO usuarios (nome, email, senha, telefone) VALUES 
        ('Admin', 'admin@itagi.com', 'admin123', '71999999999')
      `);
      console.log('✅ Usuário de teste inserido');
    } catch (err) {
      console.log('ℹ️ Usuário de teste já existe (pode ignorar)');
    }

    // Verificar resultados
    const usuarios = await conn.query('SELECT COUNT(*) as total FROM usuarios');
    const anuncios = await conn.query('SELECT COUNT(*) as total FROM anuncios');
    const pagamentos = await conn.query('SELECT COUNT(*) as total FROM pagamentos');

    console.log(`
╔══════════════════════════════════════════════════════════╗
║   📊 RESUMO DA CRIAÇÃO                                    ║
╠══════════════════════════════════════════════════════════╣
║   👥 Usuários: ${usuarios[0].total.toString().padStart(10)}                        ║
║   📰 Anúncios: ${anuncios[0].total.toString().padStart(10)}                        ║
║   💰 Pagamentos: ${pagamentos[0].total.toString().padStart(8)}                        ║
╚══════════════════════════════════════════════════════════╝
    `);

    console.log('✅ BANCO DE DADOS CONFIGURADO COM SUCESSO!');
    console.log('   Agora você já pode rodar o backend normalmente!\n');

  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
    
    if (error.message.includes('Access denied')) {
      console.log('\n🔴 A senha está incorreta!');
      console.log('   Verifique se você digitou a senha correta no script.');
    }
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n🔴 MariaDB não está rodando!');
      console.log('   Abra Services.msc e inicie o serviço "MariaDB"');
    }
    
  } finally {
    if (conn) await conn.end();
  }
}

criarTabelas();