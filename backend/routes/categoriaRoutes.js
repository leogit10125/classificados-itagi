const express = require('express');
const router = express.Router();
const db = require('../config/db');

function slugify(texto) {

  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

}

// ===========================
// LISTAR CATEGORIAS
// ===========================

router.get('/', async (req, res) => {

  try {

    console.log("📊 Buscando categorias...");

    const [categoriasBanco] = await db.query(`
      SELECT
        categoria,
        COUNT(*) AS total_anuncios
      FROM anuncios
      GROUP BY categoria
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

    console.log(resultado);

    res.json(resultado);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      erro: 'Erro ao carregar categorias'
    });

  }

});


// ===========================
// ANÚNCIOS POR CATEGORIA
// ===========================

router.get('/:categoria', async (req, res) => {

  try {

    const categoria = req.params.categoria;

    const [todos] = await db.query(`
      SELECT
        a.*,
        u.nome AS usuario_nome,
        u.telefone
      FROM anuncios a
      LEFT JOIN usuarios u
        ON a.usuario_id = u.id
      ORDER BY a.id DESC
    `);

    const anuncios = todos.filter(anuncio =>
      slugify(anuncio.categoria) === categoria
    );

    anuncios.forEach(anuncio => {

      anuncio.preco = Number(anuncio.preco);

      try {

        anuncio.imagens = anuncio.imagens
          ? JSON.parse(anuncio.imagens)
          : [];

      } catch {

        anuncio.imagens = [];

      }

    });

    res.json(anuncios);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      erro: 'Erro ao buscar categoria'
    });

  }

});

module.exports = router;