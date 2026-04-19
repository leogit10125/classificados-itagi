const express = require('express');
const router = express.Router();
const db = require('../config/database-hostinger');
const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/auth');
const fs = require('fs'); 
const path = require('path'); 

// Função auxiliar para processar as imagens
const processarImagens = (imagensRaw) => {
  let imagensArray = [];
  try {
    if (!imagensRaw) return [];
    if (Array.isArray(imagensRaw)) {
      imagensArray = imagensRaw;
    } else if (typeof imagensRaw === 'string') {
      if (imagensRaw.startsWith('[') && imagensRaw.includes('"')) {
        imagensArray = JSON.parse(imagensRaw);
      } else if (imagensRaw.startsWith('[') && imagensRaw.endsWith(']')) {
        const conteudo = imagensRaw.slice(1, -1);
        if (conteudo) imagensArray = [conteudo];
      } else if (imagensRaw.includes(',')) {
        imagensArray = imagensRaw.split(',').map(i => i.trim());
      } else if (imagensRaw.length > 0) {
        imagensArray = [imagensRaw];
      }
    }
  } catch (e) {
    console.error("Erro ao processar imagem:", e.message);
  }
  return imagensArray;
};

// =====================================
// ROTAS PÚBLICAS
// =====================================

// LISTAR TODOS OS ANÚNCIOS (Usado na Home)
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT a.*, u.nome as usuario_nome, u.telefone
      FROM anuncios a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      ORDER BY a.created_at DESC
    `;
    const anuncios = await db.query(query);
    
    const anunciosProcessados = anuncios.map(ad => ({
      ...ad,
      preco: parseFloat(ad.preco) || 0,
      imagens: processarImagens(ad.imagens)
    }));
    
    res.json(anunciosProcessados);
  } catch (error) {
    res.status(500).json({ error: 'Erro no banco', details: error.message });
  }
});

// ✅ ROTA PARA "MEUS ANÚNCIOS" (NOVA)
router.get('/meus-anuncios', authMiddleware, async (req, res) => {
  try {
    console.log('🔍 Buscando anúncios do usuário logado...');
    console.log('👤 Usuário ID:', req.usuario?.id);
    
    const usuarioId = req.usuario?.id;
    
    if (!usuarioId) {
      return res.status(401).json({ 
        success: false, 
        error: 'Usuário não autenticado',
        anuncios: [] 
      });
    }

    const query = `
      SELECT a.*, u.nome as usuario_nome, u.telefone, u.email
      FROM anuncios a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      WHERE a.usuario_id = ?
      ORDER BY a.created_at DESC
    `;
    
    const anuncios = await db.query(query, [usuarioId]);
    
    console.log(`✅ Encontrados ${anuncios.length} anúncios`);
    
    const anunciosProcessados = anuncios.map(ad => ({
      ...ad,
      preco: parseFloat(ad.preco) || 0,
      imagens: processarImagens(ad.imagens)
    }));
    
    res.json({
      success: true,
      anuncios: anunciosProcessados,
      total: anunciosProcessados.length
    });
    
  } catch (error) {
    console.error('❌ Erro ao buscar meus anúncios:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro ao carregar seus anúncios',
      anuncios: [] 
    });
  }
});

// BUSCAR ANÚNCIOS DE UM USUÁRIO ESPECÍFICO
router.get('/usuario/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const query = `SELECT * FROM anuncios WHERE usuario_id = ? ORDER BY created_at DESC`;
    
    const anuncios = await db.query(query, [userId]);
    
    const anunciosProcessados = anuncios.map(ad => ({
      ...ad,
      preco: parseFloat(ad.preco) || 0,
      imagens: processarImagens(ad.imagens)
    }));
    
    res.json(anunciosProcessados);
  } catch (error) {
    console.error("❌ Erro ao buscar anúncios do usuário:", error);
    res.status(500).json({ error: 'Erro ao buscar seus anúncios' });
  }
});

// BUSCAR POR ID (Detalhes do anúncio)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT a.*, u.nome as usuario_nome, u.telefone, u.email
      FROM anuncios a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      WHERE a.id = ?
    `;
    const resultados = await db.query(query, [id]);
    if (resultados.length === 0) return res.status(404).json({ error: 'Não encontrado' });
    
    const ad = resultados[0];
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
// ROTAS PROTEGIDAS
// =====================================

// CRIAR NOVO ANÚNCIO
router.post('/', authMiddleware, upload.array('imagens', 5), async (req, res) => {
  try {
    const usuarioId = req.usuario?.id;
    const { titulo, descricao, preco, categoria, localizacao } = req.body;
    
    if (!usuarioId) return res.status(401).json({ error: 'Usuário não autenticado' });

    let imagensArray = [];
    if (req.files && req.files.length > 0) {
      imagensArray = req.files.map(file => file.filename);
    }

    const result = await db.query(
      `INSERT INTO anuncios 
       (titulo, descricao, preco, categoria, localizacao, imagens, usuario_id, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [titulo, descricao, parseFloat(preco), categoria, localizacao, JSON.stringify(imagensArray), usuarioId]
    );

    res.status(201).json({ success: true, id: result.insertId, imagens: imagensArray });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar anúncio', details: error.message });
  }
});

// DELETAR ANÚNCIO (Com limpeza de arquivos no Docker)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario?.id;

    const anuncios = await db.query('SELECT * FROM anuncios WHERE id = ?', [id]);
    if (anuncios.length === 0) return res.status(404).json({ error: 'Anúncio não encontrado' });

    const ad = anuncios[0];

    if (ad.usuario_id !== usuarioId && req.usuario?.tipo !== 'admin') {
      return res.status(403).json({ error: 'Sem permissão para deletar' });
    }

    const imagensParaDeletar = processarImagens(ad.imagens);
    
    imagensParaDeletar.forEach(nomeArquivo => {
      const caminhoFisico = path.join(__dirname, '..', 'uploads', nomeArquivo);
      if (fs.existsSync(caminhoFisico)) {
        fs.unlink(caminhoFisico, (err) => {
          if (err) console.error(`❌ Erro ao apagar arquivo ${nomeArquivo}:`, err);
          else console.log(`✅ Arquivo ${nomeArquivo} removido do servidor.`);
        });
      }
    });

    await db.query('DELETE FROM anuncios WHERE id = ?', [id]);
    res.json({ success: true, message: 'Anúncio e arquivos removidos com sucesso' });

  } catch (error) {
    console.error('❌ Erro ao deletar:', error);
    res.status(500).json({ error: 'Erro ao deletar anúncio' });
  }
});

module.exports = router;