const db = require("../config/db");

async function consumirCredito(usuarioId, tipo) {

  if (tipo === "gratuito") {

    await db.query(
      `
      UPDATE usuarios
      SET anuncios_gratuitos_restantes =
          anuncios_gratuitos_restantes - 1
      WHERE id = ?
      `,
      [usuarioId]
    );

    return;
  }

  if (tipo === "pago") {

    const [rows] = await db.query(
      `
      SELECT pacote_anuncios,
             anuncios_pagos
      FROM usuarios
      WHERE id = ?
      `,
      [usuarioId]
    );

    const usuario = rows[0];

    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    if (usuario.pacote_anuncios > 0) {

      await db.query(
        `
        UPDATE usuarios
        SET pacote_anuncios = pacote_anuncios - 1
        WHERE id = ?
        `,
        [usuarioId]
      );

      return;
    }

    if (usuario.anuncios_pagos > 0) {

      await db.query(
        `
        UPDATE usuarios
        SET anuncios_pagos = anuncios_pagos - 1
        WHERE id = ?
        `,
        [usuarioId]
      );

      return;
    }

    throw new Error("Sem créditos disponíveis");
  }
}

module.exports = {
  consumirCredito
};