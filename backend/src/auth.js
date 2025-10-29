const jwt = require("jsonwebtoken");
const logger = require("./logger");
require("dotenv").config();

function autenticarToken(req, res, next) {
  try {
    // Verifica se o header de autorização existe
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({
        erro: true,
        mensagem: "Token não fornecido",
      });
    }

    // Verifica se o formato do token está correto
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        erro: true,
        mensagem: "Formato de token inválido",
      });
    }

    // Verifica se o token é válido
    jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
      if (err) {
        logger.warn(`Token inválido: ${err.message}`);
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({
            erro: true,
            mensagem: "Token expirado",
          });
        }
        return res.status(403).json({
          erro: true,
          mensagem: "Token inválido",
        });
      }

      req.usuario = usuario;
      next();
    });
  } catch (err) {
    logger.error("Erro na autenticação:", err);
    return res.status(500).json({
      erro: true,
      mensagem: "Erro na autenticação",
    });
  }
}

module.exports = { autenticarToken };
