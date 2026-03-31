const express = require('express');
const router = express.Router();
const db = require('../config/database-hostinger');

// Listar categorias com contagem de anúncios
router.get('/', async (req, res) => {
  try {
    console.log('📊 Buscando categorias...');
    
    const query = `
      SELECT 
        categoria,
        COUNT(*) as total_anuncios
      FROM anuncios
      WHERE status = 'active' OR status IS NULL
      GROUP BY categoria
      ORDER BY total_anuncios DESC
    `;
    
    const categorias = await db.query(query);
    
    // Se quiser incluir categorias sem anúncios (para mostrar 0)
    const todasCategorias = [
      'Vendas', 'Serviços', 'Imóveis', 'Empregos', 
      'Veículos', 'Eletrônicos', 'Eletrodomésticos', 
      'Informática', 'Moda', 'Esportes', 'Outros'
    ];
    
    // Mapear resultados
    const resultado = todasCategorias.map(nome => {
      const encontrada = categorias.find(c => 
        c.categoria?.toLowerCase() === nome.toLowerCase()
      );
      return {
        nome,
        slug: nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
        total: encontrada ? encontrada.total_anuncios : 0
      };
    });
    
    console.log('✅ Categorias encontradas:', resultado);
    res.json(resultado);
    
  } catch (error) {
    console.error('❌ Erro ao buscar categorias:', error);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
});

// Listar anúncios por categoria
router.get('/:categoria', async (req, res) => {
  try {
    const { categoria } = req.params;
    
    const query = `
      SELECT a.*, u.nome as usuario_nome, u.telefone
      FROM anuncios a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      WHERE LOWER(a.categoria) = LOWER(?)
      ORDER BY a.created_at DESC
    `;
    
    const anuncios = await db.query(query, [categoria]);
    res.json(anuncios);
    
  } catch (error) {
    console.error('❌ Erro:', error);
    res.status(500).json({ error: 'Erro ao buscar anúncios da categoria' });
  }
});

module.exports = router;