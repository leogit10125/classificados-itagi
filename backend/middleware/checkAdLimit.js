// backend/middleware/checkAdLimit.js
const db = require('../config/db');

async function checkAdLimit(req, res, next) {
  try {
    const usuarioId = req.usuario?.id;
    
    if (!usuarioId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    // 💡 Regra 2: Espera apenas um registro (Desestruturando rows e pegando o índice [0])
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
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // 💡 Regra 2: Desestruturando agregação COUNT(*) do banco de dados
    const [adRows] = await db.query(
      'SELECT COUNT(*) as total FROM anuncios WHERE usuario_id = ?',
      [usuarioId]
    );
    const anunciosCount = adRows[0];

    const totalAnuncios = anunciosCount?.total || 0;
    const gratuitosRestantes = usuario?.anuncios_gratuitos_restantes || 0;
    const pagosDisponiveis = (usuario?.pacote_anuncios || 0) + (usuario?.anuncios_pagos || 0);
    
    // Verificar se pode criar anúncio baseado no saldo de anúncios gratuitos restantes
    if (gratuitosRestantes > 0) {
      // Ainda tem anúncio grátis disponível no saldo do usuário
      req.adType = 'gratuito';
      return next();
    } else if (pagosDisponiveis > 0) {
      // Tem anúncios pagos disponíveis
      req.adType = 'pago';
      return next();
    } else {
      // Sem créditos gratuitos ou pagos, barra a requisição retornando HTTP 402
      return res.status(402).json({ 
        error: 'Limite de anúncios gratuitos atingido',
        precisaPagar: true,
        mensagem: 'Você já usou seus anúncios gratuitos. Adquira um pacote para continuar anunciando.',
        pacotes: [
          { id: 1, nome: 'Pacote Básico', quantidade: 5, preco: 10.00 },
          { id: 2, nome: 'Pacote Popular', quantidade: 12, preco: 20.00 },
          { id: 3, nome: 'Pacote Destaque', quantidade: 30, preco: 40.00 }
        ]
      });
    }

  } catch (error) {
    console.error('❌ Erro ao verificar limite:', error);
    res.status(500).json({ error: 'Erro interno ao validar limite de anúncios', details: error.message });
  }
}

module.exports = checkAdLimit;