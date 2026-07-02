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
      anuncios: anuncios[0]?.total || 0,
      usuarios: usuarios[0]?.total || 0,
      categorias: categorias[0]?.total || 0
    };

    console.log('✅ Stats calculados:', stats);

    res.json(stats);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
});
module.exports = router;