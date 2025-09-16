const express = require("express");
const { autenticarToken } = require("./auth");
const {
  criarTarefa,
  listarTarefas,
  atualizarTarefa,
  deletarTarefa,
} = require("./models");
const { io } = require("./index");
const router = express.Router();

// CRUD de tarefas
router.post("/tarefas", autenticarToken, async (req, res) => {
  const { titulo, descricao } = req.body;
  const tarefa = await criarTarefa(titulo, descricao, req.usuario.id);
  io.emit("tarefaAtualizada", `Tarefa criada: ${tarefa.titulo}`);
  res.json(tarefa);
});

router.get("/tarefas", autenticarToken, async (req, res) => {
  const { status } = req.query;
  const tarefas = await listarTarefas(req.usuario.id, status);
  res.json(tarefas);
});

router.put("/tarefas/:id", autenticarToken, async (req, res) => {
  const tarefa = await atualizarTarefa(req.params.id, req.body);
  io.emit("tarefaAtualizada", `Tarefa atualizada: ${tarefa.titulo}`);
  res.json(tarefa);
});

router.delete("/tarefas/:id", autenticarToken, async (req, res) => {
  await deletarTarefa(req.params.id);
  io.emit("tarefaAtualizada", `Tarefa deletada!`);
  res.sendStatus(204);
});

module.exports = router;
