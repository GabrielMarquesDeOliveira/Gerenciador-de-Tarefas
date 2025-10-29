const Joi = require("joi");

const registroSchema = Joi.object({
  nome: Joi.string().required().min(3).max(50),
  email: Joi.string().required().email(),
  senha: Joi.string().required().min(6),
});

const loginSchema = Joi.object({
  email: Joi.string().required().email(),
  senha: Joi.string().required(),
});

module.exports = {
  registroSchema,
  loginSchema,
};
