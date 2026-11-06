// backend/middleware/checkAdLimit.js
const db = require('../config/db');

// Pacotes oficiais sincronizados com o pacotesRoutes.js e Mercado Pago
const PACOTES_DISPONIVEIS = [
  { id: 1, nome: 'Básico', quantidade: 5, preco: 10.00, destaque: false },
  { id: 2, nome: 'Popular', quantidade: 12, preco: 20.00, destaque: false },
  { id: 3, nome: 'Destaque', quantidade: 30, preco: 40.00, destaque: true },
  { id: 4, nome: 'Anúncio Avulso', quantidade: 1, preco: 2.00, destaque: false }
];

async function checkAdLimit(req, res, next) {
  try {
    const usuarioId = req.usuario?.id || req.user?.id;
    
    if (!usuarioId) {
      return res.status(401).json({ error: 'Acesso não autorizado. Faça login para anunciar.' });
    }

    // 1. Busca saldo de créditos do usuário
    const [userRows] = await db.query(
      `SELECT
          anuncios_gratuitos_restantes,
          anuncios_pagos,
          pacote_anuncios
       FROM usuarios
       WHERE id = ?`,
      [usuarioId]
    );

    const usuario = userRows[0];

    if (!usuario) {
      return res.status(404).json({ error: 'Conta de usuário não encontrada.' });
    }

    // Conversão segura para garantir operações numéricas
    const gratuitosRestantes = Number(usuario.anuncios_gratuitos_restantes) || 0;
    const pacoteCreditos = Number(usuario.pacote_anuncios) || 0;
    const anunciosPagos = Number(usuario.anuncios_pagos) || 0;
    const totalPagosDisponiveis = pacoteCreditos + anunciosPagos;

    // 2. Validação de regras de negócio
    if (gratuitosRestantes > 0) {
      // Prioridade 1: Consome os anúncios gratuitos de entrada
      req.adType = 'gratuito';
      return next();

    } else if (totalPagosDisponiveis > 0) {
      // Prioridade 2: Consome créditos adquiridos
      req.adType = 'pago';
      return next();

    } else {
      // Bloqueio 402: Usuário precisa comprar créditos no Mercado Pago
      return res.status(402).json({ 
        error: 'Limite de anúncios gratuitos atingido.',
        precisaPagar: true,
        mensagem: 'Você já utilizou seus 2 anúncios gratuitos. Adquira um pacote de créditos para continuar publicando.',
        pacotes: PACOTES_DISPONIVEIS
      });
    }

  } catch (error) {
    console.error('❌ [LIMIT] Falha ao verificar limite de anúncios:', error.message);
    // 🛡️ Segurança: não expõe detalhes de schema ou erros internos do banco ao cliente
    return res.status(500).json({ error: 'Erro interno ao validar limite de publicação.' });
  }
}

module.exports = checkAdLimit;