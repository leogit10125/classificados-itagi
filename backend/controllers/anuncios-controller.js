// backend/controllers/anuncios-controller.js
const pool = require('../config/db');
const anuncioService = require('../services/anuncioService');

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

    if (!req.usuarioId) {
      return res.status(401).json({
        erro: 'Usuário não autenticado'
      });
    }

    const anuncio = await anuncioService.criarAnuncio(
      req.body,
      req.files,
      req.usuarioId
    );

    return res.status(201).json({
      status: 'sucesso',
      id: anuncio.id,
      imagens: anuncio.imagens
    });

  } catch (error) {
    console.error('❌ Erro ao criar anúncio:', error);

    return res.status(500).json({
      erro: error.message
    });
  }
}

module.exports = {
  listarAnuncios,
  buscarAnuncio,
  criarAnuncio
};