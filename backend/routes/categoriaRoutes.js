// backend/routes/categoriaRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

function slugify(texto) {
  if (!texto) return "";
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

// ===========================
// LISTAR CATEGORIAS E TOTAIS (APENAS ATIVOS)
// ===========================
router.get('/', async (req, res) => {
  try {
    // 🛡️ Performance: Conta apenas anúncios com status 'active' direto no banco
    const [categoriasBanco] = await db.query(`
      SELECT
        LOWER(categoria) AS categoria,
        COUNT(*) AS total_anuncios
      FROM anuncios
      WHERE status = 'active'
      GROUP BY LOWER(categoria)
    `);

    const categorias = [
      { nome: "Vendas", slug: "vendas" },
      { nome: "Serviços", slug: "servicos" },
      { nome: "Imóveis", slug: "imoveis" },
      { nome: "Empregos", slug: "empregos" },
      { nome: "Veículos", slug: "veiculos" },
      { nome: "Eletrônicos", slug: "eletronicos" },
      { nome: "Eletrodomésticos", slug: "eletrodomesticos" },
      { nome: "Informática", slug: "informatica" },
      { nome: "Moda", slug: "moda" },
      { nome: "Esportes", slug: "esportes" },
      { nome: "Outros", slug: "outros" }
    ];

    const resultado = categorias.map(cat => {
      const encontrada = categoriasBanco.find(item =>
        slugify(item.categoria) === cat.slug
      );

      return {
        ...cat,
        total: encontrada ? Number(encontrada.total_anuncios) : 0
      };
    });

    res.json(resultado);

  } catch (err) {
    console.error('❌ [CATEGORIAS] Erro ao carregar categorias:', err.message);
    res.status(500).json({ erro: 'Erro interno ao carregar categorias.' });
  }
});

// ===========================
// ANÚNCIOS POR CATEGORIA (BLINDADO E PARAMETRIZADO)
// ===========================
router.get('/:categoria', async (req, res) => {
  try {
    const categoriaSlug = slugify(req.params.categoria);

    // 🛡️ 1. Otimização Máxima: O MariaDB filtra apenas a categoria solicitada e status ativo
    // 🛡️ 2. LGPD: O telefone só é retornado se o usuário autorizou o WhatsApp público (1)
    const query = `
      SELECT
        a.*,
        u.nome AS usuario_nome,
        CASE WHEN u.whatsapp_publico = 1 THEN u.telefone ELSE NULL END AS telefone,
        u.whatsapp_publico
      FROM anuncios a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      WHERE a.status = 'active'
        AND (LOWER(a.categoria) = ? OR LOWER(REPLACE(a.categoria, ' ', '-')) = ?)
      ORDER BY a.destaque DESC, a.id DESC
    `;

    const [rows] = await db.query(query, [categoriaSlug, categoriaSlug]);

    const anuncios = rows.map(anuncio => {
      let imagensProcessadas = [];
      try {
        if (Array.isArray(anuncio.imagens)) {
          imagensProcessadas = anuncio.imagens;
        } else if (typeof anuncio.imagens === 'string') {
          imagensProcessadas = JSON.parse(anuncio.imagens);
        }
      } catch {
        imagensProcessadas = [];
      }

      return {
        ...anuncio,
        preco: Number(anuncio.preco),
        imagens: Array.isArray(imagensProcessadas) ? imagensProcessadas : []
      };
    });

    res.json(anuncios);

  } catch (err) {
    console.error('❌ [CATEGORIAS] Erro ao buscar anúncios da categoria:', err.message);
    res.status(500).json({ erro: 'Erro interno ao buscar anúncios da categoria.' });
  }
});

module.exports = router;
