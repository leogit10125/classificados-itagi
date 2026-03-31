// backend/testar-banco.js
require('dotenv').config();
const mysql = require('mysql2/promise');

async function testarConexao() {
    console.log('🔍 Testando conexão com o banco...');
    console.log('📊 Configurações:');
    console.log(`   Host: ${process.env.DB_HOST}`);
    console.log(`   Porta: ${process.env.DB_PORT}`);
    console.log(`   Banco: ${process.env.DB_NAME}`);
    console.log(`   Usuário: ${process.env.DB_USER}`);
    console.log(`   Senha: ${process.env.DB_PASSWORD ? '✅ configurada' : '❌ não configurada'}`);

    try {
        // Criar conexão
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306
        });

        console.log('✅ CONEXÃO BEM-SUCEDIDA!');

        // Testar query simples
        const [tables] = await connection.query('SHOW TABLES');
        console.log(`\n📋 Tabelas encontradas (${tables.length}):`);
        tables.forEach(table => {
            const tableName = Object.values(table)[0];
            console.log(`   - ${tableName}`);
        });

        // Testar tabela anuncios
        try {
            const [anuncios] = await connection.query('SELECT COUNT(*) as total FROM anuncios');
            console.log(`\n📰 Anúncios: ${anuncios[0].total} registros`);
        } catch (e) {
            console.log(`\n⚠️ Tabela 'anuncios' não encontrada ou vazia`);
        }

        // Testar tabela anuncios_images
        try {
            const [imagens] = await connection.query('SELECT COUNT(*) as total FROM anuncios_images');
            console.log(`🖼️ Imagens: ${imagens[0].total} registros`);
        } catch (e) {
            console.log(`⚠️ Tabela 'anuncios_images' não encontrada ou vazia`);
        }

        await connection.end();
        console.log('\n✨ Teste concluído!');

    } catch (error) {
        console.error('\n❌ ERRO DE CONEXÃO:');
        console.error('   Mensagem:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.error('   ➡️ O MySQL/MariaDB não está rodando!');
            console.error('   💡 Inicie o serviço:');
            console.error('      - XAMPP: inicie o MySQL');
            console.error('      - Terminal: sudo systemctl start mysql');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('   ➡️ Usuário ou senha incorretos!');
            console.error('   💡 Verifique DB_USER e DB_PASSWORD no .env');
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            console.error('   ➡️ Banco de dados não existe!');
            console.error(`   💡 Crie o banco: CREATE DATABASE ${process.env.DB_NAME};`);
        }
    }
}

testarConexao();