const express = require('express');
const router = express.Router();
const db = require('../config/db');
const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/auth');
const checkAdLimit = require('../middleware/checkAdLimit');
const fs = require('fs'); 
const path = require('path'); 
const creditService = require("../services/creditService");

// =====================================
// SLUGIFY (PADRÃO DO SISTEMA)
// =====================================
const slugify = (text) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");

// =====================================
// PROCESSAR IMAGENS
// =====================================
const processarImagens = (imagensRaw) => {
  let imagensArray = [];
  try {
    if (!imagensRaw) return [];
    if (Array.isArray(imagensRaw)) return imagensRaw;

    if (typeof imagensRaw === 'string') {
      if (imagensRaw.startsWith('[')) {
        return JSON.parse(imagensRaw);
      }

      if (imagensRaw.includes(',')) {
        return imagensRaw.split(',').map(i => i.trim());
      }

      return imagensRaw.length > 0 ? [imagensRaw] : [];
    }
  } catch (e) {
    console.error("Erro ao processar imagem:", e.message);
  }
  return imagensArray;
};

// =====================================
// GET TODOS ANÚNCIOS
// =====================================
router.get('/', async (req, res) => {
  try {
    const [anuncios] = await db.query(`
      SELECT a.*, u.nome as usuario_nome, u.telefone
      FROM anuncios a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      ORDER BY a.criado_em DESC
    `);

    const result = anuncios.map(ad => ({
      ...ad,
      preco: parseFloat(ad.preco) || 0,
      imagens: processarImagens(ad.imagens)
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================================
// GET POR CATEGORIA (SLUG)
// =====================================
router.get('/categoria/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const [anuncios] = await db.query(`
      SELECT a.*, u.nome as usuario_nome, u.telefone
      FROM anuncios a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      WHERE a.categoria_slug = ?
      ORDER BY a.criado_em DESC
    `, [slug]);

    const result = anuncios.map(ad => ({
      ...ad,
      preco: parseFloat(ad.preco) || 0,
      imagens: processarImagens(ad.imagens)
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// =====================================
// GET MEUS ANÚNCIOS
// =====================================
router.get('/meus-anuncios', authMiddleware, async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const [anuncios] = await db.query(`
      SELECT *
      FROM anuncios
      WHERE usuario_id = ?
      ORDER BY criado_em DESC
    `, [usuarioId]);

    const resultado = anuncios.map(ad => ({
      ...ad,
      preco: parseFloat(ad.preco) || 0,
      imagens: processarImagens(ad.imagens)
    }));

    res.json({
      success: true,
      anuncios: resultado
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// =====================================
// GET POR ID
// =====================================
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*, u.nome as usuario_nome, u.telefone
      FROM anuncios a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      WHERE a.id = ?
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Não encontrado' });
    }

    const ad = rows[0];

    res.json({
      ...ad,
      preco: parseFloat(ad.preco) || 0,
      imagens: processarImagens(ad.imagens)
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================================
// CRIAR ANÚNCIO
// =====================================
router.post(
  '/',
  authMiddleware,
  checkAdLimit,
  upload.array('imagens', 5),
  async (req, res) => {
    try {
      const usuarioId = req.usuario?.id;
      const { titulo, descricao, preco, categoria, localizacao } = req.body;

      if (!usuarioId) {
        return res.status(401).json({
          error: 'Não autenticado'
        });
      }

      const imagensArray = req.files?.map(file => file.filename) || [];

      // Gera o slug da categoria
      const categoriaSlug = slugify(categoria);

      // Salva o anúncio
      const [result] = await db.query(
        `
        INSERT INTO anuncios
        (
          titulo,
          descricao,
          preco,
          categoria,
          categoria_slug,
          localizacao,
          imagens,
          usuario_id,
          criado_em
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `,
        [
          titulo,
          descricao,
          parseFloat(preco),
          categoria,
          categoriaSlug,
          localizacao,
          JSON.stringify(imagensArray),
          usuarioId
        ]
      );

      // Consome um crédito (gratuito ou pago)
      await creditService.consumirCredito(
        usuarioId,
        req.adType
      );

      return res.status(201).json({
        success: true,
        id: result.insertId,
        categoria_slug: categoriaSlug,
        imagens: imagensArray,
        tipoCredito: req.adType
      });

    } catch (error) {
      console.error('Erro ao criar anúncio:', error);

      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// =====================================
// EDITAR ANÚNCIO
// =====================================
router.put('/:id', authMiddleware, upload.array('imagens', 5), async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario?.id;
    const { titulo, descricao, preco, categoria, localizacao } = req.body;

    const [anuncios] = await db.query('SELECT * FROM anuncios WHERE id = ?', [id]);

    if (anuncios.length === 0) {
      return res.status(404).json({ error: 'Não encontrado' });
    }

    const ad = anuncios[0];

    if (ad.usuario_id !== usuarioId) {
      return res.status(403).json({ error: 'Sem permissão' });
    }

    const imagensArray = req.files?.map(f => f.filename) || [];

    const categoriaSlug = slugify(categoria || ad.categoria);

    await db.query(`
      UPDATE anuncios SET
        titulo = ?,
        descricao = ?,
        preco = ?,
        categoria = ?,
        categoria_slug = ?,
        localizacao = ?,
        imagens = ?
      WHERE id = ?
    `, [
      titulo,
      descricao,
      parseFloat(preco),
      categoria,
      categoriaSlug,
      localizacao,
      JSON.stringify(imagensArray),
      id
    ]);

    res.json({
      success: true,
      categoria_slug: categoriaSlug
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================================
// DELETE ANÚNCIO
// =====================================
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario?.id;

    const [rows] = await db.query('SELECT * FROM anuncios WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Não encontrado' });
    }

    const ad = rows[0];

    if (ad.usuario_id !== usuarioId && req.usuario?.tipo !== 'admin') {
      return res.status(403).json({ error: 'Sem permissão' });
    }

    const imagens = processarImagens(ad.imagens);

    imagens.forEach(img => {
      const filePath = path.join(__dirname, '..', 'uploads', img);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    await db.query('DELETE FROM anuncios WHERE id = ?', [id]);

    res.json({ success: true });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;