const request = require("supertest");
const { app } = require("../src/index");

describe("API de Tarefas", () => {
  it("GET /api/tarefas sem autenticação retorna 401", async () => {
    const res = await request(app).get("/api/tarefas");
    expect(res.statusCode).toBe(401);
  });

  // Adicione mais testes conforme necessário
});
