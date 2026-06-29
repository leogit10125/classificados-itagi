USE itagi_classificados;

INSERT INTO usuarios (nome, email, telefone) VALUES
('Leone', 'leone@email.com', '11999999999'),
('Admin', 'admin@email.com', '11988888888');

INSERT INTO anuncios (titulo, descricao, preco, categoria, usuario_id) VALUES
('Fusca 1978', 'Fusca azul em bom estado', 15000, 'Veículos', 1),
('Celular Samsung', 'S21 128GB', 2500, 'Eletrônicos', 2);
