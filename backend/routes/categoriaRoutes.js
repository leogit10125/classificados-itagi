const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Listar categorias com contagem de anúncios
router.get('/', async (req, res) => {
  try {
    console.log('📊 Buscando categorias...');

    const query = `
      SELECT 
        categoria_slug,
        COUNT(*) as total_anuncios
      FROM anuncios
      WHERE status = 'active' OR status IS NULL
      GROUP BY categoria_slug
    `;

    const [categorias] = await db.query(query);

    const todasCategorias = [
      { nome: 'Vendas', slug: 'vendas' },
      { nome: 'Serviços', slug: 'servicos' },
      { nome: 'Imóveis', slug: 'imoveis' },
      { nome: 'Empregos', slug: 'empregos' },
      { nome: 'Veículos', slug: 'veiculos' },
      { nome: 'Eletrônicos', slug: 'eletronicos' },
      { nome: 'Eletrodomésticos', slug: 'eletrodomesticos' },
      { nome: 'Informática', slug: 'informatica' },
      { nome: 'Moda', slug: 'moda' },
      { nome: 'Esportes', slug: 'esportes' },
      { nome: 'Outros', slug: 'outros' }
    ];

    const resultado = todasCategorias.map(cat => {
      const encontrada = categorias.find(
        c => c.categoria_slug === cat.slug
      );

      return {
        nome: cat.nome,
        slug: cat.slug,
        total: encontrada ? Number(encontrada.total_anuncios) : 0
      };
    });

    res.json(resultado);

  } catch (error) {
    console.error('❌ Erro ao buscar categorias:', error);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
});
// Listar anúncios por categoria
// Listar anúncios por categoria
router.get('/:categoria', async (req, res) => {
  try {

    const { categoria } = req.params;

    const query = `
      SELECT
        a.*,
        u.nome AS usuario_nome,
        u.telefone
      FROM anuncios a
      LEFT JOIN usuarios u
        ON a.usuario_id = u.id
      WHERE a.categoria_slug = ?
      ORDER BY a.criado_em DESC
    `;

    const [anuncios] = await db.query(query, [categoria]);

    const anunciosProcessados = anuncios.map(ad => ({
      ...ad,
      preco: parseFloat(ad.preco) || 0,
      imagens: (() => {
        try {
          return ad.imagens ? JSON.parse(ad.imagens) : [];
        } catch {
          return [];
        }
      })()
    }));

    res.json(anunciosProcessados);

  } catch (error) {

    console.error("❌ Erro:", error);

    res.status(500).json({
      error: "Erro ao buscar anúncios da categoria"
    });

  }
});

module.exports = router;