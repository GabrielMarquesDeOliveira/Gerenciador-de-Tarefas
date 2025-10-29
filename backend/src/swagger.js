/**
 * @swagger
 * components:
 *   schemas:
 *     Tarefa:
 *       type: object
 *       required:
 *         - titulo
 *         - descricao
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-gerado da tarefa
 *         titulo:
 *           type: string
 *           description: Título da tarefa
 *         descricao:
 *           type: string
 *           description: Descrição detalhada da tarefa
 *         status:
 *           type: string
 *           enum: [pendente, concluida]
 *           description: Status atual da tarefa
 *         usuario_id:
 *           type: integer
 *           description: ID do usuário que criou a tarefa
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/tarefas:
 *   get:
 *     summary: Retorna todas as tarefas do usuário
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pendente, concluida]
 *         description: Filtrar por status da tarefa
 *     responses:
 *       200:
 *         description: Lista de tarefas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tarefa'
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro do servidor
 *
 *   post:
 *     summary: Cria uma nova tarefa
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descricao
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tarefa criada
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro do servidor
 */

/**
 * @swagger
 * /api/tarefas/{id}:
 *   put:
 *     summary: Atualiza uma tarefa
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tarefa'
 *     responses:
 *       200:
 *         description: Tarefa atualizada
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Tarefa não encontrada
 *       500:
 *         description: Erro do servidor
 *
 *   delete:
 *     summary: Remove uma tarefa
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Tarefa removida
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Tarefa não encontrada
 *       500:
 *         description: Erro do servidor
 */
