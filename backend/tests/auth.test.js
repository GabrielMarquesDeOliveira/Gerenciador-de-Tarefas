const request = require("supertest");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { app } = require("../src/index");
const pool = require("../src/db");

describe("API de Autenticação", () => {
  beforeEach(async () => {
    // Limpa o banco de dados antes de cada teste
    await pool.query("DELETE FROM usuarios");
  });

  describe("POST /api/register", () => {
    it("deve cadastrar um novo usuário com sucesso", async () => {
      const res = await request(app).post("/api/register").send({
        nome: "Teste",
        email: "teste@teste.com",
        senha: "123456",
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty(
        "mensagem",
        "Usuário cadastrado com sucesso"
      );
      expect(res.body.usuario).toHaveProperty("id");
      expect(res.body.usuario).toHaveProperty("email", "teste@teste.com");
    });

    it("deve retornar erro ao tentar cadastrar email já existente", async () => {
      // Primeiro cadastro
      await request(app).post("/api/register").send({
        nome: "Teste",
        email: "teste@teste.com",
        senha: "123456",
      });

      // Tenta cadastrar o mesmo email
      const res = await request(app).post("/api/register").send({
        nome: "Teste 2",
        email: "teste@teste.com",
        senha: "123456",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("erro", true);
      expect(res.body).toHaveProperty(
        "mensagem",
        "Este email já está cadastrado"
      );
    });
  });

  describe("POST /api/login", () => {
    beforeEach(async () => {
      // Cria um usuário para os testes de login
      const senha = await bcrypt.hash("123456", 10);
      await pool.query(
        "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)",
        ["Teste", "teste@teste.com", senha]
      );
    });

    it("deve fazer login com sucesso", async () => {
      const res = await request(app).post("/api/login").send({
        email: "teste@teste.com",
        senha: "123456",
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty(
        "mensagem",
        "Login realizado com sucesso"
      );
    });

    it("deve retornar erro com senha incorreta", async () => {
      const res = await request(app).post("/api/login").send({
        email: "teste@teste.com",
        senha: "senha_errada",
      });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("erro", true);
      expect(res.body).toHaveProperty("mensagem", "Email ou senha inválidos");
    });
  });
});
