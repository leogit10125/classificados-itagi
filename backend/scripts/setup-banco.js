// backend/scripts/setup-banco.js
const mysql = require('mysql2/promise');

async function setupBanco() {
  let connection;
  
  try {
    console.log('🚀 Iniciando setup do banco de dados...');
    
   // Linha 11 do seu arquivo - Substitua por esta:
   connection = await mysql.createConnection({
     host: 'localhost',
     user: 'root',
     password: '', // Senha vazia (padrão do XAMPP/MariaDB)
     port: 3306
   });
    
    console.log('✅ Conectado ao MySQL');
    
    // Cria o banco se não existir
    await connection.query('CREATE DATABASE IF NOT EXISTS itagi_classificados');
    console.log('✅ Banco "itagi_classificados" verificado/criado');
    
    // Usa o banco
    await connection.query('USE itagi_classificados');
    
    // =====================================
    // CRIAÇÃO DAS TABELAS
    // =====================================
    console.log('\n📦 Criando tabelas...');
    
    // Tabela de usuários
    await connection.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        telefone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabela "usuarios" criada');
    
    // Tabela de anúncios
    await connection.query(`
      CREATE TABLE IF NOT EXISTS anuncios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        descricao TEXT,
        preco DECIMAL(10,2),
        categoria VARCHAR(100),
        localizacao VARCHAR(100) DEFAULT 'Itagi',
        imagens JSON,
        usuario_id INT,
        destaque BOOLEAN DEFAULT FALSE,
        views INT DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ Tabela "anuncios" criada');
    
    // =====================================
    // LIMPEZA DOS DADOS EXISTENTES (opcional)
    // =====================================
    console.log('\n🧹 Limpando dados existentes...');
    await connection.query('DELETE FROM anuncios');
    await connection.query('DELETE FROM usuarios');
    await connection.query('ALTER TABLE usuarios AUTO_INCREMENT = 1');
    await connection.query('ALTER TABLE anuncios AUTO_INCREMENT = 1');
    console.log('✅ Dados antigos removidos');
    
    // =====================================
    // INSERÇÃO DOS DADOS DE TESTE
    // =====================================
    console.log('\n👤 Inserindo usuários...');
    
    // Inserir usuários
    const [usuariosResult] = await connection.query(`
      INSERT INTO usuarios (nome, email, telefone) VALUES 
      ('Leone', 'leone@email.com', '11999999999'),
      ('Admin', 'admin@email.com', '11988888888'),
      ('João Silva', 'joao@email.com', '11977777777'),
      ('Maria Santos', 'maria@email.com', '11966666666')
    `);
    console.log(`✅ ${usuariosResult.affectedRows} usuários inseridos`);
    
    // =====================================
    // INSERIR ANÚNCIOS VARIADOS
    // =====================================
    console.log('\n📢 Inserindo anúncios...');
    
    const anuncios = [
      ['Fusca 1978', 'Fusca azul em bom estado, motor original, documento em dia', 15000.00, 'Veículos', 1],
      ['Celular Samsung', 'Samsung Galaxy S21, 128GB, como novo, com nota fiscal', 2500.00, 'Eletrônicos', 2],
      ['Geladeira Brastemp', 'Geladeira frost free, 400L, branca, pouco uso', 3200.00, 'Eletrodomésticos', 3],
      ['Notebook Dell', 'Core i7, 16GB RAM, SSD 512GB, placa de vídeo dedicada', 4500.00, 'Informática', 4],
      ['Casa para alugar', '3 quartos, 2 suítes, garagem, piscina', 2500.00, 'Imóveis', 1],
      ['PlayStation 5', 'Console seminovo, 2 controles, 5 jogos', 3800.00, 'Games', 2],
      ['Bicicleta Caloi', 'Bicicleta aro 29, 21 marchas, suspensão', 1800.00, 'Esportes', 3],
      ['Sofá 3 lugares', 'Sofá retrátil, cinza, em ótimo estado', 1500.00, 'Móveis', 4],
      ['Câmera Canon', 'Câmera profissional com lente 18-55mm', 3500.00, 'Eletrônicos', 1],
      ['Furadeira', 'Furadeira impacto, 650W, com maleta', 350.00, 'Ferramentas', 2],
      ['Apartamento', 'Apartamento 2 quartos, centro da cidade', 250000.00, 'Imóveis', 3],
      ['Xbox Series S', 'Console digital, 512GB, completo', 2200.00, 'Games', 4],
      ['Smart TV 50"', 'TV 4K, smart, 3 entradas HDMI', 2800.00, 'Eletrônicos', 1],
      ['Mesa de jantar', 'Mesa 6 lugares, vidro, ótimo estado', 800.00, 'Móveis', 2],
      ['Violão', 'Violão acústico, cordas de aço', 600.00, 'Instrumentos', 3]
    ];
    
    for (const anuncio of anuncios) {
      await connection.query(
        'INSERT INTO anuncios (titulo, descricao, preco, categoria, usuario_id) VALUES (?, ?, ?, ?, ?)',
        anuncio
      );
    }
    console.log(`✅ ${anuncios.length} anúncios inseridos`);
    
    // =====================================
    // VERIFICAÇÃO FINAL
    // =====================================
    console.log('\n📊 VERIFICAÇÃO FINAL:');
    
    const [totalUsuarios] = await connection.query('SELECT COUNT(*) as total FROM usuarios');
    const [totalAnuncios] = await connection.query('SELECT COUNT(*) as total FROM anuncios');
    const [totalCategorias] = await connection.query('SELECT COUNT(DISTINCT categoria) as total FROM anuncios');
    
    console.log(`👥 Usuários: ${totalUsuarios[0].total}`);
    console.log(`📦 Anúncios: ${totalAnuncios[0].total}`);
    console.log(`🏷️ Categorias: ${totalCategorias[0].total}`);
    
    // Mostrar alguns exemplos
    const [exemplos] = await connection.query('SELECT titulo, preco, categoria FROM anuncios LIMIT 5');
    console.log('\n📋 Exemplos de anúncios:');
    exemplos.forEach((a, i) => {
      console.log(`   ${i+1}. ${a.titulo} - R$ ${a.preco} (${a.categoria})`);
    });
    
    console.log('\n✅✅✅ SETUP CONCLUÍDO COM SUCESSO! ✅✅✅');
    console.log('Acesse: http://localhost:5000/api/stats');
    
  } catch (error) {
    console.error('\n❌❌❌ ERRO DURANTE SETUP ❌❌❌');
    console.error('Mensagem:', error.message);
    console.error('Detalhes:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Conexão fechada');
    }
    process.exit();
  }
}

// Executar o setup
setupBanco();