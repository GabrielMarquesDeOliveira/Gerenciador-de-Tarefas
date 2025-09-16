const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('./db');
require('dotenv').config();
const router = express.Router();

// Cadastro de usuário
router.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;
  const result = await pool.query(
    'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *',
    [nome, email, senha]
  );
  res.json(result.rows[0]);
});

// Login de usuário
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  const result = await pool.query(
    'SELECT * FROM usuarios WHERE email = $1 AND senha = $2',
    [email, senha]
  );
  if (result.rows.length === 0) return res.sendStatus(401);
  const usuario = result.rows[0];
  const token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.JWT_SECRET);
  res.json({ token });
});

module.exports = router;
