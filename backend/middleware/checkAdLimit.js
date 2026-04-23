// backend/middleware/checkAdLimit.js
const db = require('../config/database-hostinger');

async function checkAdLimit(req, res, next) {
  try {
    const usuarioId = req.usuario?.id;
    
    if (!usuarioId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    // Buscar usuário e seus anúncios
    const [usuario] = await db.query(
      'SELECT anuncios_gratuitos_restantes, anuncios_pagos, pacote_anuncios, pacote_valido_ate FROM usuarios WHERE id = ?',
      [usuarioId]
    );

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Contar anúncios do usuário
    const [anunciosCount] = await db.query(
      'SELECT COUNT(*) as total FROM anuncios WHERE usuario_id = ?',
      [usuarioId]
    );

    const totalAnuncios = anunciosCount.total;
    const gratuitosUsados = 2 - (usuario.anuncios_gratuitos_restantes || 0);
    const pagosDisponiveis = (usuario.pacote_anuncios || 0) + (usuario.anuncios_pagos || 0);
    
    // Verificar se pode criar anúncio
    if (totalAnuncios < 2) {
      // Ainda tem anúncio grátis
      req.adType = 'gratuito';
      return next();
    } else if (pagosDisponiveis > 0) {
      // Tem anúncios pagos disponíveis
      req.adType = 'pago';
      return next();
    } else {
      // Sem créditos, precisa pagar
      return res.status(402).json({ 
        error: 'Limite de anúncios gratuitos atingido',
        precisaPagar: true,
        mensagem: 'Você já usou seus 2 anúncios gratuitos. Adquira um pacote para continuar anunciando.',
        pacotes: [
          { id: 1, nome: 'Pacote Básico', quantidade: 5, preco: 10.00 },
          { id: 2, nome: 'Pacote Popular', quantidade: 12, preco: 20.00 },
          { id: 3, nome: 'Pacote Destaque', quantidade: 30, preco: 40.00 }
        ]
      });
    }

  } catch (error) {
    console.error('❌ Erro ao verificar limite:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
}

module.exports = checkAdLimit;