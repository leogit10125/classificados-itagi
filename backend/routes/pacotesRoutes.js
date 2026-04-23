// backend/routes/pacotesRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/database-hostinger');
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

    // Registrar transação
    const result = await db.query(
      `INSERT INTO transacoes (usuario_id, tipo, quantidade, valor, status) 
       VALUES (?, 'pacote', ?, ?, 'pendente')`,
      [usuarioId, quantidade, valor]
    );

    // SIMULAÇÃO DE PAGAMENTO APROVADO
    // Em produção, aqui você esperaria o webhook do pagamento
    
    // Atualizar créditos do usuário
    await db.query(
      `UPDATE usuarios 
       SET pacote_anuncios = pacote_anuncios + ? 
       WHERE id = ?`,
      [quantidade, usuarioId]
    );

    // Atualizar status da transação
    await db.query(
      'UPDATE transacoes SET status = "pago" WHERE id = ?',
      [result.insertId]
    );

    // Buscar dados atualizados
    const [usuario] = await db.query(
      'SELECT anuncios_gratuitos_restantes, pacote_anuncios, anuncios_pagos FROM usuarios WHERE id = ?',
      [usuarioId]
    );

    res.json({
      success: true,
      message: `Compra realizada! Você agora tem ${usuario.pacote_anuncios} anúncios pagos disponíveis.`,
      creditos: {
        gratuitos: usuario.anuncios_gratuitos_restantes,
        pagos: usuario.pacote_anuncios
      }
    });

  } catch (error) {
    console.error('❌ Erro na compra:', error);
    res.status(500).json({ error: 'Erro ao processar compra' });
  }
});

// Verificar status dos créditos
router.get('/creditos', authMiddleware, async (req, res) => {
  try {
    const usuarioId = req.usuario?.id;
    
    const [usuario] = await db.query(
      'SELECT anuncios_gratuitos_restantes, pacote_anuncios, anuncios_pagos FROM usuarios WHERE id = ?',
      [usuarioId]
    );

    const [anunciosCount] = await db.query(
      'SELECT COUNT(*) as total FROM anuncios WHERE usuario_id = ?',
      [usuarioId]
    );

    const gratuitosUsados = 2 - (usuario.anuncios_gratuitos_restantes || 0);
    const creditosPagos = (usuario.pacote_anuncios || 0) + (usuario.anuncios_pagos || 0);

    res.json({
      limiteGratuito: 2,
      anunciosGratuitosUsados: gratuitosUsados,
      anunciosGratuitosRestantes: usuario.anuncios_gratuitos_restantes || 0,
      creditosPagosDisponiveis: creditosPagos,
      totalAnuncios: anunciosCount.total
    });

  } catch (error) {
    console.error('❌ Erro:', error);
    res.status(500).json({ error: 'Erro ao verificar créditos' });
  }
});

module.exports = router;