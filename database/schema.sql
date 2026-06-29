CREATE DATABASE IF NOT EXISTS itagi_classificados;
USE itagi_classificados;

-- 1. TABELA DE USUÁRIOS (Atualizada com senha e créditos)
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL, -- 👈 Campo essencial para o login e bcrypt
  telefone VARCHAR(20),
  role VARCHAR(50) DEFAULT 'user', -- 👈 Usado para controle de admin
  creditos INT DEFAULT 0,
  anuncios_gratuitos_restantes INT DEFAULT 2, -- 👈 Usado na rota de registro
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABELA DE ANÚNCIOS
CREATE TABLE IF NOT EXISTS anuncios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2),
  categoria VARCHAR(100),
  localizacao VARCHAR(100),
  imagens TEXT, -- Mantido para compatibilidade com logs antigos em JSON
  usuario_id INT,
  destaque BOOLEAN DEFAULT FALSE,
  views INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Ajustado para bater com 'criado_em' usado nos controllers
  atualizado_em TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 3. TABELA DE IMAGENS RELACIONAIS (Essencial para o seu novo adController.js!)
CREATE TABLE IF NOT EXISTS anuncio_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  anuncio_id INT NOT NULL,
  imagem_path VARCHAR(255) NOT NULL,
  ordem INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (anuncio_id) REFERENCES anuncios(id) ON DELETE CASCADE
);

-- 4. TABELA DE PAGAMENTOS
CREATE TABLE IF NOT EXISTS pagamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  anuncio_id INT,
  plano VARCHAR(50),
  valor DECIMAL(10,2),
  status VARCHAR(50),
  metodo VARCHAR(50),
  transacao_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (anuncio_id) REFERENCES anuncios(id) ON DELETE SET NULL
);