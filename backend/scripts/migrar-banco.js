const db = require('../config/db');

async function garantirColunas(tabela, colunas) {
  for (const [nome, definicao] of Object.entries(colunas)) {
    const [encontradas] = await db.query(
      `SHOW COLUMNS FROM \`${tabela}\` LIKE ?`,
      [nome]
    );

    if (encontradas.length === 0) {
      await db.query(
        `ALTER TABLE \`${tabela}\` ADD COLUMN \`${nome}\` ${definicao}`
      );
      console.log(`[MIGRAÇÃO] Coluna criada: ${tabela}.${nome}`);
    }
  }
}

async function migrarBanco() {
  console.log('[MIGRAÇÃO] Verificando banco de produção...');

  await db.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INT NOT NULL AUTO_INCREMENT,
      nome VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      senha VARCHAR(255) NOT NULL,
      telefone VARCHAR(20) DEFAULT NULL,
      role VARCHAR(50) DEFAULT 'user',
      creditos INT DEFAULT 0,
      anuncios_gratuitos_restantes INT NOT NULL DEFAULT 2,
      anuncios_pagos INT NOT NULL DEFAULT 0,
      pacote_anuncios INT NOT NULL DEFAULT 0,
      whatsapp_publico TINYINT(1) NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_usuarios_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await garantirColunas('usuarios', {
    nome: 'VARCHAR(255) NULL',
    email: 'VARCHAR(255) NULL',
    senha: 'VARCHAR(255) NULL',
    telefone: 'VARCHAR(20) DEFAULT NULL',
    role: "VARCHAR(50) DEFAULT 'user'",
    creditos: 'INT DEFAULT 0',
    anuncios_gratuitos_restantes: 'INT NOT NULL DEFAULT 2',
    anuncios_pagos: 'INT NOT NULL DEFAULT 0',
    pacote_anuncios: 'INT NOT NULL DEFAULT 0',
    whatsapp_publico: 'TINYINT(1) NOT NULL DEFAULT 0',
    created_at: 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP'
  });

  await db.query(`
    CREATE TABLE IF NOT EXISTS anuncios (
      id INT NOT NULL AUTO_INCREMENT,
      titulo VARCHAR(255) NOT NULL,
      descricao TEXT DEFAULT NULL,
      preco DECIMAL(10,2) DEFAULT NULL,
      categoria VARCHAR(100) DEFAULT NULL,
      localizacao VARCHAR(100) DEFAULT NULL,
      imagens TEXT DEFAULT NULL,
      usuario_id INT DEFAULT NULL,
      destaque TINYINT(1) DEFAULT 0,
      views INT DEFAULT 0,
      status VARCHAR(50) DEFAULT 'active',
      criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      atualizado_em TIMESTAMP NULL DEFAULT NULL
        ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY idx_anuncios_usuario (usuario_id),
      KEY idx_anuncios_status (status),
      CONSTRAINT fk_anuncios_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await garantirColunas('anuncios', {
    titulo: 'VARCHAR(255) NULL',
    descricao: 'TEXT DEFAULT NULL',
    preco: 'DECIMAL(10,2) DEFAULT NULL',
    categoria: 'VARCHAR(100) DEFAULT NULL',
    localizacao: 'VARCHAR(100) DEFAULT NULL',
    imagens: 'TEXT DEFAULT NULL',
    usuario_id: 'INT DEFAULT NULL',
    destaque: 'TINYINT(1) DEFAULT 0',
    views: 'INT DEFAULT 0',
    status: "VARCHAR(50) DEFAULT 'active'",
    criado_em: 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP',
    atualizado_em: 'TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP'
  });

  await db.query(`
    CREATE TABLE IF NOT EXISTS pagamentos (
      id INT NOT NULL AUTO_INCREMENT,
      usuario_id INT NOT NULL,
      anuncio_id INT DEFAULT NULL,
      plano VARCHAR(50) DEFAULT NULL,
      valor DECIMAL(10,2) DEFAULT NULL,
      status VARCHAR(50) DEFAULT NULL,
      metodo VARCHAR(50) DEFAULT NULL,
      transacao_id VARCHAR(100) DEFAULT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY idx_pagamentos_usuario (usuario_id),
      KEY idx_pagamentos_anuncio (anuncio_id),
      CONSTRAINT fk_pagamentos_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE CASCADE,
      CONSTRAINT fk_pagamentos_anuncio
        FOREIGN KEY (anuncio_id) REFERENCES anuncios(id)
        ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS password_resets (
      id INT NOT NULL AUTO_INCREMENT,
      usuario_id INT NOT NULL,
      token VARCHAR(255) NOT NULL,
      expira_em DATETIME NOT NULL,
      criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_password_reset_usuario (usuario_id),
      UNIQUE KEY uq_password_reset_token (token),
      CONSTRAINT fk_password_reset_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS anuncio_images (
      id INT NOT NULL AUTO_INCREMENT,
      anuncio_id INT NOT NULL,
      imagem_path VARCHAR(255) NOT NULL,
      ordem INT DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY idx_anuncio_images_anuncio (anuncio_id),
      CONSTRAINT fk_anuncio_images_anuncio
        FOREIGN KEY (anuncio_id) REFERENCES anuncios(id)
        ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  console.log('[MIGRAÇÃO] Tabelas verificadas/criadas.');
}

module.exports = migrarBanco;
