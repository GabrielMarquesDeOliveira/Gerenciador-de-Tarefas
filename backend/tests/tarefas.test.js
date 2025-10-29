const request = require("supertest");
const { app } = require("../src/index");
const jwt = require("jsonwebtoken");
const pool = require("../src/db");

describe("API de Tarefas", () => {
  let token;
  let usuarioId;

  beforeAll(async () => {
    // Criar um usuário para os testes
    const result = await pool.query(
      "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id",
      ["Teste", "teste@teste.com", "123456"]
    );
    usuarioId = result.rows[0].id;
    token = jwt.sign(
      { id: usuarioId, email: "teste@teste.com" },
      process.env.JWT_SECRET
    );
  });

  beforeEach(async () => {
    // Limpa a tabela de tarefas antes de cada teste
    await pool.query("DELETE FROM tarefas");
  });

  afterAll(async () => {
    // Limpa os dados de teste
    await pool.query("DELETE FROM tarefas");
    await pool.query("DELETE FROM usuarios WHERE id = $1", [usuarioId]);
  });

  describe("GET /api/tarefas", () => {
    it("deve retornar 401 sem autenticação", async () => {
      const res = await request(app).get("/api/tarefas");
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("erro", true);
    });

    it("deve retornar lista vazia de tarefas", async () => {
      const res = await request(app)
        .get("/api/tarefas")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(0);
    });

    it("deve retornar apenas tarefas do usuário autenticado", async () => {
      // Criar uma tarefa para o usuário
      await pool.query(
        "INSERT INTO tarefas (titulo, descricao, status, usuario_id) VALUES ($1, $2, $3, $4)",
        ["Tarefa Teste", "Descrição teste", "pendente", usuarioId]
      );

      const res = await request(app)
        .get("/api/tarefas")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toHaveProperty("titulo", "Tarefa Teste");
    });
  });

  describe("POST /api/tarefas", () => {
    it("deve criar uma nova tarefa", async () => {
      const res = await request(app)
        .post("/api/tarefas")
        .set("Authorization", `Bearer ${token}`)
        .send({
          titulo: "Nova Tarefa",
          descricao: "Descrição da nova tarefa",
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("titulo", "Nova Tarefa");
      expect(res.body).toHaveProperty("status", "pendente");
    });

    it("deve retornar erro sem título", async () => {
      const res = await request(app)
        .post("/api/tarefas")
        .set("Authorization", `Bearer ${token}`)
        .send({
          descricao: "Descrição sem título",
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("erro", true);
    });
  });

  describe("PUT /api/tarefas/:id", () => {
    let tarefaId;

    beforeEach(async () => {
      // Criar uma tarefa para testar atualização
      const result = await pool.query(
        "INSERT INTO tarefas (titulo, descricao, status, usuario_id) VALUES ($1, $2, $3, $4) RETURNING id",
        ["Tarefa para Atualizar", "Descrição original", "pendente", usuarioId]
      );
      tarefaId = result.rows[0].id;
    });

    it("deve atualizar uma tarefa existente", async () => {
      const res = await request(app)
        .put(`/api/tarefas/${tarefaId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          titulo: "Tarefa Atualizada",
          descricao: "Nova descrição",
          status: "concluida",
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("titulo", "Tarefa Atualizada");
      expect(res.body).toHaveProperty("status", "concluida");
    });
  });

  describe("DELETE /api/tarefas/:id", () => {
    let tarefaId;

    beforeEach(async () => {
      // Criar uma tarefa para testar deleção
      const result = await pool.query(
        "INSERT INTO tarefas (titulo, descricao, status, usuario_id) VALUES ($1, $2, $3, $4) RETURNING id",
        ["Tarefa para Deletar", "Será deletada", "pendente", usuarioId]
      );
      tarefaId = result.rows[0].id;
    });

    it("deve deletar uma tarefa existente", async () => {
      const res = await request(app)
        .delete(`/api/tarefas/${tarefaId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(204);

      // Verifica se a tarefa foi realmente deletada
      const verificacao = await pool.query(
        "SELECT * FROM tarefas WHERE id = $1",
        [tarefaId]
      );
      expect(verificacao.rows).toHaveLength(0);
    });
  });
});
