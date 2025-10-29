const Joi = require("joi");

const tarefaSchema = Joi.object({
  titulo: Joi.string().required().min(3).max(100).messages({
    "string.empty": "O título é obrigatório",
    "string.min": "O título deve ter no mínimo 3 caracteres",
    "string.max": "O título deve ter no máximo 100 caracteres",
  }),

  descricao: Joi.string().required().min(5).max(500).messages({
    "string.empty": "A descrição é obrigatória",
    "string.min": "A descrição deve ter no mínimo 5 caracteres",
    "string.max": "A descrição deve ter no máximo 500 caracteres",
  }),

  status: Joi.string()
    .valid("pendente", "concluida")
    .default("pendente")
    .messages({
      "any.only": "Status deve ser pendente ou concluida",
    }),
});

module.exports = {
  tarefaSchema,
};
