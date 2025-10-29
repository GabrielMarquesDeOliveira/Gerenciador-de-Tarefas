/**
 * @module models
 * @description Módulo responsável pela interação com o banco de dados para operações CRUD de tarefas
 */

const pool = require("./db");
const logger = require("./logger");

/**
 * @class DatabaseError
 * @extends Error
 * @description Classe de erro customizada para operações de banco de dados
 */
class DatabaseError extends Error {
  constructor(message, operation) {
    super(message);
    this.name = "DatabaseError";
    this.operation = operation;
  }
}

/**
 * Executa uma query no banco de dados com tratamento de erros
 * @async
 * @param {string} query - Query SQL a ser executada
 * @param {Array} params - Parâmetros da query
 * @param {string} operacao - Nome da operação sendo executada
 * @returns {Promise<Object>} Resultado da query
 * @throws {DatabaseError} Se houver erro na execução da query
 */
async function executarQuery(query, params, operacao) {
  try {
    const result = await pool.query(query, params);
    return result;
  } catch (err) {
    logger.error(`Erro na operação ${operacao}:`, err);
    throw new DatabaseError(`Erro ao executar ${operacao}`, operacao);
  }
}

/**
 * Cria uma nova tarefa no banco de dados
 * @async
 * @param {string} titulo - Título da tarefa
 * @param {string} descricao - Descrição da tarefa
 * @param {number} usuarioId - ID do usuário que está criando a tarefa
 * @returns {Promise<Object>} Tarefa criada
 * @throws {DatabaseError} Se houver erro ao criar a tarefa
 */
async function criarTarefa(titulo, descricao, usuarioId) {
  const query = `
    INSERT INTO tarefas (titulo, descricao, status, usuario_id) 
    VALUES ($1, $2, $3, $4) 
    RETURNING *
  `;
  const result = await executarQuery(
    query,
    [titulo, descricao, "pendente", usuarioId],
    "criar_tarefa"
  );
  return result.rows[0];
}

async function listarTarefas(usuarioId, status) {
  let query = "SELECT * FROM tarefas WHERE usuario_id = $1";
  let params = [usuarioId];

  if (status) {
    query += " AND status = $2";
    params.push(status);
  }

  query += " ORDER BY created_at DESC";
  const result = await executarQuery(query, params, "listar_tarefas");
  return result.rows;
}

async function buscarTarefaPorId(id) {
  const query = "SELECT * FROM tarefas WHERE id = $1";
  const result = await executarQuery(query, [id], "buscar_tarefa");
  return result.rows[0];
}

async function atualizarTarefa(id, dados) {
  const { titulo, descricao, status } = dados;
  const query = `
    UPDATE tarefas 
    SET titulo = $1, descricao = $2, status = $3, updated_at = CURRENT_TIMESTAMP 
    WHERE id = $4 
    RETURNING *
  `;
  const result = await executarQuery(
    query,
    [titulo, descricao, status, id],
    "atualizar_tarefa"
  );
  return result.rows[0];
}

async function deletarTarefa(id) {
  const query = "DELETE FROM tarefas WHERE id = $1";
  await executarQuery(query, [id], "deletar_tarefa");
}

module.exports = {
  criarTarefa,
  listarTarefas,
  atualizarTarefa,
  deletarTarefa,
  buscarTarefaPorId,
};
