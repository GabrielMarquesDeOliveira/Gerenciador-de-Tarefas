const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

const tarefasRoutes = require('./routes');
const usuariosRoutes = require('./usuarios');
app.use('/api', tarefasRoutes);
app.use('/api', usuariosRoutes);

server.listen(4000, () => {
  console.log('Backend rodando na porta 4000');
});

module.exports = { app, server, io };
