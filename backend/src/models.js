// Modelos de banco de dados para tarefas e usuários
const pool = require('./db');

async function criarTarefa(titulo, descricao, usuarioId) {
  const res = await pool.query(
    'INSERT INTO tarefas (titulo, descricao, status, usuario_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [titulo, descricao, 'pendente', usuarioId]
  );
  return res.rows[0];
}

async function listarTarefas(usuarioId, status) {
  let query = 'SELECT * FROM tarefas WHERE usuario_id = $1';
  let params = [usuarioId];
  if (status) {
    query += ' AND status = $2';
    params.push(status);
  }
  const res = await pool.query(query, params);
  return res.rows;
}

async function atualizarTarefa(id, dados) {
  const { titulo, descricao, status } = dados;
  const res = await pool.query(
    'UPDATE tarefas SET titulo = $1, descricao = $2, status = $3 WHERE id = $4 RETURNING *',
    [titulo, descricao, status, id]
  );
  return res.rows[0];
}

async function deletarTarefa(id) {
  await pool.query('DELETE FROM tarefas WHERE id = $1', [id]);
}

module.exports = { criarTarefa, listarTarefas, atualizarTarefa, deletarTarefa };
