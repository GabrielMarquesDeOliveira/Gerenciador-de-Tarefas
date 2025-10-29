const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("./db");
const { registroSchema, loginSchema } = require("./validations");
const logger = require("./logger");
require("dotenv").config();

const router = express.Router();
const SALT_ROUNDS = 10;

// Cadastro de usuário
router.post("/register", async (req, res) => {
  try {
    // Validação dos dados
    const { error } = registroSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        erro: true,
        mensagem: error.details[0].message,
      });
    }

    const { nome, email, senha } = req.body;

    // Verifica se o email já existe
    const emailExistente = await pool.query(
      "SELECT id FROM usuarios WHERE email = $1",
      [email]
    );

    if (emailExistente.rows.length > 0) {
      return res.status(400).json({
        erro: true,
        mensagem: "Este email já está cadastrado",
      });
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

    // Inserção do usuário
    const result = await pool.query(
      "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email",
      [nome, email, senhaHash]
    );

    logger.info(`Novo usuário registrado: ${email}`);
    res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso",
      usuario: result.rows[0],
    });
  } catch (err) {
    logger.error("Erro no registro de usuário:", err);
    res.status(500).json({
      erro: true,
      mensagem: "Erro interno do servidor",
    });
  }
});

// Login de usuário
router.post("/login", async (req, res) => {
  try {
    // Validação dos dados
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        erro: true,
        mensagem: error.details[0].message,
      });
    }

    const { email, senha } = req.body;

    // Busca o usuário
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        erro: true,
        mensagem: "Email ou senha inválidos",
      });
    }

    const usuario = result.rows[0];

    // Verifica a senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({
        erro: true,
        mensagem: "Email ou senha inválidos",
      });
    }

    // Gera o token JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || "24h" }
    );

    logger.info(`Usuário logado: ${email}`);
    res.json({
      mensagem: "Login realizado com sucesso",
      token,
    });
  } catch (err) {
    logger.error("Erro no login:", err);
    res.status(500).json({
      erro: true,
      mensagem: "Erro interno do servidor",
    });
  }
});

module.exports = router;
