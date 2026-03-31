// backend/testar-conexao-detailed.js
require('dotenv').config();
const mariadb = require('mariadb');

async function testarConexao() {
  console.log('🔍 TESTE DETALHADO DE CONEXÃO MARIADB');
  console.log('=' .repeat(50));
  console.log(`📌 Host: ${process.env.DB_HOST}`);
  console.log(`📌 Porta: ${process.env.DB_PORT}`);
  console.log(`📌 Usuário: ${process.env.DB_USER}`);
  console.log(`📌 Banco: ${process.env.DB_NAME}`);
  console.log(`📌 Senha: ${process.env.DB_PASSWORD ? '******' : 'VAZIA'}`);
  console.log('=' .repeat(50));

  // Teste 1: Conexão sem banco específico
  console.log('\n📡 Teste 1: Conectar sem especificar banco...');
  try {
    const conn1 = await mariadb.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });
    console.log('✅ Conexão sem banco: OK');
    
    const result = await conn1.query('SELECT VERSION() as versao');
    console.log(`📊 Versão do servidor: ${result[0].versao}`);
    
    await conn1.end();
  } catch (err) {
    console.error('❌ Erro na conexão sem banco:', err.message);
  }

  // Teste 2: Verificar se o banco existe
  console.log('\n📡 Teste 2: Verificar banco de dados...');
  try {
    const conn2 = await mariadb.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });
    
    const bancos = await conn2.query('SHOW DATABASES');
    const bancoExiste = bancos.some(b => Object.values(b)[0] === process.env.DB_NAME);
    
    if (bancoExiste) {
      console.log(`✅ Banco "${process.env.DB_NAME}" existe`);
    } else {
      console.log(`❌ Banco "${process.env.DB_NAME}" NÃO existe`);
      console.log(`   Crie com: CREATE DATABASE ${process.env.DB_NAME};`);
    }
    
    await conn2.end();
  } catch (err) {
    console.error('❌ Erro ao listar bancos:', err.message);
  }

  // Teste 3: Conexão completa
  console.log('\n📡 Teste 3: Conexão completa (com banco)...');
  try {
    const conn3 = await mariadb.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    console.log('✅ Conexão completa: OK');
    
    const tables = await conn3.query('SHOW TABLES');
    console.log(`📋 Tabelas encontradas: ${tables.length}`);
    tables.forEach(t => console.log(`   - ${Object.values(t)[0]}`));
    
    await conn3.end();
  } catch (err) {
    console.error('❌ Erro na conexão completa:', err.message);
  }

  console.log('\n' + '=' .repeat(50));
}

testarConexao();