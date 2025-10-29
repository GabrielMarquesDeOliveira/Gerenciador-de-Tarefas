const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const helmet = require("helmet");
const logger = require("./logger");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// Configuração do Socket.IO com origem restrita
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Middlewares de segurança
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10kb" })); // Limita o tamanho do payload

// Rate limiting básico
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por windowMs
});
app.use("/api/", limiter);

// Rotas
const tarefasRoutes = require("./routes");
const usuariosRoutes = require("./usuarios");
app.use("/api", tarefasRoutes);
app.use("/api", usuariosRoutes);

// Tratamento de erros global
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    erro: true,
    mensagem: "Erro interno do servidor",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    erro: true,
    mensagem: "Rota não encontrada",
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  logger.info(`Backend rodando na porta ${PORT}`);
});

module.exports = { app, server, io };
