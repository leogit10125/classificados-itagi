// backend/controllers/anuncios-controller.js
const pool = require('../config/database-hostinger');

// Listar todos os anúncios
async function listarAnuncios(req, res) {
  try {
    const anuncios = await pool.query(`
      SELECT a.*, u.nome as usuario_nome 
      FROM anuncios a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      ORDER BY a.criado_em DESC
    `);
    
    const resultado = anuncios.map(ad => {
      let imagensArray = [];
      try {
        // Tratamento robusto para garantir que imagens sempre seja um array
        if (ad.imagens) {
          imagensArray = typeof ad.imagens === 'string' ? JSON.parse(ad.imagens) : ad.imagens;
        }
      } catch (e) {
        imagensArray = [];
      }

      return {
        ...ad,
        preco: parseFloat(ad.preco) || 0,
        imagens: Array.isArray(imagensArray) ? imagensArray : []
      };
    });
    
    res.json(resultado);
  } catch (error) {
    console.error('Erro ao listar anúncios:', error);
    res.status(500).json({ erro: error.message });
  }
}

// Buscar um anúncio por ID
async function buscarAnuncio(req, res) {
  try {
    const anuncios = await pool.query(
      'SELECT * FROM anuncios WHERE id = ?',
      [req.params.id]
    );
    
    if (anuncios.length === 0) {
      return res.status(404).json({ erro: 'Anúncio não encontrado' });
    }
    
    const anuncio = anuncios[0];
    try {
      anuncio.imagens = anuncio.imagens ? JSON.parse(anuncio.imagens) : [];
    } catch (e) {
      anuncio.imagens = [];
    }
    
    res.json(anuncio);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

// Criar novo anúncio (ATUALIZADO PARA SALVAR FOTOS AUTOMATICAMENTE)
async function criarAnuncio(req, res) {
  try {
    // 1. Pegar dados do texto
    const { titulo, descricao, preco, categoria, localizacao } = req.body;
    
    // 2. Pegar os nomes dos arquivos que o Multer salvou (Vem do req.files)
    // O map abaixo extrai apenas o nome do arquivo gerado: 'ad-123456789.png'
    const nomesDasImagens = req.files ? req.files.map(file => file.filename) : [];
    
    console.log('📸 Imagens recebidas pelo servidor:', nomesDasImagens);

    // 3. Salvar no banco
    const resultado = await pool.query(
      `INSERT INTO anuncios (titulo, descricao, preco, categoria, localizacao, imagens, usuario_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        titulo, 
        descricao, 
        preco, 
        categoria, 
        localizacao, 
        JSON.stringify(nomesDasImagens), // Salva o array de nomes como STRING JSON
        req.usuarioId || 1 // ID do usuário vindo do token
      ]
    );
    
    res.status(201).json({
      status: 'sucesso',
      id: Number(resultado.insertId),
      imagens: nomesDasImagens
    });
  } catch (error) {
    console.error('❌ Erro ao criar anúncio:', error.message);
    res.status(500).json({ erro: error.message });
  }
}

module.exports = {
  listarAnuncios,
  buscarAnuncio,
  criarAnuncio
};