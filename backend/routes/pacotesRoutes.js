// backend/routes/pacotesRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

// Listar pacotes disponíveis
router.get('/', (req, res) => {
  res.json([
    { id: 1, nome: 'Básico', quantidade: 5, preco: 10.00, destaque: false },
    { id: 2, nome: 'Popular', quantidade: 12, preco: 20.00, destaque: false },
    { id: 3, nome: 'Destaque', quantidade: 30, preco: 40.00, destaque: true },
    { id: 4, nome: 'Anúncio Avulso', quantidade: 1, preco: 2.00, destaque: false }
  ]);
});

// Simular compra (aqui você integraria com Mercado Pago, Stripe, etc)
router.post('/comprar', authMiddleware, async (req, res) => {
  try {
    const usuarioId = req.usuario?.id;
    const { pacoteId, quantidade, valor } = req.body;

    if (!usuarioId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    // 💡 Regra 3: Desestruturando o INSERT da transação (Mantenha a tabela se ela existir, ou adapte para 'pagamentos')
    const [result] = await db.query(
      `INSERT INTO pagamentos (usuario_id, plano, valor, status, metodo) 
       VALUES (?, 'pacote', ?, 'pago', 'simulacao')`,
      [usuarioId, valor]
    );

    // 💡 Regra 4: Desestruturando o UPDATE de créditos do usuário
    await db.query(
      `UPDATE usuarios 
       SET pacote_anuncios = pacote_anuncios + ? 
       WHERE id = ?`,
      [quantidade, usuarioId]
    );

    // 💡 Regra 2: Espera apenas um registro (Rows desestruturado e capturado de forma segura via índice [0])
    const [rows] = await db.query(
      'SELECT anuncios_gratuitos_restantes, pacote_anuncios, anuncios_pagos FROM usuarios WHERE id = ?',
      [usuarioId]
    );
    const usuario = rows[0];

    res.json({
      success: true,
      message: `Compra realizada! Você agora tem ${usuario?.pacote_anuncios || 0} anúncios pagos disponíveis.`,
      creditos: {
        gratuitos: usuario?.anuncios_gratuitos_restantes || 0,
        pagos: usuario?.pacote_anuncios || 0
      }
    });

  } catch (error) {
    console.error('❌ Erro na compra:', error);
    res.status(500).json({ error: 'Erro ao processar compra', details: error.message });
  }
});

// Verificar status dos créditos
router.get('/creditos', authMiddleware, async (req, res) => {
  try {
    const usuarioId = req.usuario?.id;

    if (!usuarioId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    
    // 💡 Regra 2: Desestruturando dados de um único usuário
    const [userRows] = await db.query(
      'SELECT anuncios_gratuitos_restantes, pacote_anuncios, anuncios_pagos FROM usuarios WHERE id = ?',
      [usuarioId]
    );
    const usuario = userRows[0];

    // 💡 Regra 2: Desestruturando retorno de agregação COUNT(*)
    const [adRows] = await db.query(
      'SELECT COUNT(*) as total FROM anuncios WHERE usuario_id = ?',
      [usuarioId]
    );
    const anunciosCount = adRows[0];

    const gratuitosUsados = 2 - (usuario?.anuncios_gratuitos_restantes || 0);
    const creditosPagos = (usuario?.pacote_anuncios || 0) + (usuario?.anuncios_pagos || 0);

    res.json({
      limiteGratuito: 2,
      anunciosGratuitosUsados: gratuitosUsados < 0 ? 0 : gratuitosUsados,
      anunciosGratuitosRestantes: usuario?.anuncios_gratuitos_restantes || 0,
      creditosPagosDisponiveis: creditosPagos,
      totalAnuncios: anunciosCount?.total || 0
    });

  } catch (error) {
    console.error('❌ Erro ao buscar créditos:', error);
    res.status(500).json({ error: 'Erro ao verificar créditos', details: error.message });
  }
});

module.exports = router;