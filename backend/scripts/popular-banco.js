// Importa a conexão do banco (AJUSTE O CAMINHO!)
const db = require('../config/database-hostinger'); // 👈 MUDA SE PRECISAR!

async function popularBanco() {
  try {
    console.log('🌱 Populando banco de dados...');

    // Verifica se a conexão funciona
    console.log('📡 Testando conexão...');
    
    // Inserir usuários
    console.log('👤 Inserindo usuários...');
    await db.query(`
      INSERT INTO usuarios (nome, email, telefone) VALUES 
      ('Admin', 'admin@email.com', '11999999999'),
      ('João Silva', 'joao@email.com', '11988888888'),
      ('Maria Santos', 'maria@email.com', '11977777777'),
      ('Pedro Oliveira', 'pedro@email.com', '11966666666')
    `);

    // Inserir anúncios
    console.log('📦 Inserindo anúncios...');
    await db.query(`
      INSERT INTO anuncios (titulo, descricao, preco, categoria, usuario_id) VALUES 
      ('Fusca 1978', 'Fusca azul em bom estado, motor original', 15000.00, 'Veículos', 1),
      ('Celular Samsung', 'Samsung Galaxy S21, 128GB, como novo', 2500.00, 'Eletrônicos', 2),
      ('Geladeira Brastemp', 'Geladeira frost free, 400L, branca', 3200.00, 'Eletrodomésticos', 3),
      ('Notebook Dell', 'Core i7, 16GB RAM, SSD 512GB', 4500.00, 'Informática', 4),
      ('Casa para alugar', '3 quartos, 2 suítes, garagem', 2500.00, 'Imóveis', 1),
      ('Violão Takamine', 'Violão acústico, cordas de aço', 1200.00, 'Instrumentos', 2),
      ('PlayStation 5', 'Console seminovo, 2 controles', 3800.00, 'Games', 3),
      ('Bicicleta Caloi', 'Bicicleta aro 29, 21 marchas', 1800.00, 'Esportes', 4),
      ('Sofá 3 lugares', 'Sofá retrátil, cinza, pouco uso', 1500.00, 'Móveis', 1),
      ('Câmera Canon', 'Câmera profissional com lente', 3500.00, 'Eletrônicos', 2)
    `);

    // Verificar resultados
    const [anuncios] = await db.query('SELECT COUNT(*) as total FROM anuncios');
    const [usuarios] = await db.query('SELECT COUNT(*) as total FROM usuarios');
    
    console.log('✅ Banco populado com sucesso!');
    console.log(`📊 Total anúncios: ${anuncios[0].total}`);
    console.log(`👥 Total usuários: ${usuarios[0].total}`);

  } catch (error) {
    console.error('❌ Erro ao popular banco:', error);
  } finally {
    process.exit();
  }
}

popularBanco();