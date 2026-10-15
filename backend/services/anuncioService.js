const pool = require('../config/db');

async function criarAnuncio(dados, files, usuarioId) {
  const {
    titulo,
    descricao,
    preco,
    categoria,
    localizacao
  } = dados;

  const nomesDasImagens = files
    ? files.map(file => file.filename)
    : [];

  const [resultado] = await pool.query(
    `INSERT INTO anuncios
      (titulo, descricao, preco, categoria, localizacao, imagens, usuario_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      titulo,
      descricao,
      preco,
      categoria,
      localizacao,
      JSON.stringify(nomesDasImagens),
      usuarioId
    ]
  );

  return {
    id: resultado.insertId,
    imagens: nomesDasImagens
  };
}

module.exports = {
  criarAnuncio
};