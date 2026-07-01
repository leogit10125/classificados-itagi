// backend/models/adModel.js
const db = require('../config/db');

// Buscar dados de créditos do usuário
exports.buscarCreditosUsuario = async (usuarioId) => {
  const [rows] = await db.query(
    `SELECT anuncios_gratuitos_restantes, pacote_anuncios, anuncios_pagos 
     FROM usuarios WHERE id = ?`,
    [usuarioId]
  );
  return rows[0];
};

// Debitar 1 crédito gratuito
exports.debitarCreditoGratuito = async (usuarioId) => {
  await db.query(
    'UPDATE usuarios SET anuncios_gratuitos_restantes = anuncios_gratuitos_restantes - 1 WHERE id = ?',
    [usuarioId]
  );
};

// Debitar 1 crédito pago
exports.debitarCreditoPago = async (usuarioId) => {
  await db.query(
    `UPDATE usuarios 
     SET pacote_anuncios = IF(pacote_anuncios > 0, pacote_anuncios - 1, pacote_anuncios),
         anuncios_pagos = IF(pacote_anuncios = 0 AND anuncios_pagos > 0, anuncios_pagos - 1, anuncios_pagos)
     WHERE id = ?`,
    [usuarioId]
  );
};

// 🌟 SALVAR ANÚNCIO (Adaptado do seu Schema Mongoose)
exports.salvarAnuncio = async (anuncioData, usuarioId, tipoAnuncio) => {
  const { 
    title, 
    description, 
    price, 
    category, 
    location, 
    images, // Array de strings do front: ['img1.jpg', 'img2.jpg']
    featured 
  } = anuncioData;

  // Como o MySQL não armazena Arrays nativos diretamente como o MongoDB, 
  // transformamos o array de imagens em uma string JSON estável.
  const imagensJSON = images ? JSON.stringify(images) : JSON.stringify([]);

  const [result] = await db.query(
    `INSERT INTO anuncios 
     (titulo, descricao, preco, categoria, localizacao, imagens, destaque, usuario_id, tipo, status) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
    [
      title, 
      description, 
      price, 
      category, 
      location, 
      imagensJSON, 
      featured ? 1 : 0, 
      usuarioId, 
      tipoAnuncio
    ]
  );
  
  return result.insertId;
};