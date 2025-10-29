const express = require("express");
const { autenticarToken } = require("./auth");
const {
  criarTarefa,
  listarTarefas,
  atualizarTarefa,
  deletarTarefa,
  buscarTarefaPorId,
} = require("./models");
const { io } = require("./index");
const { tarefaSchema } = require("./validations/tarefas");
const logger = require("./logger");
const router = express.Router();

// Middleware para validar ID da tarefa
const validarTarefaId = async (req, res, next) => {
  try {
    const tarefa = await buscarTarefaPorId(req.params.id);
    if (!tarefa) {
      return res.status(404).json({
        erro: true,
        mensagem: "Tarefa não encontrada",
      });
    }
    if (tarefa.usuario_id !== req.usuario.id) {
      return res.status(403).json({
        erro: true,
        mensagem: "Você não tem permissão para acessar esta tarefa",
      });
    }
    req.tarefa = tarefa;
    next();
  } catch (err) {
    logger.error("Erro ao validar tarefa:", err);
    res.status(500).json({
      erro: true,
      mensagem: "Erro ao validar tarefa",
    });
  }
};

// CRUD de tarefas
router.post("/tarefas", autenticarToken, async (req, res) => {
  try {
    // Validação dos dados
    const { error, value } = tarefaSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        erro: true,
        mensagem: error.details[0].message,
      });
    }

    const { titulo, descricao } = value;
    const tarefa = await criarTarefa(titulo, descricao, req.usuario.id);

    io.emit("tarefaAtualizada", `Tarefa criada: ${tarefa.titulo}`);
    logger.info(
      `Nova tarefa criada por usuário ${req.usuario.id}: ${tarefa.titulo}`
    );

    res.status(201).json(tarefa);
  } catch (err) {
    logger.error("Erro ao criar tarefa:", err);
    res.status(500).json({
      erro: true,
      mensagem: "Erro ao criar tarefa",
    });
  }
});

router.get("/tarefas", autenticarToken, async (req, res) => {
  try {
    const { status } = req.query;
    if (status && !["pendente", "concluida"].includes(status)) {
      return res.status(400).json({
        erro: true,
        mensagem: "Status inválido",
      });
    }

    const tarefas = await listarTarefas(req.usuario.id, status);
    res.json(tarefas);
  } catch (err) {
    logger.error("Erro ao listar tarefas:", err);
    res.status(500).json({
      erro: true,
      mensagem: "Erro ao listar tarefas",
    });
  }
});

router.put(
  "/tarefas/:id",
  autenticarToken,
  validarTarefaId,
  async (req, res) => {
    try {
      // Validação dos dados
      const { error, value } = tarefaSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          erro: true,
          mensagem: error.details[0].message,
        });
      }

      const tarefa = await atualizarTarefa(req.params.id, value);

      io.emit("tarefaAtualizada", `Tarefa atualizada: ${tarefa.titulo}`);
      logger.info(
        `Tarefa ${req.params.id} atualizada por usuário ${req.usuario.id}`
      );

      res.json(tarefa);
    } catch (err) {
      logger.error("Erro ao atualizar tarefa:", err);
      res.status(500).json({
        erro: true,
        mensagem: "Erro ao atualizar tarefa",
      });
    }
  }
);

router.delete(
  "/tarefas/:id",
  autenticarToken,
  validarTarefaId,
  async (req, res) => {
    try {
      await deletarTarefa(req.params.id);

      io.emit("tarefaAtualizada", `Tarefa deletada!`);
      logger.info(
        `Tarefa ${req.params.id} deletada por usuário ${req.usuario.id}`
      );

      res.sendStatus(204);
    } catch (err) {
      logger.error("Erro ao deletar tarefa:", err);
      res.status(500).json({
        erro: true,
        mensagem: "Erro ao deletar tarefa",
      });
    }
  }
);

module.exports = router;
