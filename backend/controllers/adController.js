// backend/controllers/adController.js
const db = require('../config/db');
const multer = require('multer');
const path = require('path');

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'ad-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Apenas imagens são permitidas'));
  }
});

// Middleware para upload de até 5 imagens
exports.uploadImages = upload.array('imagens', 5);

// GET todos os anúncios
exports.getAllAds = async (req, res) => {
  try {
    // 💡 Adicionado colchetes [ads] para desestruturar as linhas
    const [ads] = await db.query(`
      SELECT a.*, u.nome as usuario_nome, u.telefone
      FROM anuncios a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      ORDER BY a.criado_em DESC
    `);
    
    const processedAds = await Promise.all(ads.map(async (ad) => {
      // 💡 Desestruturado [imagens]
      const [imagens] = await db.query(
        'SELECT id, imagem_path, ordem FROM anuncio_images WHERE anuncio_id = ? ORDER BY ordem',
        [ad.id]
      );
      
      const imagensArray = imagens.map(img => ({
        id: img.id,
        path: img.imagem_path,
        url: `http://localhost:3000/uploads/${img.imagem_path}` // Ajustado para porta 3000 do container backend
      }));
      
      let jsonImagens = [];
      try {
        if (ad.imagens && typeof ad.imagens === 'string' && ad.imagens.trim() !== "") {
          jsonImagens = JSON.parse(ad.imagens);
        }
      } catch (e) { 
        jsonImagens = []; 
      }
      
      return { 
        ...ad, 
        imagens: imagensArray.length > 0 ? imagensArray : jsonImagens 
      };
    }));
    
    res.json(processedAds);
  } catch (error) {
    console.error('❌ Erro real no banco:', error.message);
    res.status(500).json({ error: 'Erro ao carregar anúncios' });
  }
};

// GET anúncio por ID
exports.getAdById = async (req, res) => {
  try {
    const [ads] = await db.query('SELECT * FROM anuncios WHERE id = ?', [req.params.id]);
    if (ads.length === 0) return res.status(404).json({ error: 'Não encontrado' });
    
    const ad = ads[0];
    
    const [imagens] = await db.query(
      'SELECT id, imagem_path, ordem FROM anuncio_images WHERE anuncio_id = ? ORDER BY ordem',
      [ad.id]
    );
    
    const imagensArray = imagens.map(img => ({
      id: img.id,
      path: img.imagem_path,
      url: `http://localhost:3000/uploads/${img.imagem_path}`
    }));
    
    let jsonImagens = [];
    try { 
      if (ad.imagens) jsonImagens = JSON.parse(ad.imagens); 
    } catch (e) { 
      jsonImagens = []; 
    }
    
    res.json({ 
      ...ad, 
      imagens: imagensArray.length > 0 ? imagensArray : jsonImagens 
    });
    
  } catch (error) { 
    console.error('❌ Erro ao buscar anúncio:', error);
    res.status(500).json({ error: 'Erro ao buscar' }); 
  }
};

// POST - Criar novo anúncio
exports.createAd = async (req, res) => {
  try {
    const usuarioId = req.usuario?.id;
    if (!usuarioId) return res.status(401).json({ error: 'Usuário não autenticado' });

    const { titulo, descricao, preco, categoria, localizacao } = req.body;
    
    if (!titulo || !descricao || !preco || !categoria || !localizacao) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // 💡 Desestruturado [result]
    const [result] = await db.query(
      `INSERT INTO anuncios 
       (titulo, descricao, preco, categoria, localizacao, usuario_id, criado_em, status) 
       VALUES (?, ?, ?, ?, ?, ?, NOW(), 'ativo')`,
      [titulo, descricao, parseFloat(preco), categoria, localizacao, usuarioId]
    );

    const anuncioId = result.insertId;

    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        await db.query(
          'INSERT INTO anuncio_images (anuncio_id, imagem_path, ordem) VALUES (?, ?, ?)',
          [anuncioId, file.filename, i]
        );
      }
    }

    res.status(201).json({ success: true, id: anuncioId, message: 'Anúncio criado com sucesso' });
  } catch (error) {
    console.error('❌ Erro ao criar anúncio:', error);
    res.status(500).json({ error: 'Erro interno ao criar anúncio', details: error.message });
  }
};

// PUT - Atualizar anúncio
exports.updateAd = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descricao, preco, categoria, localizacao } = req.body;
    const usuarioId = req.usuario?.id;

    const [ads] = await db.query('SELECT * FROM anuncios WHERE id = ?', [id]);
    if (ads.length === 0) return res.status(404).json({ error: 'Anúncio não encontrado' });
    if (ads[0].usuario_id !== usuarioId) return res.status(403).json({ error: 'Sem permissão' });

    await db.query(
      `UPDATE anuncios SET titulo = ?, descricao = ?, preco = ?, categoria = ?, localizacao = ?, atualizado_em = NOW() WHERE id = ?`,
      [titulo, descricao, parseFloat(preco), categoria, localizacao, id]
    );

    if (req.files && req.files.length > 0) {
      const [ultimaOrdem] = await db.query('SELECT MAX(ordem) as maxOrdem FROM anuncio_images WHERE anuncio_id = ?', [id]);
      let ordem = (ultimaOrdem[0]?.maxOrdem || -1) + 1;
      
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        await db.query('INSERT INTO anuncio_images (anuncio_id, imagem_path, ordem) VALUES (?, ?, ?)', [id, file.filename, ordem + i]);
      }
    }
    res.json({ success: true, message: 'Anúncio atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar anúncio' });
  }
};

// DELETE - Remover anúncio
exports.deleteAd = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario?.id;

    const [ads] = await db.query('SELECT * FROM anuncios WHERE id = ?', [id]);
    if (ads.length === 0) return res.status(404).json({ error: 'Anúncio não encontrado' });
    if (ads[0].usuario_id !== usuarioId && req.usuario?.tipo !== 'admin') {
      return res.status(403).json({ error: 'Sem permissão' });
    }

    await db.query('DELETE FROM anuncio_images WHERE anuncio_id = ?', [id]);
    await db.query('DELETE FROM anuncios WHERE id = ?', [id]);
    res.json({ success: true, message: 'Anúncio removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover anúncio' });
  }
};

// GET anúncios por usuário
exports.getUserAds = async (req, res) => {
  try {
    const usuarioId = req.params.userId || req.usuario?.id;
    const [ads] = await db.query(
      `SELECT a.*, (SELECT COUNT(*) FROM anuncio_images WHERE anuncio_id = a.id) as total_imagens FROM anuncios a WHERE a.usuario_id = ? ORDER BY a.criado_em DESC`,
      [usuarioId]
    );
    res.json(ads);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar anúncios' });
  }
};