const express = require('express');
const router = express.Router();
const db = require('../config/database-hostinger');

router.get('/stats', async (req, res) => {
  try {
    console.log('📊 Buscando estatísticas...');
    
    // Contar anúncios - usando db.query que retorna array diretamente
    const anuncios = await db.query('SELECT COUNT(*) as total FROM anuncios');
    console.log('🔍 Resultado anuncios (raw):', anuncios);
    
    // Contar usuários
    const usuarios = await db.query('SELECT COUNT(*) as total FROM usuarios');
    console.log('🔍 Resultado usuarios (raw):', usuarios);
    
    // Contar categorias distintas
    const categorias = await db.query('SELECT COUNT(DISTINCT categoria) as total FROM anuncios');
    console.log('🔍 Resultado categorias (raw):', categorias);
    
    const stats = {
      anuncios: anuncios[0]?.total || 0,
      usuarios: usuarios[0]?.total || 0,
      categorias: categorias[0]?.total || 0
    };
    
    console.log('✅ Stats calculados:', stats);
    res.json(stats);
    
  } catch (error) {
    console.error('❌ Erro ao buscar stats:', error);
    res.status(500).json({ 
      error: 'Erro interno',
      message: error.message 
    });
  }
});

module.exports = router;