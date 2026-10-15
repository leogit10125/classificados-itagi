const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Registro de usuário
exports.register = async (req, res) => {
  try {
    const { nome, email, senha, telefone } = req.body;

    // 💡 Desestruturado [existingUser]
    const [existingUser] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    // 💡 Desestruturado [result] no execute
    const [result] = await db.execute(
      'INSERT INTO usuarios (nome, email, senha, telefone) VALUES (?, ?, ?, ?)',
      [nome, email, hashedPassword, telefone]
    );

    const token = jwt.sign({ id: result.insertId, email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ id: result.insertId, nome, email, telefone, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // 💡 Desestruturado [users]
    const [users] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(senha, user.senha);
    if (!validPassword) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ id: user.id, nome: user.nome, email: user.email, telefone: user.telefone, role: user.role, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Perfil do usuário
exports.getProfile = async (req, res) => {
  try {
    // 💡 Desestruturado [users]
    const [users] = await db.query('SELECT id, nome, email, telefone, role, creditos FROM usuarios WHERE id = ?', [req.userId]);

    if (users.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });

    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};