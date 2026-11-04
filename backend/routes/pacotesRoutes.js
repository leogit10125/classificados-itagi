// backend/routes/pacotesRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');

// Inicializa o Mercado Pago com o token do .env
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || ''
});

// Lista fixa dos pacotes oficiais
const PACOTES_DISPONIVEIS = [
  { id: 1, nome: 'Básico', quantidade: 5, preco: 10.00, destaque: false },
  { id: 2, nome: 'Popular', quantidade: 12, preco: 20.00, destaque: false },
  { id: 3, nome: 'Destaque', quantidade: 30, preco: 40.00, destaque: true },
  { id: 4, nome: 'Anúncio Avulso', quantidade: 1, preco: 2.00, destaque: false }
];

// 1. Listar pacotes disponíveis
router.get('/', (req, res) => {
  res.json(PACOTES_DISPONIVEIS);
});

// 2. CRIAR PREFERÊNCIA DE COMPRA (Gera link do Mercado Pago com Pix/Cartão)
router.post('/comprar', authMiddleware, async (req, res) => {
  try {
    const usuarioId = req.usuario?.id;
    const { pacoteId } = req.body;

    if (!usuarioId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const pacote = PACOTES_DISPONIVEIS.find(p => p.id === Number(pacoteId));
    if (!pacote) {
      return res.status(404).json({ error: 'Pacote não encontrado' });
    }

    // Busca dados do usuário (email e nome)
    const [userRows] = await db.query('SELECT id, nome, email FROM usuarios WHERE id = ?', [usuarioId]);
    const usuario = userRows[0];

    // Registra intenção de pagamento como 'pendente' no MariaDB
    const [insertResult] = await db.query(
      `INSERT INTO pagamentos (usuario_id, plano, valor, status, metodo) 
       VALUES (?, ?, ?, 'pendente', 'mercadopago')`,
      [usuarioId, pacote.nome, pacote.preco]
    );
    const pagamentoIdInterno = insertResult.insertId;

    // URL base do seu site para redirecionamento após o pagamento
    const siteUrl = process.env.SITE_URL || 'https://www.itagiclassificados.com';

    // Cria a preferência na API do Mercado Pago
    const preference = new Preference(client);
    const resultado = await preference.create({
      body: {
        items: [
          {
            id: String(pacote.id),
            title: `Pacote ${pacote.nome} - ${pacote.quantidade} Créditos (${pacote.destaque ? 'Destaque' : 'Padrão'})`,
            quantity: 1,
            unit_price: Number(pacote.preco),
            currency_id: 'BRL'
          }
        ],
        payer: {
          email: usuario?.email || 'cliente@itagiclassificados.com',
          name: usuario?.nome || 'Cliente Itagi'
        },
        metadata: {
          usuario_id: usuarioId,
          quantidade_creditos: pacote.quantidade,
          pagamento_id_interno: pagamentoIdInterno
        },
        back_urls: {
          success: `${siteUrl}/anunciar?pagamento=sucesso`,
          pending: `${siteUrl}/anunciar?pagamento=pendente`,
          failure: `${siteUrl}/anunciar?pagamento=falha`
        },
        auto_return: 'approved',
        notification_url: `${siteUrl}/api/pacotes/webhook`
      }
    });

    // Retorna a URL de checkout do Mercado Pago (onde tem Pix e Cartão)
    res.json({
      success: true,
      init_point: resultado.init_point
    });

  } catch (error) {
    console.error('❌ Erro ao criar pagamento no Mercado Pago:', error);
    res.status(500).json({ error: 'Erro ao conectar ao Mercado Pago', details: error.message });
  }
});

// 3. WEBHOOK AUTOMÁTICO (Mercado Pago avisa aqui quando o Pix foi pago!)
router.post('/webhook', async (req, res) => {
  try {
    const { type, data } = req.body;
    const paymentId = data?.id || req.query['data.id'] || req.query.id;

    // Só processa se for notificação de pagamento
    if (paymentId && (type === 'payment' || req.query.topic === 'payment')) {
      const payment = new Payment(client);
      const paymentInfo = await payment.get({ id: paymentId });

      // Se o pagamento foi aprovado (Pix confirmado ou Cartão aprovado)
      if (paymentInfo.status === 'approved') {
        const usuarioId = paymentInfo.metadata.usuario_id;
        const creditos = paymentInfo.metadata.quantidade_creditos;
        const pagamentoIdInterno = paymentInfo.metadata.pagamento_id_interno;

        // Atualiza status na tabela pagamentos para 'pago'
        await db.query(
          `UPDATE pagamentos SET status = 'pago' WHERE id = ?`,
          [pagamentoIdInterno]
        );

        // Adiciona os créditos ao usuário no MariaDB automaticamente!
        await db.query(
          `UPDATE usuarios SET pacote_anuncios = pacote_anuncios + ? WHERE id = ?`,
          [creditos, usuarioId]
        );

        console.log(`✅ Pagamento #${paymentId} aprovado! ${creditos} créditos adicionados ao usuário #${usuarioId}`);
      }
    }

    // Mercado Pago exige resposta 200 para confirmar que recebemos a notificação
    res.sendStatus(200);

  } catch (error) {
    console.error('❌ Erro no Webhook Mercado Pago:', error);
    res.sendStatus(500);
  }
});

// 4. Verificar status dos créditos
router.get('/creditos', authMiddleware, async (req, res) => {
  try {
    const usuarioId = req.usuario?.id;

    if (!usuarioId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    
    const [userRows] = await db.query(
      'SELECT anuncios_gratuitos_restantes, pacote_anuncios, anuncios_pagos FROM usuarios WHERE id = ?',
      [usuarioId]
    );
    const usuario = userRows[0];

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
