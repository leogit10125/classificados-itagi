const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/stats', async (req, res) => {
  try {

    console.log('📊 Buscando estatísticas...');

    const [anuncios] = await db.query(
      'SELECT COUNT(*) AS total FROM anuncios'
    );

    const [usuarios] = await db.query(
      'SELECT COUNT(*) AS total FROM usuarios'
    );

    const [categorias] = await db.query(
      'SELECT COUNT(DISTINCT categoria) AS total FROM anuncios'
    );

    const stats = {
      anuncios: Number(anuncios[0].total),
      usuarios: Number(usuarios[0].total),
      categorias: Number(categorias[0].total)
    };

    console.log("✅ Stats:", stats);

    res.json(stats);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      erro: 'Erro ao carregar estatísticas'
    });

  }
});

module.exports = router;